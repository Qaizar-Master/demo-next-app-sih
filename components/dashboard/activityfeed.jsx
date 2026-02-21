import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Gamepad2 } from "lucide-react";
import { format } from "date-fns";

const gameTypeLabels = {
  "WASTE_SORTING": "Waste Sorting",
  "CARBON_CALCULATOR": "Carbon Calculator",
  "ENERGY_SAVER": "Energy Saver",
  "ECO_QUIZ": "Eco Quiz",
  "CHALLENGE": "Challenge",
  "waste-sorting": "Waste Sorting",
  "carbon-calculator": "Carbon Calculator",
  "energy-saver": "Energy Saver",
  "eco-quiz": "Eco Quiz",
};

const gameTypeColors = {
  "WASTE_SORTING": "bg-green-100 text-green-800",
  "CARBON_CALCULATOR": "bg-blue-100 text-blue-800",
  "ENERGY_SAVER": "bg-yellow-100 text-yellow-800",
  "ECO_QUIZ": "bg-purple-100 text-purple-800",
  "CHALLENGE": "bg-emerald-100 text-emerald-800",
  "waste-sorting": "bg-green-100 text-green-800",
  "carbon-calculator": "bg-blue-100 text-blue-800",
  "energy-saver": "bg-yellow-100 text-yellow-800",
  "eco-quiz": "bg-purple-100 text-purple-800",
};


export default function ActivityFeed({ recentSessions }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentSessions.length === 0 ? (
          <div className="text-center py-8">
            <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400">Play some games to see your activity here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session) => {
              // Support both new API shape (type, createdAt) and old shape (game_type, created_date)
              const type = session.type ?? session.game_type ?? "UNKNOWN";
              const date = session.createdAt ?? session.created_date;
              const pts = session.score ?? 0;
              return (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {gameTypeLabels[type] ?? type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {date ? format(new Date(date), "MMM d, h:mm a") : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={gameTypeColors[type] ?? "bg-gray-100 text-gray-800"}>
                      {pts} points
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
