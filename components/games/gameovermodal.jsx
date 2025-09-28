import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Target, 
  Star, 
  RotateCcw, 
  ArrowLeft,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

export default function GameOverModal({ isOpen, gameData, onPlayAgain, onBackToGames }) {
  if (!gameData) return null;

  const getPerformanceLevel = (accuracy) => {
    if (accuracy >= 90) return { text: "Excellent!", color: "text-green-600", icon: "🏆" };
    if (accuracy >= 75) return { text: "Great Job!", color: "text-blue-600", icon: "🎉" };
    if (accuracy >= 60) return { text: "Good Effort!", color: "text-yellow-600", icon: "👍" };
    return { text: "Keep Trying!", color: "text-orange-600", icon: "💪" };
  };

  const performance = getPerformanceLevel(gameData.accuracy);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Game Complete! {performance.icon}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Score Display */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {gameData.score}
            </div>
            <Badge className="text-lg px-4 py-2 bg-yellow-100 text-yellow-800">
              Points Earned
            </Badge>
          </motion.div>

          {/* Performance */}
          <div className="text-center">
            <h3 className={`text-xl font-bold ${performance.color} mb-2`}>
              {performance.text}
            </h3>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{gameData.accuracy}%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {gameData.correctItems}/{gameData.totalItems}
              </div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
          </div>

          {/* Badges Earned */}
          {gameData.newBadges && gameData.newBadges.length > 0 && (
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-purple-800 mb-2">New Badges Earned!</div>
              <div className="flex flex-wrap justify-center gap-2">
                {gameData.newBadges.map((badge, index) => (
                  <Badge key={index} className="bg-purple-100 text-purple-800">
                    {badge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={onBackToGames}
              variant="outline" 
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
            <Button 
              onClick={onPlayAgain}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}