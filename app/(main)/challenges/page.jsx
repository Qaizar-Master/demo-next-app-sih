"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Target, Clock, Star, Zap, Leaf, Recycle, Droplets, Wind, TreePine,
  ArrowLeft, Search, Calendar, Award, CheckCircle, PlayCircle, Loader2
} from "lucide-react";
import { api } from "@/lib/client-api";
import toast from "react-hot-toast";

// Map icon name strings (from DB) to lucide components
const ICON_MAP = {
  Zap, Recycle, Wind, Droplets, TreePine, Leaf, Star, Target,
};

const DIFFICULTY_COLORS = {
  EASY: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HARD: "bg-red-100 text-red-800",
};

const STATUS_COLORS = {
  COMPLETED: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  NOT_STARTED: "bg-gray-100 text-gray-800",
};

const categories = ["All", "Energy", "Waste", "Carbon", "Water", "Biodiversity", "Food"];
const difficulties = ["All", "EASY", "MEDIUM", "HARD"];
const statuses = ["All", "NOT_STARTED", "IN_PROGRESS", "COMPLETED"];
const statusLabels = { NOT_STARTED: "Not Started", IN_PROGRESS: "In Progress", COMPLETED: "Completed", All: "All" };

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [starting, setStarting] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const loadChallenges = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getChallenges();
      setChallenges(data);
    } catch (err) {
      toast.error("Failed to load challenges");
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { loadChallenges(); }, [loadChallenges]);

  const startChallenge = async (challengeId) => {
    setStarting(challengeId);
    try {
      await api.startChallenge(challengeId);
      toast.success("Challenge started! Good luck 🌱");
      // Refresh so progress state updates
      await loadChallenges();
      setSelectedChallenge(null);
    } catch (err) {
      toast.error(err.message || "Could not start challenge");
    }
    setStarting(null);
  };

  const filteredChallenges = challenges.filter((c) => {
    const up = c.userProgress;
    const status = up?.status ?? "NOT_STARTED";
    return (
      (selectedCategory === "All" || c.category === selectedCategory) &&
      (selectedDifficulty === "All" || c.difficulty === selectedDifficulty) &&
      (selectedStatus === "All" || status === selectedStatus) &&
      (c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const getStatus = (c) => c.userProgress?.status ?? "NOT_STARTED";

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link href="/dashboard">
          <span className="outline rounded">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard
            </Button>
          </span>
        </Link>

        <motion.div className="mb-8 mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-slate mb-2 flex justify-center">Challenges</h1>
          <p className="text-black text-lg flex justify-center">Complete challenges to earn points and make a difference</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg">
                {difficulties.map((d) => <option key={d} value={d}>{d === "All" ? "All Difficulties" : d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg">
                {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-green-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredChallenges.map((challenge, index) => {
                const Icon = ICON_MAP[challenge.iconName] ?? Leaf;
                const status = getStatus(challenge);
                const progress = challenge.userProgress?.progress ?? 0;
                const pct = (progress / challenge.maxProgress) * 100;

                return (
                  <motion.div key={challenge.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      onClick={() => setSelectedChallenge(challenge)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-lg ${challenge.colorClass ?? "bg-green-500"} bg-opacity-20`}>
                            <Icon className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge className={STATUS_COLORS[status]}>{statusLabels[status]}</Badge>
                            <Badge className={DIFFICULTY_COLORS[challenge.difficulty]}>
                              {challenge.difficulty.charAt(0) + challenge.difficulty.slice(1).toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-2">{challenge.title}</CardTitle>
                        <p className="text-gray-600 text-sm">{challenge.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {status === "IN_PROGRESS" && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{progress}/{challenge.maxProgress}</span>
                              </div>
                              <Progress value={pct} className="h-2" />
                            </div>
                          )}
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
                          <Button className="w-full"
                            disabled={status === "COMPLETED" || starting === challenge.id}
                            onClick={(e) => { e.stopPropagation(); if (status === "NOT_STARTED") startChallenge(challenge.id); }}>
                            {starting === challenge.id ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Starting…</>
                            ) : status === "COMPLETED" ? (
                              <><CheckCircle className="w-4 h-4 mr-2" />Completed</>
                            ) : status === "IN_PROGRESS" ? (
                              <><PlayCircle className="w-4 h-4 mr-2" />Continue</>
                            ) : (
                              <><PlayCircle className="w-4 h-4 mr-2" />Start Challenge</>
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
        )}

        {!isLoading && filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more challenges.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (() => {
          const Icon = ICON_MAP[selectedChallenge.iconName] ?? Leaf;
          const status = getStatus(selectedChallenge);
          const progress = selectedChallenge.userProgress?.progress ?? 0;
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedChallenge(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${selectedChallenge.colorClass ?? "bg-green-500"} bg-opacity-20`}>
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedChallenge.title}</h2>
                        <p className="text-gray-600">{selectedChallenge.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => setSelectedChallenge(null)}>×</Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Actions to Complete:</h3>
                      <ul className="space-y-2">
                        {(selectedChallenge.actions ?? []).map((action, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {status === "IN_PROGRESS" && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{progress}/{selectedChallenge.maxProgress}</span>
                        </div>
                        <Progress value={(progress / selectedChallenge.maxProgress) * 100} className="h-2" />
                      </div>
                    )}

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
                        <span className="font-medium">{selectedChallenge.difficulty.charAt(0) + selectedChallenge.difficulty.slice(1).toLowerCase()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <span className="font-medium">{selectedChallenge.category}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button className="flex-1"
                        disabled={status === "COMPLETED" || starting === selectedChallenge.id}
                        onClick={() => { if (status === "NOT_STARTED") startChallenge(selectedChallenge.id); else setSelectedChallenge(null); }}>
                        {status === "COMPLETED" ? (
                          <><CheckCircle className="w-4 h-4 mr-2" />Completed</>
                        ) : status === "IN_PROGRESS" ? (
                          <><PlayCircle className="w-4 h-4 mr-2" />Continue Challenge</>
                        ) : starting === selectedChallenge.id ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Starting…</>
                        ) : (
                          <><PlayCircle className="w-4 h-4 mr-2" />Start Challenge</>
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedChallenge(null)}>Close</Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
