"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  Eye, 
  ThumbsUp,
  BookOpen,
  Download,
  Share2,
  Star,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: 'all', name: 'All', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'climate', name: 'Climate Change', icon: <Star className="w-5 h-5" /> },
    { id: 'renewable', name: 'Renewable Energy', icon: <Play className="w-5 h-5" /> },
    { id: 'biodiversity', name: 'Biodiversity', icon: <Eye className="w-5 h-5" /> },
    { id: 'sustainability', name: 'Sustainability', icon: <ThumbsUp className="w-5 h-5" /> },
    { id: 'conservation', name: 'Conservation', icon: <Clock className="w-5 h-5" /> }
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'date', label: 'Most Recent' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  // Mock video data (in real app, this would come from YouTube API)
  const mockVideos = [
    {
      id: '1',
      title: 'Understanding Climate Change: A Complete Guide',
      description: 'Learn about the causes, effects, and solutions to climate change in this comprehensive educational video.',
      thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=225&fit=crop',
      duration: '12:34',
      views: '2.3M',
      likes: '45K',
      channel: 'Eco Education Hub',
      category: 'climate',
      publishedAt: '2024-01-15',
      rating: 4.8
    },
    {
      id: '2',
      title: 'Solar Power: How It Works and Why It Matters',
      description: 'Discover the science behind solar energy and its role in sustainable development.',
      thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=225&fit=crop',
      duration: '8:45',
      views: '1.8M',
      likes: '32K',
      channel: 'Green Tech Academy',
      category: 'renewable',
      publishedAt: '2024-01-12',
      rating: 4.7
    },
    {
      id: '3',
      title: 'Ocean Conservation: Protecting Marine Life',
      description: 'Explore the importance of ocean conservation and what we can do to protect marine ecosystems.',
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop',
      duration: '15:22',
      views: '3.1M',
      likes: '67K',
      channel: 'Marine Biology Institute',
      category: 'conservation',
      publishedAt: '2024-01-10',
      rating: 4.9
    },
    {
      id: '4',
      title: 'Biodiversity Hotspots Around the World',
      description: 'Take a journey through the world\'s most important biodiversity hotspots and their unique ecosystems.',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=225&fit=crop',
      duration: '20:15',
      views: '1.5M',
      likes: '28K',
      channel: 'Nature Explorer',
      category: 'biodiversity',
      publishedAt: '2024-01-08',
      rating: 4.6
    },
    {
      id: '5',
      title: 'Sustainable Living: Small Changes, Big Impact',
      description: 'Learn practical tips for living more sustainably and reducing your environmental footprint.',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=225&fit=crop',
      duration: '10:30',
      views: '4.2M',
      likes: '89K',
      channel: 'Sustainable Living Guide',
      category: 'sustainability',
      publishedAt: '2024-01-05',
      rating: 4.8
    },
    {
      id: '6',
      title: 'Wind Energy: The Future of Clean Power',
      description: 'Understand how wind turbines work and their potential for clean energy generation.',
      thumbnail: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=225&fit=crop',
      duration: '11:45',
      views: '1.2M',
      likes: '24K',
      channel: 'Renewable Energy Today',
      category: 'renewable',
      publishedAt: '2024-01-03',
      rating: 4.5
    }
  ]

  useEffect(() => {
    setVideos(mockVideos)
  }, [])

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.publishedAt) - new Date(a.publishedAt)
      case 'views':
        return parseInt(b.views.replace('M', '000000').replace('K', '000')) - 
               parseInt(a.views.replace('M', '000000').replace('K', '000'))
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const handleSearch = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const formatDuration = (duration) => {
    return duration
  }

  const formatViews = (views) => {
    return views
  }

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
          <h1 className="text-4xl font-bold text-slate mb-2 flex justify-center">Learning Resources</h1>
          <p className="text-black text-lg flex justify-center">Discover eco-learning videos and educational content</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for eco-learning content..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-slate placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-teal-500 text-slate shadow-lg'
                      : 'bg-white/10 text-black hover:bg-white/20 hover:text-slate'
                  }`}
                >
                  {category.icon}
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-slate focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-black">
            {loading ? 'Searching...' : `Found ${sortedVideos.length} videos`}
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVideos.map((video, index) => (
            <motion.div
              key={video.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-teal-400/50 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="p-4 bg-white/20 backdrop-blur-lg rounded-full text-slate hover:bg-white/30 transition-colors duration-200">
                    <Play className="w-8 h-8" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-slate px-2 py-1 rounded text-sm font-medium">
                  {formatDuration(video.duration)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate mb-2 line-clamp-2 group-hover:text-teal-400 transition-colors duration-300">
                  {video.title}
                </h3>
                
                <p className="text-black text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center justify-between text-sm text-black mb-4">
                  <span className="font-medium">{video.channel}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{video.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-black mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatViews(video.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{video.likes}</span>
                    </div>
                  </div>
                  <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-slate rounded-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Watch</span>
                  </button>
                  <button className="p-2 bg-white/10 text-slate rounded-lg hover:bg-white/20 transition-colors duration-200">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/10 text-slate rounded-lg hover:bg-white/20 transition-colors duration-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {sortedVideos.length > 0 && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <button className="px-8 py-3 bg-white/10 text-slate rounded-xl hover:bg-white/20 transition-colors duration-200 border border-white/20">
              Load More Videos
            </button>
          </motion.div>
        )}

        {/* No Results */}
        {sortedVideos.length === 0 && !loading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="w-16 h-16 text-black mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate mb-2">No videos found</h3>
            <p className="text-black">Try adjusting your search terms or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Resources
