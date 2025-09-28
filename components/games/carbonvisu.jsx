import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Leaf } from "lucide-react";

export default function CarbonVisualization({ emissions, points }) {
  const maxEmissions = 100;
  const emissionPercentage = Math.min((emissions / maxEmissions) * 100, 100);
  
  const getEmissionColor = (percentage) => {
    if (percentage < 30) return "bg-green-500";
    if (percentage < 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getEmissionMessage = (percentage) => {
    if (percentage < 30) return "Low carbon footprint - Great job! 🌱";
    if (percentage < 60) return "Moderate impact - Room for improvement 🌿";
    return "High carbon footprint - Consider eco-friendly choices ⚠️";
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Carbon Emissions Tracker */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Today's Carbon Footprint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {emissions.toFixed(1)} kg
              </div>
              <div className="text-sm text-gray-500">CO₂ Emissions</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Carbon Impact</span>
                <span>{emissionPercentage.toFixed(0)}%</span>
              </div>
              <Progress 
                value={emissionPercentage} 
                className="h-3"
                style={{
                  backgroundColor: '#f3f4f6'
                }}
              />
              <div className={`h-3 rounded-full ${getEmissionColor(emissionPercentage)} transition-all duration-500`} 
                   style={{ width: `${emissionPercentage}%` }} />
            </div>
            
            <p className="text-sm text-gray-600 text-center">
              {getEmissionMessage(emissionPercentage)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Eco Points Tracker */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Leaf className="w-5 h-5 text-green-500" />
            Eco Points Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {points}
              </div>
              <div className="text-sm text-gray-500">Points Today</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  {points > 80 ? "Eco Champion! 🏆" :
                   points > 60 ? "Great Choices! 🌟" :
                   points > 40 ? "Good Start! 👍" :
                   "Room to Improve! 💪"}
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}