"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calculator, Car, Utensils, Home, Plane, Leaf } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Assuming these components are in the correct path
import QuestionCard from "@/components/games/quickcard";
import CarbonVisualization from "@/components/games/carbonvisu";

const scenarios = [
  { id: 1, title: "Morning Commute", icon: Car, choices: [{ text: "Walk or bike", emissions: 0, points: 20 }, { text: "Public transport", emissions: 2.5, points: 15 }, { text: "Carpool", emissions: 5, points: 10 }, { text: "Drive alone", emissions: 10, points: 0 }] },
  { id: 2, title: "Breakfast Choice", icon: Utensils, choices: [{ text: "Plant-based meal", emissions: 0.5, points: 20 }, { text: "Cereal with milk", emissions: 1.5, points: 15 }, { text: "Eggs and toast", emissions: 2.5, points: 10 }, { text: "Bacon and eggs", emissions: 4, points: 5 }] },
  { id: 3, title: "Energy at Home", icon: Home, choices: [{ text: "Use renewable energy", emissions: 1, points: 20 }, { text: "Turn off unused devices", emissions: 3, points: 15 }, { text: "Use energy normally", emissions: 6, points: 10 }, { text: "Leave everything on", emissions: 12, points: 0 }] },
  { id: 4, title: "Lunch Decision", icon: Utensils, choices: [{ text: "Homemade vegetarian meal", emissions: 1, points: 20 }, { text: "Local restaurant", emissions: 2.5, points: 15 }, { text: "Fast food", emissions: 4, points: 10 }, { text: "Meat-heavy takeout", emissions: 6, points: 5 }] },
  { id: 5, title: "Weekend Plans", icon: Plane, choices: [{ text: "Local outdoor activities", emissions: 1, points: 20 }, { text: "Visit nearby city", emissions: 5, points: 15 }, { text: "Shopping mall trip", emissions: 8, points: 10 }, { text: "Fly to another city", emissions: 50, points: 0 }] }
];

export default function CarbonCalculator() {
  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState('intro'); // intro, playing, results
  const [currentScenario, setCurrentScenario] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameOverData, setGameOverData] = useState(null);

  useEffect(() => {
    // profile is synced via Clerk webhook — no manual User.me() needed
  }, []);

  const startGame = () => {
    setGameState('playing');
    setCurrentScenario(0);
    setTotalEmissions(0);
    setTotalPoints(0);
    setChoices([]);
  };

  const handleChoice = (choice) => {
    setChoices(prev => [...prev, { scenario: scenarios[currentScenario], choice: choice }]);
    setTotalEmissions(prev => prev + choice.emissions);
    setTotalPoints(prev => prev + choice.points);

    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => setCurrentScenario(prev => prev + 1), 1000);
    } else {
      setTimeout(() => setGameState('results'), 1000);
    }
  };

  const saveGameResults = useCallback(async () => {
    try {
      const session = await api.createGameSession("CARBON_CALCULATOR");
      await api.completeGameSession(session.id, totalPoints, "COMPLETED");
      setGameOverData({
        score: totalPoints,
        emissions: totalEmissions,
        choices: choices,
        category: getEmissionCategory(totalEmissions)
      });
    } catch (error) {
      console.error('Error saving game results:', error);
      setGameOverData({
        score: totalPoints,
        emissions: totalEmissions,
        choices: choices,
        category: getEmissionCategory(totalEmissions)
      });
    }
  }, [choices, totalPoints, totalEmissions]);

  useEffect(() => {
    if (gameState === 'results') {
      saveGameResults();
    }
  }, [gameState, saveGameResults]);

  const getEmissionCategory = (emissions) => {
    if (emissions < 15) return { text: "Eco Hero! 🌱", color: "text-green-600", description: "You have a very low carbon footprint!" };
    if (emissions < 30) return { text: "Eco Conscious 🌿", color: "text-blue-600", description: "Good choices for the environment!" };
    if (emissions < 50) return { text: "Room for Improvement 🌍", color: "text-yellow-600", description: "Consider more eco-friendly options." };
    return { text: "High Impact ⚠️", color: "text-red-600", description: "Your choices have a high environmental impact." };
  };

  const restartGame = () => {
    setGameState('intro');
    setGameOverData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/games">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 justify-center">
              <Calculator className="w-7 h-7 text-blue-600" />
              Carbon Footprint Quest
            </h1>
          </div>

          <div className="text-right">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Leaf className="w-5 h-5 mr-2" />
              {totalPoints} pts
            </Badge>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="p-12 text-center bg-gradient-to-r from-blue-500 to-green-500 text-white">
                <CardContent>
                  <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center"><Calculator className="w-10 h-10" /></div>
                  <h2 className="text-3xl font-bold mb-4">Calculate Your Carbon Impact</h2>
                  <p className="text-xl mb-6 text-blue-100">Make daily life choices and see their environmental impact in real-time!</p>
                  <Button onClick={startGame} size="lg" className="bg-white text-blue-600 hover:bg-blue-50">Start Your Day</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <Card><CardContent className="p-4"><div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">Progress</span><span className="text-sm text-gray-500">{currentScenario + 1} of {scenarios.length}</span></div><Progress value={((currentScenario + 1) / scenarios.length) * 100} className="h-2" /></CardContent></Card>
              <QuestionCard scenario={scenarios[currentScenario]} onChoice={handleChoice} />
              <CarbonVisualization emissions={totalEmissions} points={totalPoints} />
            </motion.div>
          )}

          {gameState === 'results' && gameOverData && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="text-center p-8">
                <CardContent>
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"><Calculator className="w-10 h-10 text-white" /></div>
                  <h2 className={`text-2xl font-bold mb-2 ${gameOverData.category.color}`}>{gameOverData.category.text}</h2>
                  <p className="text-gray-600 mb-4">{gameOverData.category.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-red-50 rounded-lg"><div className="text-3xl font-bold text-red-600">{gameOverData.emissions.toFixed(1)}</div><div className="text-sm text-red-700">kg CO₂ today</div></div>
                    <div className="p-4 bg-green-50 rounded-lg"><div className="text-3xl font-bold text-green-600">{gameOverData.score}</div><div className="text-sm text-green-700">Eco Points</div></div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={restartGame} className="bg-green-600 hover:bg-green-700">Try Again</Button>
                    <Link href="/games"><Button variant="outline">Back to Games</Button></Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Your Choices' Impact</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {gameOverData.choices.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <item.scenario.icon className="w-5 h-5 text-gray-500" />
                        <div><p className="font-medium">{item.scenario.title}</p><p className="text-sm text-gray-500">{item.choice.text}</p></div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">+{item.choice.emissions.toFixed(1)} kg CO₂</div>
                        <div className="text-sm text-green-600">+{item.choice.points} points</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}