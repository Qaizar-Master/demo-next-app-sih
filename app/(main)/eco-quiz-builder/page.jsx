"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

import StatsDisplay from "@/components/games/ecobuilder/stastdispaly";
import BuildingMenu from "@/components/games/ecobuilder/buildingmenu";
import GameGrid from "@/components/games/ecobuilder/gamegrid";
import GameTutorial from "@/components/games/ecobuilder/gametutorial";
import WinLoseModal from "@/components/games/ecobuilder/winlosemodal";

const GRID_SIZE = 10;
const INITIAL_STATS = {
  population: 0,
  happiness: 50,
  budget: 2000,
  pollution: 0,
  energy: 0
};
const TARGET_POPULATION = 100;
const MAX_POLLUTION = 100;

export default function EcoCityBuilder() {
  const [gameState, setGameState] = useState('intro');
  const [grid, setGrid] = useState(Array(GRID_SIZE * GRID_SIZE).fill(null));
  const [stats, setStats] = useState(INITIAL_STATS);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  // no user state needed — api routes use Clerk session

  const startGame = () => {
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill(null));
    setStats(INITIAL_STATS);
    setSelectedBuilding(null);
    setGameState('playing');
  };

  const handlePlaceBuilding = (index) => {
    if (!selectedBuilding || grid[index] !== null || stats.budget < selectedBuilding.cost) {
      return;
    }

    const newGrid = [...grid];
    newGrid[index] = { ...selectedBuilding, id: `${selectedBuilding.name}-${index}` };
    setGrid(newGrid);

    const newStats = { ...stats };
    newStats.budget -= selectedBuilding.cost;
    newStats.population += selectedBuilding.effects.population;
    newStats.happiness += selectedBuilding.effects.happiness;
    newStats.pollution += selectedBuilding.effects.pollution;
    newStats.energy += selectedBuilding.effects.energy;

    // Adjacency bonuses/penalties could be calculated here

    setStats(newStats);
    setSelectedBuilding(null);
    checkGameEnd(newStats);
  };

  const checkGameEnd = (currentStats) => {
    if (currentStats.population >= TARGET_POPULATION) {
      endGame('won', currentStats);
    } else if (currentStats.budget < 0 || currentStats.pollution >= MAX_POLLUTION) {
      endGame('lost', currentStats);
    }
  };

  const endGame = async (result, finalStats) => {
    setGameState(result);
    const finalScore = Math.max(0, Math.round(
      finalStats.population * (finalStats.happiness / 50) - finalStats.pollution
    ));
    try {
      const session = await api.createGameSession("CHALLENGE");
      await api.completeGameSession(session.id, finalScore, result === 'won' ? "COMPLETED" : "ABANDONED");
    } catch (error) {
      console.error('Error saving game results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/games">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            Eco-City Builder
          </h1>
          <div className="w-32"></div> {/* Spacer */}
        </div>

        <AnimatePresence>
          {gameState === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GameTutorial onStart={startGame} />
            </motion.div>
          )}

          {(gameState === 'playing' || gameState === 'won' || gameState === 'lost') && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="shadow-xl">
                <CardContent className="p-4 md:p-6">
                  <StatsDisplay stats={stats} targetPopulation={TARGET_POPULATION} maxPollution={MAX_POLLUTION} />

                  <div className="grid lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2">
                      <GameGrid
                        grid={grid}
                        onCellClick={handlePlaceBuilding}
                        selectedBuilding={selectedBuilding}
                        size={GRID_SIZE}
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <BuildingMenu
                        selectedBuilding={selectedBuilding}
                        onSelectBuilding={setSelectedBuilding}
                        budget={stats.budget}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <WinLoseModal
          isOpen={gameState === 'won' || gameState === 'lost'}
          status={gameState}
          stats={stats}
          onPlayAgain={startGame}
        />
      </div>
    </div>
  );
}