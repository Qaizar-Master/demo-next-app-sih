"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Lightbulb,
  Monitor,
  AirVent,
} from "lucide-react";
import Link from "next/link";
import EnergyRoom from "@/components/games/energyroom"; // Assuming these components exist
import GameOverModal from "@/components/games/gameovermodal"; // Assuming these components exist

// --- Rooms setup (data structure for the game) ---
const rooms = [
  {
    id: "living_room",
    name: "Living Room",
    devices: [
      { id: "tv", name: "TV", icon: Monitor, position: { x: 20, y: 40 }, isOn: true, points: 15 },
      { id: "lamp1", name: "Floor Lamp", icon: Lightbulb, position: { x: 70, y: 30 }, isOn: true, points: 5 },
      { id: "lamp2", name: "Table Lamp", icon: Lightbulb, position: { x: 40, y: 60 }, isOn: true, points: 5 },
      { id: "fan", name: "Ceiling Fan", icon: AirVent, position: { x: 50, y: 20 }, isOn: true, points: 10 },
    ],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    devices: [
      { id: "light", name: "Ceiling Light", icon: Lightbulb, position: { x: 50, y: 25 }, isOn: true, points: 8 },
      { id: "bedlamp", name: "Bedside Lamp", icon: Lightbulb, position: { x: 75, y: 50 }, isOn: true, points: 5 },
      { id: "ac", name: "Air Conditioner", icon: AirVent, position: { x: 25, y: 30 }, isOn: true, points: 20 },
      { id: "phone_charger", name: "Phone Charger", icon: Zap, position: { x: 80, y: 70 }, isOn: true, points: 3 },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    devices: [
      { id: "microwave", name: "Microwave", icon: Monitor, position: { x: 30, y: 40 }, isOn: true, points: 12 },
      { id: "kitchen_light", name: "Kitchen Light", icon: Lightbulb, position: { x: 50, y: 20 }, isOn: true, points: 8 },
      { id: "exhaust_fan", name: "Exhaust Fan", icon: AirVent, position: { x: 70, y: 25 }, isOn: true, points: 7 },
      { id: "coffee_maker", name: "Coffee Maker", icon: Monitor, position: { x: 60, y: 60 }, isOn: true, points: 10 },
    ],
  },
];

export default function EnergySaver() {
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [roomsData, setRoomsData] = useState(rooms);
  const [devicesFound, setDevicesFound] = useState(0);
  const [gameOverData, setGameOverData] = useState(null);
  
  const router = useRouter();
  const totalDevices = rooms.reduce((t, r) => t + r.devices.length, 0);
  const timerRef = useRef(null);

  const endGame = useCallback(() => {
    setGameState("gameOver");
    const accuracy = totalDevices > 0 ? Math.round((devicesFound / totalDevices) * 100) : 0;
    setGameOverData({
      score,
      accuracy,
      devicesFound,
      totalDevices,
      energySaved: devicesFound * 0.5,
    });
  }, [devicesFound, score, totalDevices]);

  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endGame]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(10);
    setCurrentRoomIndex(0);
    setDevicesFound(0);
    setRoomsData(
      rooms.map((room) => ({
        ...room,
        devices: room.devices.map((device) => ({ ...device, isOn: true })),
      }))
    );
  };

  const handleDeviceClick = (roomIndex, deviceId) => {
    if (gameState !== "playing") return;

    const deviceToUpdate = roomsData[roomIndex]?.devices.find((d) => d.id === deviceId);

    if (deviceToUpdate && deviceToUpdate.isOn) {
      setRoomsData((prev) =>
        prev.map((room, rIndex) =>
          rIndex === roomIndex
            ? {
                ...room,
                devices: room.devices.map((device) =>
                  device.id === deviceId ? { ...device, isOn: false } : device
                ),
              }
            : room
        )
      );
      setScore((prev) => prev + deviceToUpdate.points);
      setDevicesFound((prev) => prev + 1);
    }
  };

  const nextRoom = () => {
    if (currentRoomIndex < roomsData.length - 1) {
      setCurrentRoomIndex((prev) => prev + 1);
    }
  };

  const prevRoom = () => {
    if (currentRoomIndex > 0) {
      setCurrentRoomIndex((prev) => prev - 1);
    }
  };

  const restartGame = () => {
    setGameState("ready");
    setGameOverData(null);
  };

  const currentRoom = roomsData[currentRoomIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/games">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
              <Zap className="w-7 h-7 text-yellow-600" />
              Energy Saver Dash
            </h1>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Zap className="w-5 h-5 mr-2" />
            {score} pts
          </Badge>
        </div>

        {/* Game Stats */}
        {gameState !== "ready" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{timeLeft}s</div>
                <div className="text-sm text-gray-500">Time Left</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{devicesFound}</div>
                <div className="text-sm text-gray-500">Devices Off</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{currentRoomIndex + 1}</div>
                <div className="text-sm text-gray-500">Current Room</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{(devicesFound * 0.5).toFixed(1)}kWh</div>
                <div className="text-sm text-gray-500">Energy Saved</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Area */}
        <div className="relative min-h-96 mb-6">
          {gameState === "ready" && (
            <Card className="p-12 text-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <CardContent>
                <h2 className="text-3xl font-bold mb-4">Ready to Save Energy?</h2>
                <p className="text-xl mb-6">Race through rooms and turn off unused devices!</p>
                <Button onClick={startGame} size="lg" className="bg-white text-yellow-600 hover:bg-yellow-50">
                  <Play className="w-5 h-5 mr-2" /> Start Saving Energy
                </Button>
              </CardContent>
            </Card>
          )}

          {(gameState === "playing" || gameState === "paused") && currentRoom && (
            <div className="space-y-6">
              <EnergyRoom
                room={currentRoom}
                roomIndex={currentRoomIndex}
                onDeviceClick={handleDeviceClick}
                disabled={gameState === "paused"}
              />
              <div className="flex justify-between items-center">
                <Button onClick={prevRoom} disabled={currentRoomIndex === 0} variant="outline">
                  ← Previous Room
                </Button>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{currentRoom.name}</h3>
                  <p className="text-sm text-gray-500">
                    Room {currentRoomIndex + 1} of {roomsData.length}
                  </p>
                </div>
                <Button onClick={nextRoom} disabled={currentRoomIndex === roomsData.length - 1} variant="outline">
                  Next Room →
                </Button>
              </div>
              <div className="text-center space-x-4">
                {gameState === "playing" ? (
                  <Button onClick={() => setGameState("paused")} variant="outline">
                    <Pause className="w-5 h-5 mr-2" /> Pause
                  </Button>
                ) : (
                  <Button onClick={() => setGameState("playing")}>
                    <Play className="w-5 h-5 mr-2" /> Resume
                  </Button>
                )}
                <Button onClick={restartGame} variant="outline">
                  <RotateCcw className="w-5 h-5 mr-2" /> Restart
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Game Over */}
        <GameOverModal
          isOpen={gameState === "gameOver"}
          gameData={gameOverData}
          onPlayAgain={startGame}
          onBackToGames={() => router.push("/games")}
        />
      </div>
    </div>
  );
}