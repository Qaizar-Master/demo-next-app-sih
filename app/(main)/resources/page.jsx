"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Play,
  BookOpen,
  Share2,
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
  const [error, setError] = useState(null)
  const [nextPageToken, setNextPageToken] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)

  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'climate', name: 'Climate Change' },
    { id: 'renewable', name: 'Renewable Energy' },
    { id: 'biodiversity', name: 'Biodiversity' },
    { id: 'sustainability', name: 'Sustainability' },
    { id: 'conservation', name: 'Conservation' }
  ]

  const fetchVideos = async (query, categoryId, pageToken = '') => {
    const isLoadingMore = pageToken !== ''
    if (isLoadingMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    setError(null)
    try {
      let searchQueryToUse = query || 'environmental education'
      if (categoryId !== 'all') {
        const categoryName = categories.find(c => c.id === categoryId)?.name || ''
        searchQueryToUse = `${categoryName} ${query}`.trim()
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(searchQueryToUse + ' -shorts')}&type=video&videoDuration=medium&pageToken=${pageToken}&key=${API_KEY}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch videos')
      }

      const data = await response.json()
      setNextPageToken(data.nextPageToken || '')

      const transformedVideos = data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        channel: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }))

      if (isLoadingMore) {
        setVideos(prev => [...prev, ...transformedVideos])
      } else {
        setVideos(transformedVideos)
      }
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Failed to load videos. Please try again later.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    setNextPageToken('')
    fetchVideos(searchQuery, selectedCategory)
  }, [selectedCategory])

  const handleSearch = () => {
    setNextPageToken('')
    fetchVideos(searchQuery, selectedCategory)
  }

  const handleLoadMore = () => {
    if (nextPageToken) {
      fetchVideos(searchQuery, selectedCategory, nextPageToken)
    }
  }

  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.publishedAt) - new Date(a.publishedAt)
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-white text-slate-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 text-slate-600 hover:bg-emerald-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
            Learning Resources
          </h1>
          <p className="text-slate-10000 text-lg">
            Discover eco-learning videos and educational content
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-emerald-100 mb-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search eco-learning videos..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-emerald-100 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white border border-emerald-100 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-400"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>



          </div>
        </motion.div>

        {/* Results */}
        <div className="mb-6">
          {error ? (
            <p className="text-red-500 font-medium">{error}</p>
          ) : (
            <p className="text-slate-600">
              {loading ? 'Searching YouTube...' : `Found ${sortedVideos.length} videos`}
            </p>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedVideos.map((video, index) => (
            <motion.div
              key={video.id + index}
              className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden border border-emerald-100 hover:border-emerald-400 transition-all group shadow-sm hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >

              {/* Thumbnail */}
              <div
                className="relative cursor-pointer"
                onClick={() => window.open(video.videoUrl, '_blank')}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-52 object-cover"
                />

                <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full shadow-xl">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {video.title}
                </h3>

                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                  {video.description}
                </p>

                <div className="flex justify-between text-xs font-medium text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {video.channel}
                  </span>
                  <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(video.videoUrl, '_blank')}
                    className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-sky-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Play className="w-4 h-4" />
                    Watch Now
                  </button>

                  <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {nextPageToken && (
          <div className="text-center mt-12">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              variant="outline"
              className="px-10 h-12 border-emerald-100 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl font-medium"
            >
              {loadingMore ? "Loading more..." : "Load More Videos"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Resources