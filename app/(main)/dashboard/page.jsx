"use client"; 

import React, { useState, useEffect } from "react";
import Link from "next/link"; 
import { UserProgress, GameSession, User } from "@/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Zap, Gamepad2, Camera, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";



import AchievementShowcase from "@/components/dashboard/achivementshowcase";
import ActivityFeed from "@/components/dashboard/activityfeed";
import QuickActions from "@/components/dashboard/quickactions";
import StatsCard from "@/components/dashboard/statscard";
import Layout from "@/components/side-bar/page";


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (currentUser) {
          // Get or create user progress
          const progressList = await UserProgress.filter({
            user_email: currentUser.email,
          });
          let progress;
          if (progressList.length === 0) {
            progress = await UserProgress.create({
              user_email: currentUser.email,
              level: 1,
              total_points: 0,
              badges: [],
              current_streak: 0,
            });
          } else {
            progress = progressList[0];
          }
          setUserProgress(progress);

          // Get recent game sessions
          const sessions = await GameSession.filter(
            { user_email: currentUser.email },
            "-created_date",
            5
          );
          setRecentSessions(sessions);
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const levelProgress = userProgress ? userProgress.total_points % 100 : 0;
  const nextLevelPoints = userProgress
    ? 100 - (userProgress.total_points % 100)
    : 100;

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
          Welcome back, {user?.full_name?.split(" ")[0] || "Eco Warrior"}! 🌱
        </h1>
        <p className="text-lg text-gray-600">
          Ready to make a positive impact on our planet today?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Points"
          value={userProgress?.total_points || 0}
          icon={Star}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatsCard
          title="Current Level"
          value={userProgress?.level || 1}
          icon={Trophy}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatsCard
          title="Badges Earned"
          value={userProgress?.badges?.length || 0}
          icon={Award}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatsCard
          title="Daily Streak"
          value={userProgress?.current_streak || 0}
          icon={Zap}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">
                Level {userProgress?.level || 1}
              </h3>
              <p className="text-green-100">
                {nextLevelPoints} points to next level
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {userProgress?.total_points || 0}
              </div>
              <div className="text-sm text-green-100">Total Points</div>
            </div>
          </div>
          <Progress
            value={levelProgress}
            className="bg-green-400/30 [&>*]:bg-white"
          />
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

      <AchievementShowcase badges={userProgress?.badges || []} />

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready for Your Next Challenge?
          </h2>
          <p className="text-blue-100 mb-6">
            Complete games and real-world challenges to earn more points and
            badges!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Fix #3: Use href prop with direct paths */}
            <Link href="/games">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play Games
              </Button>
            </Link>
            <Link href="/challenges">
              <Button
                variant="outline"
                className="w-full border-white text-white hover:bg-white/20"
              >
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
