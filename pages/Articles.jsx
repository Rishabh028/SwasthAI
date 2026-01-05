import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Search,
  BookOpen,
  Clock,
  Eye,
  Heart,
  ChevronRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageTransition from '@/components/ui/PageTransition';
import { SkeletonList } from '@/components/ui/SkeletonLoader';

const categories = [
  { value: 'all', label: 'All Topics' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'diseases', label: 'Diseases' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'women_health', label: "Women's Health" },
  { value: 'child_health', label: "Children's Health" },
  { value: 'senior_care', label: 'Senior Care' },
  { value: 'preventive_care', label: 'Preventive Care' },
];

const categoryColors = {
  nutrition: 'bg-green-100 text-green-700',
  fitness: 'bg-blue-100 text-blue-700',
  mental_health: 'bg-purple-100 text-purple-700',
  diseases: 'bg-red-100 text-red-700',
  lifestyle: 'bg-amber-100 text-amber-700',
  women_health: 'bg-pink-100 text-pink-700',
  child_health: 'bg-cyan-100 text-cyan-700',
  senior_care: 'bg-indigo-100 text-indigo-700',
  preventive_care: 'bg-teal-100 text-teal-700',
};

export default function Articles() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ is_published: true }, '-created_date', 50),
  });

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          article.title?.toLowerCase().includes(searchLower) ||
          article.excerpt?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (category !== 'all' && article.category !== category) return false;
      return true;
    });
  }, [articles, search, category]);

  const featuredArticles = filteredArticles.filter(a => a.is_featured).slice(0, 3);
  const regularArticles = filteredArticles.filter(a => !a.is_featured);

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-700 to-slate-900 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Health Articles & Insights
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Expert health tips, wellness guides, and the latest medical insights 
              to help you live a healthier life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container mx-auto px-4 -mt-8 relative z-10 mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48 h-12 rounded-xl">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="container mx-auto px-4 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-teal-500" />
            <h2 className="text-xl font-bold text-gray-900">Featured Articles</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <Link key={article.id} to={createPageUrl(`ArticleRead?id=${article.id}`)}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {article.cover_image ? (
                    <img 
                      src={article.cover_image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <Badge className={`absolute top-3 left-3 ${categoryColors[article.category] || 'bg-gray-100'}`}>
                    {article.category?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.read_time_minutes || 5} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views || 0}
                    </span>
                  </div>
                </div>
              </motion.article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">All Articles</h2>
        
        {isLoading ? (
          <SkeletonList count={6} />
        ) : regularArticles.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {regularArticles.map((article, index) => (
              <Link key={article.id} to={createPageUrl(`ArticleRead?id=${article.id}`)}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    {article.cover_image ? (
                      <img 
                        src={article.cover_image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs ${categoryColors[article.category] || 'bg-gray-100'}`}>
                        {article.category?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 hidden md:block">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {article.author_name && (
                        <span className="flex items-center gap-1">
                          By {article.author_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.read_time_minutes || 5} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {article.views || 0}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="hidden md:flex items-center">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-teal-500">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}