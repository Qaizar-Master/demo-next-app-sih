"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  Clock, 
  Star, 
  Zap, 
  Leaf, 
  Recycle, 
  Droplets,
  ArrowLeft,
  Filter,
  Search,
  Calendar,
  Award,
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { User, UserProgress, GameSession } from "@/entities";

const challenges = [
  {
    id: "daily-energy-saver",
    title: "Daily Energy Saver",
    description: "Complete 5 energy-saving actions in one day",
    category: "Energy",
    difficulty: "Easy",
    points: 50,
    duration: "1 day",
    icon: Zap,
    color: "bg-yellow-500",
    progress: 3,
    maxProgress: 5,
    status: "in_progress",
    actions: [
      "Turn off lights when leaving room",
      "Unplug unused electronics",
      "Use natural light during day",
      "Set thermostat 2°F lower",
      "Take shorter showers"
    ]
  },
  {
    id: "waste-warrior-week",
    title: "Waste Warrior Week",
    description: "Sort waste correctly for 7 consecutive days",
    category: "Waste",
    difficulty: "Medium",
    points: 100,
    duration: "7 days",
    icon: Recycle,
    color: "bg-green-500",
    progress: 4,
    maxProgress: 7,
    status: "in_progress",
    actions: [
      "Sort recyclables properly",
      "Compost organic waste",
      "Avoid single-use plastics",
      "Repair instead of replace",
      "Donate unused items"
    ]
  },
  {
    id: "carbon-footprint-master",
    title: "Carbon Footprint Master",
    description: "Reduce your carbon footprint by 20% this month",
    category: "Carbon",
    difficulty: "Hard",
    points: 200,
    duration: "30 days",
    icon: Leaf,
    color: "bg-blue-500",
    progress: 0,
    maxProgress: 1,
    status: "not_started",
    actions: [
      "Use public transportation",
      "Eat plant-based meals",
      "Buy local products",
      "Reduce air travel",
      "Use renewable energy"
    ]
  },
  {
    id: "water-conservation-hero",
    title: "Water Conservation Hero",
    description: "Save 100 gallons of water this week",
    category: "Water",
    difficulty: "Medium",
    points: 75,
    duration: "7 days",
    icon: Droplets,
    color: "bg-cyan-500",
    progress: 0,
    maxProgress: 1,
    status: "not_started",
    actions: [
      "Fix leaky faucets",
      "Take shorter showers",
      "Use rain barrels",
      "Water plants efficiently",
      "Use dishwasher efficiently"
    ]
  },
  {
    id: "eco-quiz-champion",
    title: "Eco Quiz Champion",
    description: "Score 90% or higher on 10 eco quizzes",
    category: "Education",
    difficulty: "Easy",
    points: 60,
    duration: "14 days",
    icon: Target,
    color: "bg-purple-500",
    progress: 7,
    maxProgress: 10,
    status: "in_progress",
    actions: [
      "Complete daily eco quizzes",
      "Study environmental topics",
      "Share knowledge with friends",
      "Take advanced quizzes",
      "Teach others about sustainability"
    ]
  },
  {
    id: "sustainable-lifestyle",
    title: "Sustainable Lifestyle",
    description: "Complete all daily sustainable actions for 30 days",
    category: "Lifestyle",
    difficulty: "Hard",
    points: 300,
    duration: "30 days",
    icon: Star,
    color: "bg-emerald-500",
    progress: 0,
    maxProgress: 1,
    status: "not_started",
    actions: [
      "Follow sustainable practices daily",
      "Track environmental impact",
      "Make eco-friendly choices",
      "Inspire others to go green",
      "Maintain sustainable habits"
    ]
  }
];

const categories = ["All", "Energy", "Waste", "Carbon", "Water", "Education", "Lifestyle"];
const difficulties = ["All", "Easy", "Medium", "Hard"];
const statuses = ["All", "Not Started", "In Progress", "Completed"];

export default function ChallengesPage() {
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await User.me();
        const progressData = await UserProgress.filter({ userId: userData.id });
        setUser(userData);
        setUserProgress(progressData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const filteredChallenges = challenges.filter(challenge => {
    const matchesCategory = selectedCategory === "All" || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || challenge.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === "All" || 
      (selectedStatus === "Not Started" && challenge.status === "not_started") ||
      (selectedStatus === "In Progress" && challenge.status === "in_progress") ||
      (selectedStatus === "Completed" && challenge.status === "completed");
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "not_started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const startChallenge = async (challengeId) => {
    try {
      await GameSession.create({
        type: "challenge",
        challengeId,
        userId: user?.id,
        status: "active"
      });
      // Update local state
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? { ...c, status: "in_progress" } : c
      ));
    } catch (error) {
      console.error("Error starting challenge:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2 " />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CHALLENGES</h1>
                <p className="text-gray-600 ">Complete challenges to earn points and make a difference</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 pl-120">
              <Trophy className="w-6 h-6 text-yellow-500" /> 
              <span className="text-lg font-semibold">1,250 pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredChallenges.map((challenge, index) => {
              const Icon = challenge.icon;
              const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => setSelectedChallenge(challenge)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg ${challenge.color} bg-opacity-20`}>
                          <Icon className={`w-6 h-6 ${challenge.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getStatusColor(challenge.status)}>
                            {challenge.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{challenge.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Progress */}
                        {challenge.status === "in_progress" && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{challenge.progress}/{challenge.maxProgress}</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span>{challenge.points} pts</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{challenge.duration}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (challenge.status === "not_started") {
                              startChallenge(challenge.id);
                            }
                          }}
                          disabled={challenge.status === "completed"}
                        >
                          {challenge.status === "completed" ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completed
                            </>
                          ) : challenge.status === "in_progress" ? (
                            <>
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Continue
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Start Challenge
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more challenges.</p>
          </div>
        )}
      </div>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${selectedChallenge.color} bg-opacity-20`}>
                      <selectedChallenge.icon className={`w-6 h-6 ${selectedChallenge.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedChallenge.title}</h2>
                      <p className="text-gray-600">{selectedChallenge.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedChallenge(null)}>
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Challenge Actions */}
                  <div>
                    <h3 className="font-semibold mb-3">Actions to Complete:</h3>
                    <ul className="space-y-2">
                      {selectedChallenge.actions.map((action, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Progress */}
                  {selectedChallenge.status === "in_progress" && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{selectedChallenge.progress}/{selectedChallenge.maxProgress}</span>
                      </div>
                      <Progress value={(selectedChallenge.progress / selectedChallenge.maxProgress) * 100} className="h-2" />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">{selectedChallenge.points} points</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{selectedChallenge.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">{selectedChallenge.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{selectedChallenge.category}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        if (selectedChallenge.status === "not_started") {
                          startChallenge(selectedChallenge.id);
                        }
                        setSelectedChallenge(null);
                      }}
                      disabled={selectedChallenge.status === "completed"}
                    >
                      {selectedChallenge.status === "completed" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : selectedChallenge.status === "in_progress" ? (
                        <>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continue Challenge
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Challenge
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedChallenge(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
