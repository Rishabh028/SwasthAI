import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  Share2,
  Bookmark,
  MessageCircle,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

export default function ArticleRead() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

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

  const { data: article } = useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const articles = await base44.entities.Article.filter({ id: articleId });
      if (articles.length > 0) {
        const article = articles[0];
        await base44.entities.Article.update(articleId, {
          views: (article.views || 0) + 1
        });
        return article;
      }
      return null;
    },
    enabled: !!articleId
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['articleComments', articleId],
    queryFn: () => base44.entities.ArticleComment.filter({ article_id: articleId, status: 'active' }, '-created_date'),
    enabled: !!articleId
  });

  const createComment = useMutation({
    mutationFn: (data) => base44.entities.ArticleComment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articleComments'] });
      setCommentContent('');
      toast.success('Comment posted');
    }
  });

  const upvoteComment = useMutation({
    mutationFn: async ({ commentId, currentUpvotes, upvotedBy }) => {
      const hasUpvoted = upvotedBy.includes(user.email);
      return base44.entities.ArticleComment.update(commentId, {
        upvotes: hasUpvoted ? currentUpvotes - 1 : currentUpvotes + 1,
        upvoted_by: hasUpvoted 
          ? upvotedBy.filter(email => email !== user.email)
          : [...upvotedBy, user.email]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articleComments'] });
    }
  });

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!commentContent.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    createComment.mutate({
      article_id: articleId,
      content: commentContent,
      author_email: user.email,
      author_name: user.full_name || user.email.split('@')[0]
    });
  };

  if (!article) {
    return (
      <PageTransition className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Button onClick={() => navigate(createPageUrl('Articles'))}>
            Browse Articles
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(createPageUrl('Articles'))} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Button>

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {article.cover_image && (
            <img 
              src={article.cover_image} 
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}

          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium capitalize">
                {article.category?.replace(/_/g, ' ')}
              </span>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.read_time_minutes} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.views || 0} views
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              {article.author_image && (
                <img 
                  src={article.author_image} 
                  alt={article.author_name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">{article.author_name}</p>
                <p className="text-sm text-gray-500">{article.author_credentials}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              {article.content?.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="mb-4 min-h-[100px]"
              />
              <Button type="submit" disabled={createComment.isPending} className="bg-teal-500 hover:bg-teal-600">
                <Send className="w-4 h-4 mr-2" />
                {createComment.isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>
          )}

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">{comment.author_name}</span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(comment.created_date), 'PPP')}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                </div>
                <button
                  onClick={() => {
                    if (user) {
                      upvoteComment.mutate({
                        commentId: comment.id,
                        currentUpvotes: comment.upvotes || 0,
                        upvotedBy: comment.upvoted_by || []
                      });
                    } else {
                      toast.error('Please login to upvote');
                    }
                  }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    comment.upvoted_by?.includes(user?.email)
                      ? 'text-teal-600 bg-teal-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm">{comment.upvotes || 0}</span>
                </button>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}