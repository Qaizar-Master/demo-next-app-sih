"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Zap, Gamepad2, Camera, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import AchievementShowcase from "@/components/dashboard/achivementshowcase";
import ActivityFeed from "@/components/dashboard/activityfeed";
import QuickActions from "@/components/dashboard/quickactions";
import StatsCard from "@/components/dashboard/statscard";
import Layout from "@/components/side-bar/page";
import { api } from "@/lib/client-api";

// Level thresholds — each entry is [minPoints, levelNumber, title]
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

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // Upsert profile on every page load (safe – idempotent)
        await api.syncProfile();

        const [profileData, sessionsData, badgesData] = await Promise.all([
          api.getProfile(),
          api.getGameSessions(5),
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
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8">

        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.fullName?.split(" ")[0] || "Eco Warrior"}! 🌱
          </h1>
          <p className="text-lg text-gray-600">
            Ready to make a positive impact on our planet today?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Points"
            value={totalPoints}
            icon={Star}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <StatsCard
            title="Current Level"
            value={level}
            icon={Trophy}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatsCard
            title="Badges Earned"
            value={badges.length}
            icon={Award}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
          <StatsCard
            title="Daily Streak"
            value={streak}
            icon={Zap}
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
        </div>

        {/* Level Progress */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-xl font-bold">Level {level} — {levelTitle}</h3>
                <p className="text-green-100 text-sm">
                  {ptsToNext > 0 ? `${ptsToNext} pts to next level` : "Max level reached! 🏆"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
                <div className="text-sm text-green-100">Total Points</div>
              </div>
            </div>
            <Progress value={progressPct} className="mt-3 bg-green-400/30 [&>*]:bg-white" />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed recentSessions={recentSessions} />
          </div>
        </div>

        <AchievementShowcase badges={badges} />

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready for Your Next Challenge?</h2>
            <p className="text-blue-100 mb-6">
              Complete games and real-world challenges to earn more points and badges!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/games">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Play Games
                </Button>
              </Link>
              <Link href="/challenges">
                <Button variant="outline" className="w-full border-white text-white hover:bg-white/20">
                  <Camera className="w-5 h-5 mr-2" />
                  Take Challenges
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </Layout>
  );
}
