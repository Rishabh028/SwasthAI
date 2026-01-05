import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Flag,
  Pin,
  Lock,
  Send,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

export default function ForumPost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          setUser(await base44.auth.me());
        }
      } catch (e) {
        console.log('Not authenticated');
      }
    };
    loadUser();
  }, []);

  const { data: post } = useQuery({
    queryKey: ['forumPost', postId],
    queryFn: async () => {
      const posts = await base44.entities.ForumPost.filter({ id: postId });
      return posts[0];
    },
    enabled: !!postId
  });

  const { data: replies = [] } = useQuery({
    queryKey: ['forumReplies', postId],
    queryFn: () => base44.entities.ForumReply.filter({ post_id: postId, status: 'active' }, '-created_date'),
    enabled: !!postId
  });

  const createReply = useMutation({
    mutationFn: (data) => base44.entities.ForumReply.create(data),
    onSuccess: async () => {
      await base44.entities.ForumPost.update(postId, {
        replies_count: (post.replies_count || 0) + 1
      });
      queryClient.invalidateQueries({ queryKey: ['forumReplies'] });
      queryClient.invalidateQueries({ queryKey: ['forumPost'] });
      setReplyContent('');
      toast.success('Reply posted');
    }
  });

  const upvoteReply = useMutation({
    mutationFn: async ({ replyId, currentUpvotes, upvotedBy }) => {
      const hasUpvoted = upvotedBy.includes(user.email);
      return base44.entities.ForumReply.update(replyId, {
        upvotes: hasUpvoted ? currentUpvotes - 1 : currentUpvotes + 1,
        upvoted_by: hasUpvoted 
          ? upvotedBy.filter(email => email !== user.email)
          : [...upvotedBy, user.email]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumReplies'] });
    }
  });

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to reply');
      return;
    }
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }
    createReply.mutate({
      post_id: postId,
      content: replyContent,
      author_email: user.email,
      author_name: user.full_name || user.email.split('@')[0]
    });
  };

  if (!post) return null;

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(createPageUrl('Forum'))} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forum
        </Button>

        {/* Main Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6"
        >
          <div className="flex items-start gap-2 mb-4">
            {post.is_pinned && <Pin className="w-5 h-5 text-teal-500 mt-1" />}
            <h1 className="text-2xl font-bold text-gray-900 flex-1">{post.title}</h1>
            {post.is_locked && <Lock className="w-5 h-5 text-gray-400 mt-1" />}
          </div>

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span className="font-medium">{post.author_name}</span>
            <span>•</span>
            <span>{format(new Date(post.created_date), 'PPP')}</span>
            <Badge variant="secondary" className="capitalize">
              {post.category?.replace(/_/g, ' ')}
            </Badge>
          </div>

          <div className="prose prose-gray max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <ThumbsUp className="w-5 h-5" />
              <span className="font-medium">{post.upvotes || 0} upvotes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{replies.length} replies</span>
            </div>
          </div>
        </motion.div>

        {/* Reply Form */}
        {user && !post.is_locked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Your Reply</h3>
            <form onSubmit={handleReplySubmit}>
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="mb-4 min-h-[100px]"
              />
              <Button type="submit" disabled={createReply.isPending} className="bg-teal-500 hover:bg-teal-600">
                <Send className="w-4 h-4 mr-2" />
                {createReply.isPending ? 'Posting...' : 'Post Reply'}
              </Button>
            </form>
          </motion.div>
        )}

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Replies ({replies.length})</h3>
          {replies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-medium text-gray-900">{reply.author_name}</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(reply.created_date), 'PPP')}
                    </span>
                    {reply.is_helpful && (
                      <Badge className="bg-amber-100 text-amber-700">
                        <Award className="w-3 h-3 mr-1" />
                        Helpful
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                </div>
                <button
                  onClick={() => {
                    if (user) {
                      upvoteReply.mutate({
                        replyId: reply.id,
                        currentUpvotes: reply.upvotes || 0,
                        upvotedBy: reply.upvoted_by || []
                      });
                    } else {
                      toast.error('Please login to upvote');
                    }
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    reply.upvoted_by?.includes(user?.email)
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">{reply.upvotes || 0}</span>
                </button>
              </div>
            </motion.div>
          ))}

          {replies.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No replies yet. Be the first to respond!</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}