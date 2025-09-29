"use client";

import { useState, useEffect } from 'react'
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
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NewsEvents = () => {
  const [activeTab, setActiveTab] = useState('news')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All', color: 'bg-gray-500' },
    { id: 'climate', name: 'Climate', color: 'bg-red-500' },
    { id: 'conservation', name: 'Conservation', color: 'bg-green-500' },
    { id: 'renewable', name: 'Renewable Energy', color: 'bg-blue-500' },
    { id: 'sustainability', name: 'Sustainability', color: 'bg-teal-500' },
    { id: 'education', name: 'Education', color: 'bg-purple-500' }
  ]

  const newsArticles = [
    {
      id: 1,
      title: 'New Solar Technology Breaks Efficiency Records',
      excerpt: 'Scientists have developed a new type of solar panel that achieves 47% efficiency, potentially revolutionizing renewable energy.',
      content: 'A breakthrough in solar technology has been achieved by researchers at the National Renewable Energy Laboratory. The new perovskite-silicon tandem solar cell has reached an efficiency of 47.1%, significantly higher than traditional silicon panels. This development could make solar energy more affordable and accessible worldwide...',
      category: 'renewable',
      author: 'Dr. Sarah Chen',
      publishedAt: '2024-01-15',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=300&fit=crop',
      featured: true,
      tags: ['solar', 'renewable energy', 'technology']
    },
    {
      id: 2,
      title: 'Ocean Cleanup Project Removes 100,000 Tons of Plastic',
      excerpt: 'The Ocean Cleanup initiative has successfully removed over 100,000 tons of plastic waste from the Great Pacific Garbage Patch.',
      content: 'In a major milestone for ocean conservation, The Ocean Cleanup project has announced the successful removal of 100,000 tons of plastic waste from the Great Pacific Garbage Patch. This represents the largest ocean cleanup operation in history and demonstrates the potential for large-scale environmental restoration...',
      category: 'conservation',
      author: 'Marine Conservation Team',
      publishedAt: '2024-01-12',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=300&fit=crop',
      featured: false,
      tags: ['ocean cleanup', 'plastic waste', 'conservation']
    },
    {
      id: 3,
      title: 'Climate Change Education Now Mandatory in Schools',
      excerpt: 'New legislation requires climate change education to be integrated into all school curricula nationwide.',
      content: 'In a landmark decision, the Department of Education has announced that climate change education will now be mandatory in all schools across the country. This comprehensive curriculum will cover the science of climate change, its impacts, and solutions, preparing students to be informed environmental citizens...',
      category: 'education',
      author: 'Education Policy Team',
      publishedAt: '2024-01-10',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=300&fit=crop',
      featured: false,
      tags: ['education', 'climate change', 'policy']
    },
    {
      id: 4,
      title: 'Urban Farming Initiative Feeds 10,000 Families',
      excerpt: 'A community-led urban farming project has successfully provided fresh produce to over 10,000 families in the city.',
      content: 'The Green City Initiative has achieved a remarkable milestone by establishing urban farms across the city that now feed over 10,000 families. This project demonstrates how sustainable agriculture can be integrated into urban environments while addressing food security and environmental concerns...',
      category: 'sustainability',
      author: 'Urban Agriculture Team',
      publishedAt: '2024-01-08',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=300&fit=crop',
      featured: true,
      tags: ['urban farming', 'food security', 'sustainability']
    }
  ]

  const events = [
    {
      id: 1,
      title: 'Global Climate Summit 2024',
      description: 'Join world leaders, scientists, and activists for the most important climate conference of the year.',
      date: '2024-03-15',
      time: '09:00 - 18:00',
      location: 'New York, NY',
      type: 'Conference',
      attendees: 5000,
      price: 'Free',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=300&fit=crop',
      category: 'climate',
      featured: true
    },
    {
      id: 2,
      title: 'Community Tree Planting Day',
      description: 'Help us plant 1000 trees in the local park to combat climate change and improve air quality.',
      date: '2024-02-20',
      time: '08:00 - 12:00',
      location: 'Central Park, City Center',
      type: 'Volunteer',
      attendees: 200,
      price: 'Free',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop',
      category: 'conservation',
      featured: false
    },
    {
      id: 3,
      title: 'Renewable Energy Workshop',
      description: 'Learn about solar and wind energy installation for homes and businesses.',
      date: '2024-02-25',
      time: '14:00 - 17:00',
      location: 'Tech Innovation Center',
      type: 'Workshop',
      attendees: 50,
      price: '$25',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=300&fit=crop',
      category: 'renewable',
      featured: false
    },
    {
      id: 4,
      title: 'Sustainable Living Expo',
      description: 'Discover eco-friendly products and services for sustainable living.',
      date: '2024-03-01',
      time: '10:00 - 16:00',
      location: 'Convention Center',
      type: 'Exhibition',
      attendees: 1000,
      price: '$10',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=300&fit=crop',
      category: 'sustainability',
      featured: true
    }
  ]

  const filteredNews = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
        
          <h1 className="text-4xl font-bold text-slate mb-2 flex justify-center">News & Events</h1>
          <p className="text-black text-lg flex justify-center">Stay updated with the latest eco-news and upcoming events</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 backdrop-blur-lg rounded-xl p-1 border border-white/20">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'news'
                ? 'bg-teal-500 text-slate shadow-lg'
                : 'text-black hover:text-slate hover:bg-white/10'
            }`}
          >
            Latest News
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'events'
                ? 'bg-teal-500 text-slate shadow-lg'
                : 'text-black hover:text-slate hover:bg-white/10'
            }`}
          >
            Upcoming Events
          </button>
        </div>

        {/* Search and Filters */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news and events..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-slate placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              />
            </div>
            
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
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-8">
            {/* Featured Articles */}
            <div>
              <h2 className="text-2xl font-bold text-slate mb-6">Featured Articles</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredNews.filter(article => article.featured).map((article, index) => (
                  <motion.article
                    key={article.id}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-teal-400/50 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          categories.find(c => c.id === article.category)?.color || 'bg-gray-500'
                        } text-slate`}>
                          {categories.find(c => c.id === article.category)?.name}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button className="p-2 bg-white/20 backdrop-blur-lg rounded-full text-slate hover:bg-white/30 transition-colors duration-200">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate mb-2 group-hover:text-teal-400 transition-colors duration-300">
                        {article.title}
                      </h3>
                      <p className="text-black mb-4 line-clamp-2">{article.excerpt}</p>
                      
                      <div className="flex items-center justify-between text-sm text-black mb-4">
                        <div className="flex items-center space-x-4">
                          <span>By {article.author}</span>
                          <span>•</span>
                          <span>{formatDate(article.publishedAt)}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-black hover:text-teal-400 transition-colors duration-200">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <button className="w-full py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-slate rounded-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300">
                        Read More
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* All Articles */}
            <div>
              <h2 className="text-2xl font-bold text-slate mb-6">All Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((article, index) => (
                  <motion.article
                    key={article.id}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-teal-400/50 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          categories.find(c => c.id === article.category)?.color || 'bg-gray-500'
                        } text-slate`}>
                          {categories.find(c => c.id === article.category)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-slate mb-2 group-hover:text-teal-400 transition-colors duration-300 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-black text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                      
                      <div className="flex items-center justify-between text-xs text-black">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            {/* Featured Events */}
            <div>
              <h2 className="text-2xl font-bold text-slate mb-6">Featured Events</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredEvents.filter(event => event.featured).map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-teal-400/50 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-teal-500 text-slate rounded-full text-xs font-medium">
                          {event.type}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button className="p-2 bg-white/20 backdrop-blur-lg rounded-full text-slate hover:bg-white/30 transition-colors duration-200">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate mb-2 group-hover:text-teal-400 transition-colors duration-300">
                        {event.title}
                      </h3>
                      <p className="text-black mb-4">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-black">
                          <Calendar className="w-4 h-4" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-black">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-black">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-black">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attendees</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-teal-400">{event.price}</span>
                        <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-slate rounded-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300">
                          Register
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* All Events */}
            <div>
              <h2 className="text-2xl font-bold text-slate mb-6">All Events</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-teal-400/50 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-teal-500 text-slate rounded-full text-xs font-medium">
                          {event.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-slate mb-2 group-hover:text-teal-400 transition-colors duration-300">
                        {event.title}
                      </h3>
                      <p className="text-black text-sm mb-3 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center space-x-2 text-xs text-black">
                          <Calendar className="w-3 h-3" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-black">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-teal-400">{event.price}</span>
                        <button className="px-4 py-1 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors duration-200 text-sm">
                          Register
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsEvents
