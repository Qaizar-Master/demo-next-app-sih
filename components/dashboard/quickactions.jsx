"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Camera, Trophy, Leaf, ChevronRight, Zap, Play } from "lucide-react";

const quickActions = [
  {
    title: "Waste Sorting",
    description: "Test your recycling knowledge",
    icon: Play,
    gradient: "from-emerald-500 to-green-600",
    glow: "shadow-emerald-200",
    url: "/wastesorting",
  },
  {
    title: "Eco Challenge",
    description: "Document & verify eco-actions",
    icon: Camera,
    gradient: "from-blue-500 to-cyan-600",
    glow: "shadow-blue-200",
    url: "/challenges",
  },
  {
    title: "Leaderboard",
    description: "See your global ranking",
    icon: Trophy,
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-200",
    url: "/leaderboard",
  },
  {
    title: "Eco Games",
    description: "Play and earn points",
    icon: Gamepad2,
    gradient: "from-purple-500 to-violet-600",
    glow: "shadow-purple-200",
    url: "/games",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex items-center gap-2 border-b border-gray-50">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Zap className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="font-black text-gray-900 uppercase tracking-wide text-sm">Quick Actions</h3>
      </div>

      <div className="p-4 space-y-2">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.url}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
          >
            <Link href={action.url}>
              <div className="group flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} shadow-md ${action.glow} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm leading-tight">{action.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{action.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
