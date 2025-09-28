// components/games/GameCard.jsx

import React from "react";
import Link from "next/link"; // CORRECT import for Next.js
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Star } from "lucide-react";

export default function GameCard({ game }) {
  return (
    // CORRECT: Uses `href` prop
    <Link href={game.url} className="block group">
      <Card className="h-full flex flex-col transition-all duration-300 group-hover:border-green-500 group-hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${game.color}`}
            >
              <game.icon className="w-6 h-6 text-white" />
            </div>
            <Badge variant="outline">{game.difficulty}</Badge>
          </div>
          <CardTitle className="pt-4">{game.title}</CardTitle>
          <CardDescription>{game.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Learning Objective:</span>{" "}
            {game.learning}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{game.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>{game.points} pts</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
