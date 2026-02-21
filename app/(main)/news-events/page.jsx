"use client";

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Filter,
  Search,
  Star,
  Bookmark,
  Share2,
  ArrowLeft,
  BookOpen,
  Play,
  Eye,
  ThumbsUp,
  Loader2
} from 'lucide-react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = [
  { id: 'all', name: 'All', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'climate', name: 'Climate Change', icon: <Star className="w-5 h-5" /> },
  { id: 'renewable', name: 'Renewable Energy', icon: <Play className="w-5 h-5" /> },
  { id: 'biodiversity', name: 'Biodiversity', icon: <Eye className="w-5 h-5" /> },
  { id: 'sustainability', name: 'Sustainability', icon: <ThumbsUp className="w-5 h-5" /> },
  { id: 'conservation', name: 'Conservation', icon: <Clock className="w-5 h-5" /> }
];

const NewsEvents = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Debounced fetch
  const fetchNews = useCallback(async (query, category) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      if (category && category !== 'all') params.set('category', category);

      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch news');
      }

      setArticles(data.articles || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search — wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNews(searchQuery, selectedCategory);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, fetchNews]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link href="/dashboard">
          <span className='outline rounded'>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </span>
        </Link>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-slate mb-2 flex justify-center">News & Events</h1>
          <p className="text-black text-lg flex justify-center">Stay updated with the latest eco-news and upcoming events</p>
        </motion.div>

        {/* Search Bar and Category Dropdown */}
        <div className="my-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any topic... (e.g. solar energy, ocean, recycling)"
              className="w-full h-14 p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[260px] h-5 bg-white border border-gray-300 rounded-lg text-slate-800">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error State */}
        {error && (
          <div className="my-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            <p className="font-medium">⚠️ {error}</p>
            <p className="text-sm mt-1">Please check your API key in <code>.env.local</code> and restart the dev server.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-14 h-14 text-teal-500 animate-spin" />
            <p className="text-slate-500 text-lg">Fetching latest news...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">No articles found</p>
            <p className="text-gray-400 mt-2">Try a different search term or category</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate mb-6">
              {searchQuery ? `Results for "${searchQuery}"` : 'Latest News'}
              <span className="text-base font-normal text-gray-500 ml-2">({articles.length} articles)</span>
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {articles.map((article) => (
                <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: article.id * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-teal-400/50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=600&h=300&fit=crop";
                        }}
                      />
                      {article.featured && (
                        <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">{article.category}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.author}</span>
                        <span className="flex items-center gap-1 text-teal-600 font-medium group-hover:underline">
                          Read more <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
};

export default NewsEvents