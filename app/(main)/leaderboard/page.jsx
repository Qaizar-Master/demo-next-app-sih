"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Zap, 
  Target, 
  Award,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Users,
  Flame,
  Shield,
  Sword,
  Gem,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  CheckCircle
} from "lucide-react";
import { User, UserProgress, GameSession } from "@/entities";

// Mock leaderboard data
const leaderboardData = [
  {
    id: 1,
    name: "Eco Warrior",
    avatar: "🌱",
    totalPoints: 2450,
    weeklyPoints: 320,
    level: 15,
    rank: 1,
    badges: ["Carbon Master", "Energy Saver", "Waste Warrior"],
    streak: 12,
    gamesPlayed: 45,
    challengesCompleted: 18,
    joinDate: "2024-01-15",
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "Green Guardian",
    avatar: "🌿",
    totalPoints: 2380,
    weeklyPoints: 280,
    level: 14,
    rank: 2,
    badges: ["Water Hero", "Recycling Champion"],
    streak: 8,
    gamesPlayed: 42,
    challengesCompleted: 16,
    joinDate: "2024-01-20",
    lastActive: "1 hour ago"
  },
  {
    id: 3,
    name: "Climate Champion",
    avatar: "🌍",
    totalPoints: 2200,
    weeklyPoints: 250,
    level: 13,
    rank: 3,
    badges: ["Carbon Master", "Eco Educator"],
    streak: 15,
    gamesPlayed: 38,
    challengesCompleted: 14,
    joinDate: "2024-01-10",
    lastActive: "30 minutes ago"
  },
  {
    id: 4,
    name: "Sustainable Sam",
    avatar: "♻️",
    totalPoints: 2100,
    weeklyPoints: 200,
    level: 12,
    rank: 4,
    badges: ["Waste Warrior", "Energy Saver"],
    streak: 6,
    gamesPlayed: 35,
    challengesCompleted: 12,
    joinDate: "2024-01-25",
    lastActive: "3 hours ago"
  },
  {
    id: 5,
    name: "Eco Explorer",
    avatar: "🌲",
    totalPoints: 1950,
    weeklyPoints: 180,
    level: 11,
    rank: 5,
    badges: ["Nature Lover", "Green Thumb"],
    streak: 4,
    gamesPlayed: 32,
    challengesCompleted: 10,
    joinDate: "2024-02-01",
    lastActive: "5 hours ago"
  },
  {
    id: 6,
    name: "Green Machine",
    avatar: "⚡",
    totalPoints: 1800,
    weeklyPoints: 160,
    level: 10,
    rank: 6,
    badges: ["Energy Saver"],
    streak: 3,
    gamesPlayed: 28,
    challengesCompleted: 8,
    joinDate: "2024-02-05",
    lastActive: "1 day ago"
  },
  {
    id: 7,
    name: "Planet Protector",
    avatar: "🛡️",
    totalPoints: 1650,
    weeklyPoints: 140,
    level: 9,
    rank: 7,
    badges: ["Climate Defender"],
    streak: 2,
    gamesPlayed: 25,
    challengesCompleted: 6,
    joinDate: "2024-02-10",
    lastActive: "2 days ago"
  },
  {
    id: 8,
    name: "Eco Enthusiast",
    avatar: "🌻",
    totalPoints: 1500,
    weeklyPoints: 120,
    level: 8,
    rank: 8,
    badges: ["Green Newbie"],
    streak: 1,
    gamesPlayed: 20,
    challengesCompleted: 4,
    joinDate: "2024-02-15",
    lastActive: "1 day ago"
  }
];

const achievements = [
  {
    id: "carbon-master",
    name: "Carbon Master",
    description: "Reduce carbon footprint by 50%",
    icon: Target,
    color: "bg-blue-500",
    rarity: "Legendary",
    points: 500,
    unlocked: true
  },
  {
    id: "energy-saver",
    name: "Energy Saver",
    description: "Save 1000 kWh of energy",
    icon: Zap,
    color: "bg-yellow-500",
    rarity: "Epic",
    points: 300,
    unlocked: true
  },
  {
    id: "waste-warrior",
    name: "Waste Warrior",
    description: "Recycle 1000 items",
    icon: Shield,
    color: "bg-green-500",
    rarity: "Rare",
    points: 200,
    unlocked: true
  },
  {
    id: "water-hero",
    name: "Water Hero",
    description: "Save 5000 gallons of water",
    icon: Gem,
    color: "bg-cyan-500",
    rarity: "Rare",
    points: 200,
    unlocked: false
  },
  {
    id: "eco-educator",
    name: "Eco Educator",
    description: "Teach 50 people about sustainability",
    icon: Star,
    color: "bg-purple-500",
    rarity: "Epic",
    points: 300,
    unlocked: false
  }
];

const timeframes = ["All Time", "This Week", "This Month", "This Year"];

export default function LeaderboardPage() {
  const [user, setUser] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("totalPoints");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentUserRank, setCurrentUserRank] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
        // Find current user's rank
        const userRank = leaderboardData.findIndex(u => u.name === userData.full_name) + 1;
        setCurrentUserRank(userRank || leaderboardData.length + 1);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Trophy className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getLevelColor = (level) => {
    if (level >= 15) return "text-purple-600";
    if (level >= 10) return "text-blue-600";
    if (level >= 5) return "text-green-600";
    return "text-gray-600";
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Legendary": return "bg-purple-100 text-purple-800";
      case "Epic": return "bg-blue-100 text-blue-800";
      case "Rare": return "bg-green-100 text-green-800";
      case "Common": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = leaderboardData
    .filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> 
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
                <h1 className="text-4xl font-bold text-slate mb-2 flex justify-center">Leaderboard</h1>
                <p className="text-black text-lg flex justify-center">See how you rank against other eco warriors</p>
                </motion.div>
                <div className="flex items-center space-x-2 pl-250 ">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <span className="text-lg font-semibold"> Your Rank #1</span>
                  </div>
                </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search players..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Timeframe Filter */}
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {timeframes.map(timeframe => (
                      <option key={timeframe} value={timeframe}>{timeframe}</option>
                    ))}
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="totalPoints">Total Points</option>
                    <option value="weeklyPoints">Weekly Points</option>
                    <option value="level">Level</option>
                    <option value="streak">Streak</option>
                  </select>

                  {/* Sort Order */}
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    className="flex items-center space-x-2"
                  >
                    {sortOrder === "desc" ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                    <span>{sortOrder === "desc" ? "Descending" : "Ascending"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Top Players</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {filteredData.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                        player.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Rank */}
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(player.rank)}
                          </div>

                          {/* Avatar & Name */}
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
                              {player.avatar}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{player.name}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${getLevelColor(player.level)}`}>
                                  Level {player.level}
                                </Badge>
                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                  <Flame className="w-3 h-3" />
                                  <span>{player.streak} day streak</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{player.totalPoints.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Total Points</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">{player.weeklyPoints}</p>
                            <p className="text-sm text-gray-500">This Week</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">{player.challengesCompleted}</p>
                            <p className="text-sm text-gray-500">Challenges</p>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {player.badges.slice(0, 3).map((badge, badgeIndex) => (
                          <Badge key={badgeIndex} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                        {player.badges.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{player.badges.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          achievement.unlocked 
                            ? "border-green-200 bg-green-50" 
                            : "border-gray-200 bg-gray-50 opacity-60"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${achievement.color} bg-opacity-20`}>
                            <Icon className={`w-6 h-6 ${achievement.color.replace('bg-', 'text-')}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                              <Badge className={getRarityColor(achievement.rarity)}>
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-yellow-600">
                                {achievement.points} points
                              </span>
                              {achievement.unlocked && (
                                <div className="flex items-center space-x-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm font-medium">Unlocked</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  );
}
