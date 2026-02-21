"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Lock, Sparkles, Star } from "lucide-react";

const allBadges = [
  { id: "first-game", name: "First Game", description: "Completed your first game", icon: "🎮", gradient: "from-emerald-400 to-green-500", ring: "ring-emerald-200", light: "bg-emerald-50 border-emerald-100" },
  { id: "waste-warrior", name: "Waste Warrior", description: "Master of waste sorting", icon: "♻️", gradient: "from-blue-400 to-cyan-500", ring: "ring-blue-200", light: "bg-blue-50 border-blue-100" },
  { id: "energy-saver", name: "Energy Saver", description: "Energy conservation expert", icon: "⚡", gradient: "from-amber-400 to-yellow-500", ring: "ring-amber-200", light: "bg-amber-50 border-amber-100" },
  { id: "eco-champion", name: "Eco Champion", description: "Environmental champion", icon: "🌍", gradient: "from-purple-400 to-violet-500", ring: "ring-purple-200", light: "bg-purple-50 border-purple-100" },
  { id: "challenge-master", name: "Challenge Master", description: "Real-world challenge expert", icon: "🏆", gradient: "from-orange-400 to-red-500", ring: "ring-orange-200", light: "bg-orange-50 border-orange-100" },
];

export default function AchievementShowcase({ badges }) {
  // badges is an array of badge objects with .id (or strings)
  const earnedIds = new Set(badges.map((b) => b?.id ?? b));
  const earnedCount = earnedIds.size;
  const totalCount = allBadges.length;
  const pct = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-black text-gray-900 uppercase tracking-wide text-sm">Achievements</h3>
          </div>
          <span className="text-xs font-bold text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
            {earnedCount}/{totalCount} unlocked
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <span className="text-xs font-black text-gray-400 w-8 text-right">{pct}%</span>
        </div>
      </div>

      {/* Badge grid */}
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {allBadges.map((badge, i) => {
          const isEarned = earnedIds.has(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className={`relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-300 ${isEarned
                  ? `${badge.light} hover:shadow-md hover:-translate-y-0.5 cursor-default`
                  : "bg-gray-50 border-gray-100 opacity-50"
                }`}
            >
              {/* Badge circle */}
              <div className="relative mb-3">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 ${isEarned
                      ? `bg-gradient-to-br ${badge.gradient} shadow-lg ring-4 ${badge.ring}`
                      : "bg-gray-200"
                    }`}
                >
                  {isEarned ? (
                    <span className="drop-shadow">{badge.icon}</span>
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Sparkle pulse */}
                {isEarned && (
                  <motion.div
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>

              <p className={`text-xs font-black uppercase tracking-wide leading-tight mb-1 ${isEarned ? "text-gray-800" : "text-gray-400"}`}>
                {badge.name}
              </p>
              <p className={`text-[10px] leading-snug ${isEarned ? "text-gray-500" : "text-gray-300"}`}>
                {isEarned ? badge.description : "Locked"}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}