import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star } from "lucide-react";

const badgeColors = {
  "first-game": "bg-green-100 text-green-800",
  "waste-warrior": "bg-blue-100 text-blue-800", 
  "energy-saver": "bg-yellow-100 text-yellow-800",
  "eco-champion": "bg-purple-100 text-purple-800",
  "challenge-master": "bg-orange-100 text-orange-800"
};

const badgeDescriptions = {
  "first-game": "Completed your first game!",
  "waste-warrior": "Master of waste sorting",
  "energy-saver": "Energy conservation expert", 
  "eco-champion": "Environmental champion",
  "challenge-master": "Real-world challenge expert"
};

export default function AchievementShowcase({ badges }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          Achievements & Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No badges earned yet</p>
            <p className="text-sm text-gray-400">Complete games and challenges to earn your first badge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <Badge className={`mb-2 ${badgeColors[badge] || 'bg-gray-100 text-gray-800'}`}>
                  {badge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                <p className="text-xs text-gray-500">
                  {badgeDescriptions[badge] || "Achievement unlocked!"}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}