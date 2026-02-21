"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy, Award, Zap, Gamepad2, Camera, Star,
  TrendingUp, Flame, Target, ArrowRight, Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import AchievementShowcase from "@/components/dashboard/achivementshowcase";
import ActivityFeed from "@/components/dashboard/activityfeed";
import QuickActions from "@/components/dashboard/quickactions";
import StatsCard from "@/components/dashboard/statscard";
import Layout from "@/components/side-bar/page";
import { api } from "@/lib/client-api";

// ─── Level system ─────────────────────────────────────────────────────────────
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

function getLevel(totalPoints) {
  let tier = LEVEL_TIERS[0];
  for (const t of LEVEL_TIERS) {
    if (totalPoints >= t[0]) tier = t;
    else break;
  }
  const tierIndex = LEVEL_TIERS.indexOf(tier);
  const nextTier = LEVEL_TIERS[tierIndex + 1];
  const progressInTier = totalPoints - tier[0];
  const tierSize = nextTier ? nextTier[0] - tier[0] : 1000;
  const progressPct = nextTier ? Math.round((progressInTier / tierSize) * 100) : 100;
  const ptsToNext = nextTier ? nextTier[0] - totalPoints : 0;
  return { level: tier[1], title: tier[2], progressPct, ptsToNext, nextTier };
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-pulse">
      <div className="h-10 w-72 bg-gray-100 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-28 bg-gray-100 rounded-2xl" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="h-80 bg-gray-100 rounded-2xl" />
        <div className="lg:col-span-2 h-80 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await api.syncProfile();
        const [profileData, sessionsData, badgesData] = await Promise.all([
          api.getProfile(),
          api.getGameSessions(3),
          api.getBadges(),
        ]);
        setProfile(profileData);
        setRecentSessions(sessionsData);
        setBadges(badgesData.filter((b) => b.earned));
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const totalPoints = profile?.totalPoints ?? 0;
  const { level, title: levelTitle, progressPct, ptsToNext } = getLevel(totalPoints);
  const streak = profile?.progress?.currentStreak ?? 0;

  if (isLoading) {
    return <Layout><Skeleton /></Layout>;
  }

  const firstName = profile?.fullName?.split(" ")[0] || "Eco Warrior";

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="p-6 md:p-10 space-y-8 max-w-[1400px] mx-auto">

          {/* ── Welcome header ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                Hey, {firstName}! 👋
              </h1>
              <p className="text-gray-400 mt-1 font-medium">
                {streak > 0
                  ? `🔥 ${streak}-day streak — keep it going!`
                  : "Ready to start your eco journey today?"}
              </p>
            </div>
            <Link href="/challenges">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-emerald-500 hover:scale-105 transition-all shadow-lg shadow-emerald-200">
                <Target className="w-3.5 h-3.5" /> Take a Challenge
              </button>
            </Link>
          </motion.div>

          {/* ── Stats cards ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            <StatsCard index={0} title="Total Points" value={totalPoints} icon={Star} color="text-amber-500" bgColor="bg-amber-50" subtitle="Lifetime earned" />
            <StatsCard index={1} title="Current Level" value={`Lv ${level}`} icon={TrendingUp} color="text-emerald-600" bgColor="bg-emerald-50" subtitle={levelTitle} />
            <StatsCard index={2} title="Badges Earned" value={badges.length} icon={Award} color="text-purple-600" bgColor="bg-purple-50" subtitle={`of 5 total`} />
            <StatsCard index={3} title="Day Streak" value={streak} icon={Flame} color="text-orange-500" bgColor="bg-orange-50" subtitle={streak > 0 ? "Active 🔥" : "Start one!"} />
          </div>

          {/* ── Level progress bar ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/60 via-white to-blue-50/40 pointer-events-none" />

            <div className="relative flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-200">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-lg leading-none">
                    Level {level} — <span className="text-emerald-600">{levelTitle}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {ptsToNext > 0
                      ? `${ptsToNext.toLocaleString()} pts to reach Level ${level + 1}`
                      : "🏆 Maximum level reached!"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-gray-900">{totalPoints.toLocaleString()}</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Total Points</p>
              </div>
            </div>

            <div className="relative">
              <Progress
                value={progressPct}
                className="h-3 bg-gray-100 [&>*]:bg-gradient-to-r [&>*]:from-emerald-500 [&>*]:to-green-400 [&>*]:rounded-full"
              />
              <span className="absolute right-0 -top-5 text-[10px] font-black text-emerald-600">
                {progressPct}%
              </span>
            </div>
          </motion.div>

          {/* ── Quick actions + Activity feed ──────────────────────────────── */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
            <div className="lg:col-span-2">
              <ActivityFeed recentSessions={recentSessions} />
            </div>
          </div>

          {/* ── Achievements ───────────────────────────────────────────────── */}
          <AchievementShowcase badges={badges} />

          {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl overflow-hidden p-8 text-white shadow-xl shadow-emerald-200"
          >
            {/* Background circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-200 mb-2">Next Mission</p>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1">Ready for your next challenge?</h2>
                <p className="text-emerald-100 text-sm max-w-sm">
                  Complete eco-actions, earn verified points, and climb the leaderboard!
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href="/games">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 text-xs font-black uppercase tracking-widest rounded-full hover:bg-emerald-50 transition-all hover:scale-105 shadow-lg">
                    <Gamepad2 className="w-4 h-4" /> Play Games
                  </button>
                </Link>
                <Link href="/challenges">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-white/30 transition-all hover:scale-105">
                    <Camera className="w-4 h-4" /> Challenges
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}
