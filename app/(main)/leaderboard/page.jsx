"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy, Medal, Crown, Star, Award, ArrowLeft,
  Search, CheckCircle, Loader2, Flame, Shield
} from "lucide-react";
import { api } from "@/lib/client-api";

// ─── Level system (mirrors dashboard) ─────────────────────────────────────
const LEVEL_TIERS = [
  [0, 1, "Seedling"],
  [100, 2, "Sprout"],
  [250, 3, "Sapling"],
  [500, 4, "Eco Scout"],
  [800, 5, "Green Guard"],
  [1200, 6, "Earth Defender"],
  [1800, 7, "Eco Warrior"],
  [2600, 8, "Planet Protector"],
  [3600, 9, "Biosphere Hero"],
  [5000, 10, "EcoChamp Legend"],
];
function getLevelTitle(pts) {
  let tier = LEVEL_TIERS[0];
  for (const t of LEVEL_TIERS) { if (pts >= t[0]) tier = t; else break; }
  return { level: tier[1], title: tier[2] };
}

// ─── Rank decorations ───────────────────────────────────────────────────────
const RANK_META = {
  1: { bg: "from-yellow-400 to-amber-500", ring: "ring-yellow-400", badge: "bg-yellow-100 text-yellow-800", icon: Crown, label: "1st" },
  2: { bg: "from-slate-300 to-slate-400", ring: "ring-slate-300", badge: "bg-slate-100  text-slate-700", icon: Medal, label: "2nd" },
  3: { bg: "from-orange-400 to-amber-600", ring: "ring-orange-400", badge: "bg-orange-100 text-orange-800", icon: Trophy, label: "3rd" },
};

// ─── Podium card (top 3) ────────────────────────────────────────────────────
function PodiumCard({ entry, delay }) {
  const meta = RANK_META[entry.rank];
  const Icon = meta.icon;
  const { level, title } = getLevelTitle(entry.points);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120 }}
      className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl bg-gradient-to-b ${meta.bg} shadow-xl text-white`}
      style={{ minWidth: 0 }}
    >
      {/* Rank badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-white/30 backdrop-blur-sm`}>
          <Icon className="w-3.5 h-3.5" /> {meta.label}
        </span>
      </div>

      {/* Avatar */}
      <div className={`mt-3 w-20 h-20 rounded-full ring-4 ${meta.ring} overflow-hidden shadow-lg`}>
        {entry.user?.avatarUrl ? (
          <img src={entry.user.avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white/20 flex items-center justify-center text-3xl font-black">
            {entry.user?.fullName?.[0] ?? "?"}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="font-bold text-lg leading-tight">{entry.user?.fullName ?? "Anonymous"}</p>
        <p className="text-xs text-white/70 font-medium">Level {level} · {title}</p>
      </div>

      <div className="text-center">
        <p className="text-3xl font-black">{entry.points.toLocaleString()}</p>
        <p className="text-xs text-white/70 uppercase tracking-widest">eco-points</p>
      </div>
    </motion.div>
  );
}

// ─── Row (rank 4–10) ────────────────────────────────────────────────────────
function LeaderRow({ entry, index, myId }) {
  const { level, title } = getLevelTitle(entry.points);
  const isMe = entry.userId === myId;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${isMe ? "bg-green-50 ring-2 ring-green-400" : "hover:bg-gray-50"
        }`}
    >
      {/* Rank number */}
      <div className="w-9 text-center">
        <span className="text-lg font-extrabold text-gray-400">#{entry.rank}</span>
      </div>

      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0 shadow">
        {entry.user?.avatarUrl ? (
          <img src={entry.user.avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white text-base font-bold">{entry.user?.fullName?.[0] ?? "?"}</span>
        )}
      </div>

      {/* Name + level */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {entry.user?.fullName ?? "Anonymous"}
          {isMe && <span className="ml-2 text-xs font-normal text-green-600">(You)</span>}
        </p>
        <p className="text-xs text-gray-400">Level {level} · {title}</p>
      </div>

      {/* Points */}
      <div className="text-right flex-shrink-0">
        <p className="font-black text-gray-900 text-lg">{entry.points.toLocaleString()}</p>
        <p className="text-xs text-gray-400">pts</p>
      </div>
    </motion.div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [allTime, setAllTime] = useState({ entries: [], myEntry: null });
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [lbData, badgeData] = await Promise.all([
          api.getLeaderboard("allTime", 50),
          api.getBadges(),
        ]);
        setAllTime(lbData);
        setBadges(badgeData);
      } catch (err) {
        console.error("Leaderboard load error:", err);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const myId = allTime.myEntry?.userId;

  // Top 3 podium + rest list
  const topEntries = allTime.entries.slice(0, 10);
  const podium = topEntries.filter(e => e.rank <= 3);
  // Reorder podium: 2nd, 1st, 3rd for visual "mountain" effect
  const podiumOrdered = [
    podium.find(e => e.rank === 2),
    podium.find(e => e.rank === 1),
    podium.find(e => e.rank === 3),
  ].filter(Boolean);
  const rest = topEntries.filter(e => e.rank > 3);

  const filtered = topEntries
    .filter(e => e.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <div className="mt-3 text-center">
            <h1 className="text-4xl font-black text-gray-900 flex items-center justify-center gap-3">
              <Trophy className="w-9 h-9 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="text-gray-500 mt-1">All-Time Top 10 Eco Warriors by total points</p>
          </div>

          {allTime.myEntry && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="mt-3 mx-auto w-fit bg-green-50 border border-green-200 text-green-800 px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
              Your rank: #{allTime.myEntry.rank} — {allTime.myEntry.points.toLocaleString()} pts
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Tabs defaultValue="top10">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="top10">🏆 All-Time Top 10</TabsTrigger>
            <TabsTrigger value="badges">🎖️ Badges</TabsTrigger>
          </TabsList>

          {/* ── Top 10 Tab ── */}
          <TabsContent value="top10" className="space-y-6 mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                <p className="text-gray-400">Loading champions...</p>
              </div>
            ) : topEntries.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-semibold">No players yet</p>
                <p className="text-sm mt-1">Earn eco-points to appear here!</p>
              </div>
            ) : (
              <>
                {/* ─ Podium (Top 3) ─ */}
                {podiumOrdered.length > 0 && (
                  <div>
                    <h2 className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">🏆 Podium</h2>
                    <div className="grid grid-cols-3 gap-4 items-end">
                      {podiumOrdered.map((entry, i) => (
                        <div
                          key={entry.userId}
                          style={{ marginTop: entry.rank === 1 ? 0 : entry.rank === 2 ? 24 : 32 }}
                        >
                          <PodiumCard entry={entry} delay={i * 0.1} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─ Search ─ */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search top 10 players..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 outline-none bg-white"
                  />
                </div>

                {/* ─ Full list (1–10) ─ */}
                <Card className="shadow-lg border-0 rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-5">
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <Flame className="w-5 h-5" /> All-Time Top {Math.min(topEntries.length, 10)} Rankings
                    </CardTitle>
                    <p className="text-purple-200 text-sm mt-0.5">Ranked by total eco-points earned</p>
                  </CardHeader>
                  <CardContent className="p-4 space-y-1 bg-white">
                    <AnimatePresence>
                      {(searchQuery ? filtered : topEntries).slice(0, 10).map((entry, i) => (
                        <LeaderRow key={entry.userId} entry={entry} index={i} myId={myId} />
                      ))}
                    </AnimatePresence>
                    {filtered.length === 0 && searchQuery && (
                      <p className="text-center text-gray-400 py-8">No player named "{searchQuery}" in the top 10</p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* ── Badges Tab ── */}
          <TabsContent value="badges" className="space-y-6 mt-6">
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" /> Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No badges defined yet.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map((badge, index) => (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-2xl border-2 transition-all ${badge.earned ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-emerald-100">
                            <Award className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                              {badge.earned && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-xs font-medium">Earned</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
