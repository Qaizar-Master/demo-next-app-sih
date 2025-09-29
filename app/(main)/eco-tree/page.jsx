"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import { 
  Award, 
  Zap, 
  Leaf, 
  Star, 
  Target, 
  Trophy,
  ChevronRight,
  Gift,
  Flame,
  ArrowLeft,
  TreePine
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';

const EcoPoints = () => {
  const { user } = useAuth()
  const [ecoPoints, setEcoPoints] = useState(user?.ecoPoints || 0)
  const [level, setLevel] = useState(user?.level || 1)
  const [streak, setStreak] = useState(7)
  const [treeGrowth, setTreeGrowth] = useState(0)
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [boostAmount, setBoostAmount] = useState(0)

  // Calculate tree growth based on points
  useEffect(() => {
    const growthPercentage = Math.min((ecoPoints / 1000) * 100, 100)
    setTreeGrowth(growthPercentage)
  }, [ecoPoints])

  // Calculate level based on points
  useEffect(() => {
    const newLevel = Math.floor(ecoPoints / 100) + 1
    setLevel(newLevel)
  }, [ecoPoints])

  const dailyTasks = [
    {
      id: 1,
      title: "Complete daily quiz",
      points: 50,
      completed: true,
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 2,
      title: "Read eco-article",
      points: 30,
      completed: true,
      icon: <Leaf className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Share eco-tip",
      points: 25,
      completed: false,
      icon: <Star className="w-5 h-5" />
    },
    {
      id: 4,
      title: "Join classroom discussion",
      points: 40,
      completed: false,
      icon: <Award className="w-5 h-5" />
    }
  ]

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first task",
      icon: <Trophy className="w-6 h-6" />,
      unlocked: true,
      points: 100
    },
    {
      id: 2,
      title: "Eco Warrior",
      description: "Reach level 5",
      icon: <Flame className="w-6 h-6" />,
      unlocked: level >= 5,
      points: 500
    },
    {
      id: 3,
      title: "Streak Master",
      description: "Maintain 30-day streak",
      icon: <Zap className="w-6 h-6" />,
      unlocked: streak >= 30,
      points: 1000
    }
  ]

  const rewards = [
    {
      id: 1,
      title: "Eco Badge",
      cost: 200,
      icon: <Award className="w-6 h-6" />,
      available: ecoPoints >= 200
    },
    {
      id: 2,
      title: "Profile Frame",
      cost: 500,
      icon: <Gift className="w-6 h-6" />,
      available: ecoPoints >= 500
    },
    {
      id: 3,
      title: "Special Avatar",
      cost: 1000,
      icon: <Star className="w-6 h-6" />,
      available: ecoPoints >= 1000
    }
  ]

  const handleTaskComplete = (taskId) => {
    const task = dailyTasks.find(t => t.id === taskId)
    if (task && !task.completed) {
      setEcoPoints(prev => prev + task.points)
      toast.success(`+${task.points} points!`)
    }
  }

  const handleBoost = () => {
    if (boostAmount > 0 && ecoPoints >= boostAmount) {
      setEcoPoints(prev => prev - boostAmount)
      setStreak(prev => prev + 1)
      toast.success('Streak boosted!')
      setShowBoostModal(false)
    }
  }

  return (
  <div className="min-h-screen bg-white/10 p-6">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-4xl font-bold text-slate mb-2 flex justify-center">Eco Points</h1>
          <p className="text-black text-lg flex justify-center">Track your sustainability journey and grow your eco-tree</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tree and Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Eco Tree */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 outline-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-slate mb-6 text-center">Your Eco Tree</h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Tree Container */}
                  <div className="w-64 h-64 relative">
                    {/* Tree Trunk */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 bg-amber-600 rounded-t-lg"
                      style={{ height: `${Math.max(20, treeGrowth * 0.3)}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(20, treeGrowth * 0.3)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    
                    {/* Tree Leaves */}
                    <motion.div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-green-500 rounded-full"
                      style={{ 
                        scale: treeGrowth / 100,
                        opacity: treeGrowth / 100
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: treeGrowth / 100,
                        opacity: treeGrowth / 100
                      }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                    
                    {/* Additional Leaves */}
                    <motion.div
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-green-400 rounded-full"
                      style={{ 
                        scale: Math.max(0, (treeGrowth - 30) / 100),
                        opacity: Math.max(0, (treeGrowth - 30) / 100)
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: Math.max(0, (treeGrowth - 30) / 100),
                        opacity: Math.max(0, (treeGrowth - 30) / 100)
                      }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                  
                  {/* Growth Percentage */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-2xl font-bold text-teal-400">{Math.round(treeGrowth)}%</p>
                    <p className="text-sm text-black">Growth</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-4 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-teal-400 h-4 rounded-full"
                  style={{ width: `${treeGrowth}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${treeGrowth}%` }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </div>
              
              <p className="text-center text-black">
                {ecoPoints} / 1000 points to next growth stage
              </p>
            </motion.div>

            {/* Daily Tasks */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 outline-0 outline-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate mb-6">Daily Tasks</h2>
              <div className="space-y-4">
                {dailyTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                      task.completed
                        ? 'bg-green-500/20 border-green-400/50 text-green-400'
                        : 'bg-white/10 border-white/20 text-slate hover:border-teal-400/50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        task.completed ? 'bg-green-500/20' : 'bg-white/10'
                      }`}>
                        {task.icon}
                      </div>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-black">+{task.points} points</p>
                      </div>
                    </div>
                    
                    {!task.completed && (
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className="px-4 py-2 bg-teal-500 text-slate rounded-lg hover:bg-teal-600 transition-colors duration-200"
                      >
                        Complete
                      </button>
                    )}
                    
                    {task.completed && (
                      <div className="text-green-400">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats and Rewards */}
          <div className="space-y-8">
            {/* Stats */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 outline-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-slate mb-6 ">Your Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-teal-400" />
                    <span className="text-slate">Total Points</span>
                  </div>
                  <span className="text-2xl font-bold text-teal-400">{ecoPoints}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-blue-400" />
                    <span className="text-slate">Level</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">{level}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Flame className="w-6 h-6 text-yellow-400" />
                    <span className="text-slate">Streak</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{streak} days</span>
                </div>
              </div>

              <button
                onClick={() => setShowBoostModal(true)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-slate rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
              >
                Boost Streak
              </button>
            </motion.div>

            {/* Achievements */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 outline-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-slate mb-6">Achievements</h2>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-yellow-500/20 border border-yellow-400/50'
                        : 'bg-white/5 border border-white/10'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-black'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        achievement.unlocked ? 'text-yellow-400' : 'text-black'
                      }`}>
                        {achievement.title}
                      </p>
                      <p className="text-sm text-black">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <span className="text-yellow-400 font-bold">+{achievement.points}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Rewards Shop */}
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 outline-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-slate mb-6">Rewards Shop</h2>
              
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                      reward.available
                        ? 'bg-teal-500/20 border-teal-400/50 hover:border-teal-400'
                        : 'bg-white/5 border-white/10'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        reward.available ? 'bg-teal-500/20 text-teal-400' : 'bg-white/10 text-black'
                      }`}>
                        {reward.icon}
                      </div>
                      <span className={`font-medium ${
                        reward.available ? 'text-slate' : 'text-black'
                      }`}>
                        {reward.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${
                        reward.available ? 'text-teal-400' : 'text-black'
                      }`}>
                        {reward.cost}
                      </span>
                      {reward.available && (
                        <button className="px-3 py-1 bg-teal-500 text-slate rounded-lg text-sm hover:bg-teal-600 transition-colors duration-200">
                          Buy
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Boost Modal */}
        {showBoostModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-slate mb-4">Boost Your Streak</h3>
              <p className="text-black mb-6">
                Use your eco points to boost your daily streak and earn bonus rewards!
              </p>
              
              <div className="mb-6">
                <label className="block text-slate font-medium mb-2">Points to spend:</label>
                <input
                  type="number"
                  value={boostAmount}
                  onChange={(e) => setBoostAmount(Number(e.target.value))}
                  min="0"
                  max={ecoPoints}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-slate placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBoostModal(false)}
                  className="flex-1 py-3 bg-white/10 text-slate rounded-xl hover:bg-white/20 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBoost}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-slate rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
                >
                  Boost
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EcoPoints
