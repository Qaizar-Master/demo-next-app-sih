"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { User, UserProgress, GameSession } from "@/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Recycle } from "lucide-react";
import Link from "next/link"; // FIX 1: Use Next.js Link
import { useRouter } from "next/navigation"; // FIX 2: Import useRouter for programmatic navigation
import { motion, AnimatePresence } from "framer-motion";

import WasteItem from "@/components/games/wasteitem";
import GameBin from "@/components/games/gamebin";
import GameOverModal from "@/components/games/gameovermodal";

export const wasteItems = [
  { id: 1, name: "Plastic Bottle", type: "recyclable", emoji: "🍶", color: "bg-blue-100" },
  { id: 2, name: "Apple Core", type: "organic", emoji: "🍎", color: "bg-green-100" },
  { id: 3, name: "Newspaper", type: "recyclable", emoji: "📰", color: "bg-blue-100" },
  { id: 4, name: "Banana Peel", type: "organic", emoji: "🍌", color: "bg-green-100" },
  { id: 5, name: "Glass Bottle", type: "recyclable", emoji: "🍾", color: "bg-blue-100" },
  { id: 6, name: "Cigarette Butt", type: "hazardous", emoji: "🚬", color: "bg-red-100" },
  { id: 7, name: "Food Can", type: "recyclable", emoji: "🥫", color: "bg-blue-100" },
  { id: 8, name: "Orange Peel", type: "organic", emoji: "🍊", color: "bg-green-100" },
  { id: 9, name: "Battery", type: "hazardous", emoji: "🔋", color: "bg-red-100" },
  { id: 10, name: "Cardboard Box", type: "recyclable", emoji: "📦", color: "bg-blue-100" },

  { id: 11, name: "Plastic Bag", type: "recyclable", emoji: "🛍️", color: "bg-blue-100" },
  { id: 12, name: "Leftover Food", type: "organic", emoji: "🍲", color: "bg-green-100" },
  { id: 13, name: "Broken Mirror", type: "hazardous", emoji: "🪞", color: "bg-red-100" },
  { id: 14, name: "Aluminum Foil", type: "recyclable", emoji: "🥡", color: "bg-blue-100" },
  { id: 15, name: "Tea Bag", type: "organic", emoji: "🍵", color: "bg-green-100" },
  { id: 16, name: "Light Bulb", type: "hazardous", emoji: "💡", color: "bg-red-100" },
  { id: 17, name: "Juice Carton", type: "recyclable", emoji: "🧃", color: "bg-blue-100" },
  { id: 18, name: "Eggshells", type: "organic", emoji: "🥚", color: "bg-green-100" },
  { id: 19, name: "Paint Can", type: "hazardous", emoji: "🎨", color: "bg-red-100" },
  { id: 20, name: "Magazine", type: "recyclable", emoji: "📖", color: "bg-blue-100" },

  { id: 21, name: "Paper Cup", type: "recyclable", emoji: "🥤", color: "bg-blue-100" },
  { id: 22, name: "Vegetable Peels", type: "organic", emoji: "🥕", color: "bg-green-100" },
  { id: 23, name: "Expired Medicine", type: "hazardous", emoji: "💊", color: "bg-red-100" },
  { id: 24, name: "Tin Can", type: "recyclable", emoji: "🥫", color: "bg-blue-100" },
  { id: 25, name: "Coffee Grounds", type: "organic", emoji: "☕", color: "bg-green-100" },
  { id: 26, name: "Broken Thermometer", type: "hazardous", emoji: "🌡️", color: "bg-red-100" },
  { id: 27, name: "Notebook", type: "recyclable", emoji: "📓", color: "bg-blue-100" },
  { id: 28, name: "Coconut Shell", type: "organic", emoji: "🥥", color: "bg-green-100" },
  { id: 29, name: "Used Syringe", type: "hazardous", emoji: "💉", color: "bg-red-100" },
  { id: 30, name: "Plastic Straw", type: "recyclable", emoji: "🥢", color: "bg-blue-100" },

  { id: 31, name: "Pizza Box", type: "recyclable", emoji: "🍕", color: "bg-blue-100" },
  { id: 32, name: "Avocado Pit", type: "organic", emoji: "🥑", color: "bg-green-100" },
  { id: 33, name: "Aerosol Can", type: "hazardous", emoji: "🧴", color: "bg-red-100" },
  { id: 34, name: "Steel Spoon", type: "recyclable", emoji: "🥄", color: "bg-blue-100" },
  { id: 35, name: "Grass Clippings", type: "organic", emoji: "🌿", color: "bg-green-100" },
  { id: 36, name: "Chemical Bottle", type: "hazardous", emoji: "⚗️", color: "bg-red-100" },
  { id: 37, name: "Printer Paper", type: "recyclable", emoji: "📄", color: "bg-blue-100" },
  { id: 38, name: "Bread Crusts", type: "organic", emoji: "🍞", color: "bg-green-100" },
  { id: 39, name: "Gas Cylinder", type: "hazardous", emoji: "🛢️", color: "bg-red-100" },
  { id: 40, name: "Milk Carton", type: "recyclable", emoji: "🥛", color: "bg-blue-100" },

  { id: 41, name: "Shredded Paper", type: "recyclable", emoji: "📑", color: "bg-blue-100" },
  { id: 42, name: "Onion Skin", type: "organic", emoji: "🧅", color: "bg-green-100" },
  { id: 43, name: "Pesticide Bottle", type: "hazardous", emoji: "☠️", color: "bg-red-100" },
  { id: 44, name: "Metal Lid", type: "recyclable", emoji: "🥫", color: "bg-blue-100" },
  { id: 45, name: "Pumpkin Seeds", type: "organic", emoji: "🎃", color: "bg-green-100" },
  { id: 46, name: "Old Thermos", type: "hazardous", emoji: "🥶", color: "bg-red-100" },
  { id: 47, name: "Soda Can", type: "recyclable", emoji: "🥤", color: "bg-blue-100" },
  { id: 48, name: "Corn Cob", type: "organic", emoji: "🌽", color: "bg-green-100" },
  { id: 49, name: "Firecracker", type: "hazardous", emoji: "🧨", color: "bg-red-100" },
  { id: 50, name: "Paperback Book", type: "recyclable", emoji: "📘", color: "bg-blue-100" }
];

const bins = [
  // ... (bins data remains the same)
  { id: "organic", name: "Organic Waste", type: "organic", color: "bg-green-500", emoji: "🌱" },
  { id: "recyclable", name: "Recyclable", type: "recyclable", color: "bg-blue-500", emoji: "♻️" },
  { id: "hazardous", name: "Hazardous", type: "hazardous", color: "bg-red-500", emoji: "⚠️" }
];

export default function WasteSorting() {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('ready');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentItem, setCurrentItem] = useState(null);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [correctItems, setCorrectItems] = useState(0);
  const [gameOverData, setGameOverData] = useState(null);
  const timerRef = useRef(null);
  const router = useRouter(); // FIX 2: Initialize the router

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const endGame = useCallback(async () => {
    setGameState('gameOver');
    
    const accuracy = totalItems > 0 ? Math.round((correctItems / totalItems) * 100) : 0;
    const finalScore = score;
    let finalLevel = 1;

    try {
      await GameSession.create({
        user_email: user?.email,
        game_type: "waste-sorting",
        score: finalScore,
        points_earned: finalScore,
        duration_seconds: 30 - timeLeft,
        completed: true
      });

      if (user?.email) {
        const progressList = await UserProgress.filter({ user_email: user.email });
        if (progressList.length > 0) {
          const progress = progressList[0];
          const newTotalPoints = (progress.total_points || 0) + finalScore;
          const newLevel = Math.floor(newTotalPoints / 100) + 1;
          finalLevel = newLevel; // Store for modal
          let newBadges = [...(progress.badges || [])];

          if (!newBadges.includes("first-game") && newTotalPoints >= 10) {
            newBadges.push("first-game");
          }
          if (!newBadges.includes("waste-warrior") && accuracy >= 80 && totalItems >= 10) {
            newBadges.push("waste-warrior");
          }

          await UserProgress.update(progress.id, {
            total_points: newTotalPoints,
            level: newLevel,
            badges: newBadges,
            completed_games: [...(progress.completed_games || []), "waste-sorting"]
          });
        }
      }

      setGameOverData({
        score: finalScore,
        accuracy,
        correctItems,
        totalItems,
        newLevel: finalLevel // FIX 3: Use the consistently calculated final level
      });
      
    } catch (error) {
      console.error('Error saving game results:', error);
    }
  }, [user, totalItems, correctItems, score, timeLeft]);

  useEffect(() => {
    loadUser();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
        clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endGame]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setCorrectStreak(0);
    setTotalItems(0);
    setCorrectItems(0);
    generateNewItem();
  };

  const pauseGame = () => setGameState('paused');
  const resumeGame = () => setGameState('playing');
  const restartGame = () => {
    setGameState('ready');
    setGameOverData(null);
    setCurrentItem(null);
  };

  const generateNewItem = () => {
    const randomItem = wasteItems[Math.floor(Math.random() * wasteItems.length)];
    setCurrentItem({ ...randomItem, id: Date.now() });
  };

  const handleBinDrop = (binType) => {
    if (!currentItem || gameState !== 'playing') return;

    const isCorrect = currentItem.type === binType;
    setTotalItems(prev => prev + 1);
    
    if (isCorrect) {
      const streakMultiplier = Math.floor(correctStreak / 3) + 1;
      const pointsEarned = 10 * streakMultiplier;
      setScore(prev => prev + pointsEarned);
      setCorrectItems(prev => prev + 1);
      setCorrectStreak(prev => prev + 1);
    } else {
      setCorrectStreak(0);
    }
    generateNewItem();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          {/* FIX 1: Use Next.js Link with href and a direct path */}
          <Link href="/games">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 justify-center">
              <Recycle className="w-7 h-7 text-green-600" />
              Waste Sorting Mania
            </h1>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Trophy className="w-5 h-5 mr-2" />
              {score} pts
            </Badge>
          </div>
        </div>
        
        {/* The rest of the JSX remains largely the same... */}
        
        {/* Game Stats */}
        {gameState !== 'ready' && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-600">{timeLeft}s</div><div className="text-sm text-gray-500">Time Left</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{correctItems}</div><div className="text-sm text-gray-500">Correct</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">{correctStreak}</div><div className="text-sm text-gray-500">Streak</div></CardContent></Card>
          </div>
        )}

        {/* Game Area */}
        <div className="relative min-h-[500px] mb-6">
          <AnimatePresence mode="wait">
            {gameState === 'ready' && (
              <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <Card className="h-full p-12 text-center bg-gradient-to-r from-green-500 to-blue-500 text-white flex flex-col justify-center items-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full mb-6 flex items-center justify-center"><Recycle className="w-10 h-10" /></div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Sort Waste?</h2>
                  <p className="text-lg mb-6 text-green-100 max-w-md">Drag waste items to the correct bins. Score points for accuracy and speed!</p>
                  <Button onClick={startGame} size="lg" className="bg-white text-green-600 hover:bg-green-50"><Play className="w-5 h-5 mr-2" />Start Game</Button>
                </Card>
              </motion.div>
            )}

            {(gameState === 'playing' || gameState === 'paused') && (
              <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <div className="space-y-6">
                  <div className="text-center h-40 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {currentItem && (
                        <motion.div key={currentItem.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="inline-block">
                          <WasteItem item={currentItem} disabled={gameState === 'paused'} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {bins.map((bin) => (<GameBin key={bin.id} bin={bin} onDrop={() => handleBinDrop(bin.type)} disabled={gameState === 'paused'} />))}
                  </div>
                  <div className="text-center space-x-4">
                    {gameState === 'playing' ? (
                      <Button onClick={pauseGame} variant="outline"><Pause className="w-5 h-5 mr-2" />Pause</Button>
                    ) : (
                      <Button onClick={resumeGame}><Play className="w-5 h-5 mr-2" />Resume</Button>
                    )}
                    <Button onClick={restartGame} variant="outline"><RotateCcw className="w-5 h-5 mr-2" />Restart</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Over Modal */}
        <GameOverModal 
          isOpen={gameState === 'gameOver'}
          gameData={gameOverData}
          onPlayAgain={startGame}
          // FIX 2: Use router.push for smooth navigation
          onBackToGames={() => router.push('/games')} 
        />
      </div>
    </div>
  );
}