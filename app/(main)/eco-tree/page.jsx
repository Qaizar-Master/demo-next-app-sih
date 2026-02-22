"use client";

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  TreePine,
  Sparkles,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import dynamic from 'next/dynamic';

const DynamicPhaserTree = dynamic(() => import('@/components/PhaserTree'), {
  ssr: false,
});

const EcoPoints = () => {
  const { isLoaded, userId } = useAuth()
  const [ecoPoints, setEcoPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [treeGrowth, setTreeGrowth] = useState(0)
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [boostAmount, setBoostAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [completingTask, setCompletingTask] = useState(null)

  const [dailyTasks, setDailyTasks] = useState([
    {
      id: "daily-quiz",
      title: "Complete daily quiz",
      points: 50,
      completed: false, // In a real app, these would come from DB too
      icon: <Target className="w-5 h-5 text-blue-400" />
    },
    {
      id: "eco-article",
      title: "Read eco-article",
      points: 30,
      completed: false,
      icon: <Leaf className="w-5 h-5 text-green-400" />
    },
    {
      id: "eco-tip",
      title: "Share eco-tip",
      points: 25,
      completed: false,
      icon: <Star className="w-5 h-5 text-yellow-400" />
    }
  ])

  // Fetch initial profile data
  useEffect(() => {
    if (isLoaded && userId) {
      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/profile');
          const data = await res.json();
          if (res.ok) {
            setEcoPoints(data.totalPoints || 0);
            setLevel(data.progress?.level || 1);
            setStreak(data.progress?.currentStreak || 0);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [isLoaded, userId]);

  // Calculate tree growth based on points (progress within current level or total?)
  // Let's stick to total points for now but maybe localized to level milestones
  useEffect(() => {
    const nextLevelPoints = level * 100;
    const currentLevelPoints = (level - 1) * 100;
    const progress = Math.min(((ecoPoints - currentLevelPoints) / 100) * 100, 100);
    setTreeGrowth(Math.max(0, progress));
  }, [ecoPoints, level])


  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first task",
      icon: <Trophy className="w-5 h-5" />,
      unlocked: ecoPoints > 0,
      points: 100
    },
    {
      id: 2,
      title: "Eco Warrior",
      description: "Reach level 5",
      icon: <Flame className="w-5 h-5" />,
      unlocked: level >= 5,
      points: 500
    },
    {
      id: 3,
      title: "Tree Master",
      description: "Grow a magnificent tree",
      icon: <TreePine className="w-5 h-5" />,
      unlocked: level >= 10,
      points: 1000
    }
  ]

  const handleTaskComplete = async (task) => {
    if (task.completed || completingTask) return;

    setCompletingTask(task.id);
    try {
      const res = await fetch('/api/eco-tree/complete-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, points: task.points })
      });

      const data = await res.json();
      if (res.ok) {
        setEcoPoints(data.points);
        setLevel(data.level);
        setDailyTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: true } : t));
        toast.success(`+${task.points} points synced!`, {
          icon: '🌱',
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#fff',
          },
        });
      } else {
        toast.error("Failed to sync points");
      }
    } catch (error) {
      toast.error("Connection error");
    } finally {
      setCompletingTask(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <TreePine className="w-10 h-10 text-green-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Eco Tree</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Nurture your digital ecosystem through real-world sustainability actions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Phaser Tree Card */}
            <motion.div
              className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute top-6 left-6 z-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 shadow-sm">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-slate-700">Level {level}</span>
                </div>
              </div>

              <div className="p-8 pb-0 flex flex-col items-center">
                <div className="w-full relative min-h-[450px] flex items-center justify-center">
                  <DynamicPhaserTree points={ecoPoints} />
                </div>

                {/* Growth Info */}
                <div className="w-full max-w-xl pb-12 mt-4">
                  <div className="flex justify-between items-end mb-3 px-1">
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Growth Progress</h3>
                      <p className="text-2xl font-black text-slate-800">Next Stage in {Math.round(100 - treeGrowth)}%</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-green-500">{ecoPoints}</span>
                      <span className="text-slate-300 ml-1 font-bold">/ {level * 100}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${treeGrowth}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Daily Tasks */}
            <section>
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-2xl font-bold text-slate-900">Daily Quests</h2>
                <div className="flex items-center text-slate-400 gap-1 text-sm">
                  <Info className="w-4 h-4" />
                  <span>Resets in 12h</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {dailyTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`p-5 rounded-2xl border transition-all ${task.completed
                      ? 'bg-slate-50 border-slate-100'
                      : 'bg-white border-slate-200 hover:border-green-300 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.completed ? 'bg-slate-200' : 'bg-slate-50'}`}>
                          {task.icon}
                        </div>
                        <div>
                          <h4 className={`font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</h4>
                          <span className="text-sm font-medium text-green-600">+{task.points} pts</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={task.completed || completingTask === task.id}
                        onClick={() => handleTaskComplete(task)}
                        className={`rounded-xl px-6 ${task.completed
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200'
                          }`}
                      >
                        {task.completed ? 'Done' : completingTask === task.id ? '...' : 'Claim'}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Stats & Rewards - Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats Card */}
            <motion.div
              className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-slate-400 mb-8">Ecosystem Vitality</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><Zap className="w-5 h-5 text-yellow-400" /></div>
                    <span className="font-medium">Daily Streak</span>
                  </div>
                  <span className="text-2xl font-black">{streak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg"><Award className="w-5 h-5 text-emerald-400" /></div>
                    <span className="font-medium">Lifetime Pts</span>
                  </div>
                  <span className="text-2xl font-black">{ecoPoints}</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-8 rounded-2xl border-white/20 text-white hover:bg-white/10"
                onClick={() => setShowBoostModal(true)}
              >
                Boost Vitality
              </Button>
            </motion.div>

            {/* Achievements Card */}
            <motion.div
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">Milestones</h3>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-4 p-3 rounded-2xl transition-colors ${achievement.unlocked ? 'bg-slate-50' : 'opacity-40 grayscale'}`}
                  >
                    <div className={`p-3 rounded-xl ${achievement.unlocked ? 'bg-amber-100 text-amber-600' : 'bg-slate-100'}`}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{achievement.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Boost Modal (Minimalist) */}
      <AnimatePresence>
        {showBoostModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <h3 className="text-2xl font-black text-slate-900 mb-2">Enhance Ecosystem</h3>
              <p className="text-slate-500 mb-8">Allocate eco-points to accelerate your tree's growth and maintain your streak.</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-700">Cost</span>
                  <span className="font-black text-emerald-600">100 Pts</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1 rounded-2xl h-12 font-bold"
                  onClick={() => setShowBoostModal(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 font-bold"
                  onClick={() => {
                    toast.success("Vitality Boosted!");
                    setShowBoostModal(false);
                  }}
                >
                  Boost
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EcoPoints
