"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// import { useAuth } from '../contexts/AuthContext'
import { 
  Users, 
  Plus, 
  Search, 
  Trophy, 
  Star, 
  Calendar,
  MessageCircle,
  Settings,
  Copy,
  Check,
  ArrowLeft, 
  User2
} from 'lucide-react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast'

const ClassroomConnect = () => {
//   const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('join')
  const [classCode, setClassCode] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    description: ''
  })
  const [copiedCode, setCopiedCode] = useState('')

  // Mock data for classrooms
  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      name: "Eco Warriors Grade 5",
      subject: "Environmental Science",
      teacher: "Ms. Sarah Johnson",
      students: 24,
      code: "ECO2024",
      description: "Learning about sustainability and environmental protection",
      leaderboard: [
        { name: "Alex Chen", points: 1250, avatar: "AC" },
        { name: "Maya Patel", points: 1180, avatar: "MP" },
        { name: "Jordan Kim", points: 1100, avatar: "JK" },
        { name: "Sam Wilson", points: 1050, avatar: "SW" },
        { name: "Emma Davis", points: 980, avatar: "ED" }
      ]
    },
    {
      id: 2,
      name: "Green Future High School",
      subject: "Biology",
      teacher: "Dr. Michael Brown",
      students: 18,
      code: "GREEN2024",
      description: "Advanced environmental biology and conservation",
      leaderboard: [
        { name: "Taylor Swift", points: 2100, avatar: "TS" },
        { name: "Chris Martin", points: 1950, avatar: "CM" },
        { name: "Lisa Wang", points: 1800, avatar: "LW" },
        { name: "David Lee", points: 1650, avatar: "DL" },
        { name: "Anna Garcia", points: 1500, avatar: "AG" }
      ]
    }
  ])

  const [myClassrooms, setMyClassrooms] = useState([
    {
      id: 1,
      name: "Eco Warriors Grade 5",
      subject: "Environmental Science",
      teacher: "Ms. Sarah Johnson",
      students: 24,
      code: "ECO2024",
      myPoints: 850,
      myRank: 6,
      description: "Learning about sustainability and environmental protection"
    }
  ])

  const handleJoinClass = () => {
    if (!classCode.trim()) {
      toast.error('Please enter a class code')
      return
    }

    const classroom = classrooms.find(c => c.code.toLowerCase() === classCode.toLowerCase())
    if (classroom) {
      // Add to my classrooms
      const newMyClassroom = {
        ...classroom,
        myPoints: Math.floor(Math.random() * 1000) + 500,
        myRank: Math.floor(Math.random() * 10) + 1
      }
      setMyClassrooms(prev => [...prev, newMyClassroom])
      toast.success(`Successfully joined ${classroom.name}!`)
      setClassCode('')
    } else {
      toast.error('Class code not found')
    }
  }

  const handleCreateClass = () => {
    if (!newClass.name.trim() || !newClass.subject.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const classroom = {
      id: Date.now(),
      ...newClass,
      teacher: user?.name,
      students: 1,
      code,
      leaderboard: []
    }

    setClassrooms(prev => [...prev, classroom])
    setMyClassrooms(prev => [...prev, { ...classroom, myPoints: 0, myRank: 1 }])
    setShowCreateModal(false)
    setNewClass({ name: '', subject: '', description: '' })
    toast.success('Classroom created successfully!')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    toast.success('Code copied to clipboard!')
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/dashboard">
            <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
            </Button>
        </Link>
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex justify-center">Classroom Connect</h1>
          <p className="text-gray-600 text-lg flex justify-center">Join eco-learning communities and collaborate with peers</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-xl p-1 border border-gray-300 shadow-sm">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'join'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-gray-600 hover:text-teal-500 hover:bg-gray-100'
            }`}
          >
            Join Class
          </button>
          <button
            onClick={() => setActiveTab('my-classes')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'my-classes'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-gray-600 hover:text-teal-500 hover:bg-gray-100'
            }`}
          >
            My Classes
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'browse'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-gray-600 hover:text-teal-500 hover:bg-gray-100'
            }`}
          >
            Browse Classes
          </button>
        </div>

        {/* Join Class Tab */}
        {activeTab === 'join' && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-8 border border-gray-300 shadow-md">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Join a Classroom</h2>
              
              <div className="max-w-md">
                <label className="block text-slate-700 font-medium mb-2">Class Code</label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter class code"
                  />
                  <button
                    onClick={handleJoinClass}
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-all duration-300"
                  >
                    Join
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Ask your teacher for the class code to join
                </p>
              </div>
            </div>

            {/* My Classes */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">My Classes</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClassrooms.map((classroom, index) => (
                  <motion.div
                    key={classroom.id}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-teal-400/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate mb-1">{classroom.name}</h3>
                        <p className="text-teal-400 font-medium">{classroom.subject}</p>
                        <p className="text-gray-400 text-sm">by {classroom.teacher}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-teal-400">{classroom.myPoints}</p>
                        <p className="text-sm text-gray-400">points</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">{classroom.students} students</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm">Rank #{classroom.myRank}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors duration-200">
                        View Class
                      </button>
                      <button className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200">
                        Leaderboard
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* My Classes Tab */}
        {activeTab === 'my-classes' && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate">My Classes</h2>
              {user?.type === 'teacher' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-slate rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Class</span>
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myClassrooms.map((classroom, index) => (
                <motion.div
                  key={classroom.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-teal-400/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate mb-1">{classroom.name}</h3>
                      <p className="text-teal-400 font-medium">{classroom.subject}</p>
                      <p className="text-gray-400 text-sm">by {classroom.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-teal-400">{classroom.myPoints}</p>
                      <p className="text-sm text-gray-400">points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{classroom.students} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">Rank #{classroom.myRank}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors duration-200">
                      View Class
                    </button>
                    <button className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200">
                      Leaderboard
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Browse Classes Tab */}
        {activeTab === 'browse' && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate">Browse Classes</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search classes..."
                  className="pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-slate placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 w-64"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClassrooms.map((classroom, index) => (
                <motion.div
                  key={classroom.id}
                  className="bg-white rounded-2xl p-6 border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{classroom.name}</h3>
                    <p className="text-teal-400 font-medium">{classroom.subject}</p>
                    <p className="text-gray-400 text-sm">by {classroom.teacher}</p>
                    <p className="text-gray-300 text-sm mt-2">{classroom.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{classroom.students} students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400 text-sm">Code:</span>
                        <span className="text-teal-400 font-mono">{classroom.code}</span>
                        <button
                          onClick={() => copyToClipboard(classroom.code)}
                          className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                        >
                          {copiedCode === classroom.code ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-slate rounded-lg hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300">
                    Join Class
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Create Class Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-slate mb-6">Create New Class</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate font-medium mb-2">Class Name *</label>
                  <input
                    type="text"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-slate placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                    placeholder="Enter class name"
                  />
                </div>
                
                <div>
                  <label className="block text-slate font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    value={newClass.subject}
                    onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-slate placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                    placeholder="Enter subject"
                  />
                </div>
                
                <div>
                  <label className="block text-slate font-medium mb-2">Description</label>
                  <textarea
                    value={newClass.description}
                    onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-slate placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 h-24 resize-none"
                    placeholder="Enter class description"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-white/10 text-slate rounded-xl hover:bg-white/20 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClass}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-slate rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
                >
                  Create Class
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassroomConnect
