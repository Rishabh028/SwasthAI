import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  MessageSquare,
  Plus,
  Search,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Pin,
  Lock,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageTransition from '@/components/ui/PageTransition';
import { toast } from 'react-hot-toast';

export default function Forum() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const queryClient = useQueryClient();

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

  const { data: posts = [] } = useQuery({
    queryKey: ['forumPosts', category],
    queryFn: () => {
      if (category === 'all') {
        return base44.entities.ForumPost.filter({ status: 'active' }, '-created_date');
      }
      return base44.entities.ForumPost.filter({ status: 'active', category }, '-created_date');
    }
  });

  const upvotePost = useMutation({
    mutationFn: async ({ postId, currentUpvotes, upvotedBy }) => {
      const hasUpvoted = upvotedBy.includes(user.email);
      return base44.entities.ForumPost.update(postId, {
        upvotes: hasUpvoted ? currentUpvotes - 1 : currentUpvotes + 1,
        upvoted_by: hasUpvoted 
          ? upvotedBy.filter(email => email !== user.email)
          : [...upvotedBy, user.email]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
    }
  });

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(search.toLowerCase()) ||
    post.content?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'general', label: 'General Health' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'diseases', label: 'Diseases' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  return (
    <PageTransition className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Community Forum</h1>
            <p className="text-gray-500 mt-1">Share experiences and support each other</p>
          </div>
          {user && (
            <Link to={createPageUrl('CreatePost')}>
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </Link>
          )}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search discussions..."
                className="pl-10"
              />
            </div>
            <Tabs value={category} onValueChange={setCategory} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full">
                {categories.map((cat) => (
                  <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={createPageUrl(`ForumPost?id=${post.id}`)}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        {post.is_pinned && <Pin className="w-4 h-4 text-teal-500 mt-1" />}
                        <h3 className="font-semibold text-gray-900 text-lg hover:text-teal-600">
                          {post.title}
                        </h3>
                        {post.is_locked && <Lock className="w-4 h-4 text-gray-400 mt-1" />}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{post.author_name}</span>
                        <span>•</span>
                        <span>{format(new Date(post.created_date), 'MMM d, yyyy')}</span>
                        <Badge variant="secondary" className="capitalize">
                          {post.category?.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (user) {
                            upvotePost.mutate({
                              postId: post.id,
                              currentUpvotes: post.upvotes || 0,
                              upvotedBy: post.upvoted_by || []
                            });
                          } else {
                            toast.error('Please login to upvote');
                          }
                        }}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                          post.upvoted_by?.includes(user?.email)
                            ? 'text-teal-600 bg-teal-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.upvotes || 0}</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.replies_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Be the first to start a discussion!</p>
              {user && (
                <Link to={createPageUrl('CreatePost')}>
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}