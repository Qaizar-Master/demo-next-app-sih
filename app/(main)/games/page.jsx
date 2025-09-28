"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link"; // FIX: Use Next.js Link
import { 
  Gamepad2, 
  Play, 
  Recycle, 
  Calculator, 
  Zap, 
  Brain,
  Star,
  Trophy,
  Building2
} from "lucide-react";

import GameCard from "@/components/games/gamecard";
import Layout from "@/components/side-bar/page";

// FIX: Use direct paths for URLs
const games = [
  {
    id: "waste-sorting",
    title: "Waste Sorting Mania",
    description: "Fast-paced recycling game where you sort waste into correct bins before time runs out!",
    icon: Recycle,
    color: "bg-green-500",
    difficulty: "Easy",
    duration: "3-5 min",
    points: "50-100",
    url: "/wastesorting",
    category: "Waste Management",
    learning: "Learn proper waste segregation and recycling principles"
  },
  {
    id: "carbon-calculator", 
    title: "Carbon Footprint Quest",
    description: "Interactive story where your daily choices affect your carbon footprint visualization.",
    icon: Calculator,
    color: "bg-blue-500", 
    difficulty: "Medium",
    duration: "5-8 min",
    points: "75-150",
    url: "/carbon-calculator",
    category: "Climate Action",
    learning: "Understand how daily activities impact your carbon footprint"
  },
  {
    id: "energy-saver",
    title: "Energy Saver Dash", 
    description: "Race through rooms turning off lights and appliances to save energy before time runs out!",
    icon: Zap,
    color: "bg-yellow-500",
    difficulty: "Medium", 
    duration: "4-6 min",
    points: "60-120",
    url: "/energy-saver",
    category: "Energy Conservation",
    learning: "Learn about energy conservation and sustainable practices"
  },
  {
    id: "eco-quiz",
    title: "Eco Knowledge Challenge",
    description: "Test your environmental knowledge with fun, interactive quizzes on various eco topics.",
    icon: Brain,
    color: "bg-purple-500",
    difficulty: "Easy",
    duration: "2-4 min", 
    points: "40-80",
    url: "/eco-quiz",
    category: "General Knowledge",
    learning: "Build comprehensive environmental awareness and knowledge"
  },
  {
    id: "eco-city-builder",
    title: "Eco-City Builder",
    description: "Build a thriving city while balancing economic growth, citizen happiness, and environmental impact.",
    icon: Building2,
    color: "bg-indigo-500",
    difficulty: "Hard",
    duration: "10-15 min",
    points: "100-250",
    url: "/eco-quiz-builder",
    category: "Strategy & Simulation",
    learning: "Understand the trade-offs between development and sustainability in urban planning"
  }
];

export default function Games() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
      setIsLoading(false);
    };
    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(games.length)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Learning Games</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl">
          Learn environmental concepts through fun, interactive games. Each game teaches real-world skills while earning you points and badges!
        </p>
      </div>

      {/* Featured Game */}
      <Card className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 text-white shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <Recycle className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-white/20 text-white mb-3">🔥 Most Popular</Badge>
              <h2 className="text-2xl font-bold mb-2">Waste Sorting Mania</h2>
              <p className="text-green-100 mb-4">
                Our most popular game! Learn waste segregation through fast-paced, addictive gameplay.
              </p>
              {/* FIX: Use href prop with a direct path */}
              <Link href="/wastesorting">
                <Button className="bg-white text-green-600 hover:bg-green-50">
                  <Play className="w-5 h-5 mr-2" />
                  Play Now
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-600" />
          All Learning Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">More Games Coming Soon!</h3>
          <p className="text-gray-500 mb-4">
            We're working on exciting new games. Check back soon for more ways to learn and have fun!
          </p>
        </CardContent>
      </Card>
    </div>
    </Layout>
  );
}