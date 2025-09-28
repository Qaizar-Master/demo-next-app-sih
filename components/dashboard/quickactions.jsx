import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Camera, Trophy, Play } from "lucide-react";

const quickActions = [
  {
    title: "Waste Sorting Game",
    description: "Test your recycling knowledge",
    icon: Play,
    color: "bg-green-500",
    url: "/wastesorting",
  },
  {
    title: "Photo Challenge",
    description: "Document your eco-actions",
    icon: Camera,
    color: "bg-blue-500",
    url: "/challenges",
  },
  {
    title: "View Leaderboard",
    description: "See how you rank globally",
    icon: Trophy,
    color: "bg-yellow-500",
    url: "/leaderboard",
  },
];

export default function QuickActions() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-green-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.url}>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
              <div
                className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
