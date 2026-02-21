"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { api } from "@/lib/client-api";
import {
  Home,
  Gamepad2,
  Target,
  Trophy,
  Leaf,
  BookOpen,
  Users,
  Newspaper,
  TreePine,
  ChartScatter,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, color: "text-green-600" },
  { title: "Eco Action", url: "/eco-action", icon: Leaf, color: "text-green-600" },
  { title: "Community Connect", url: "/community", icon: Users, color: "text-purple-600" },
  { title: "Games", url: "/games", icon: Gamepad2, color: "text-blue-600" },
  { title: "Challenges", url: "/challenges", icon: Target, color: "text-orange-600" },
  { title: "EcoTree", url: "/eco-tree", icon: TreePine, color: "text-purple-600" },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy, color: "text-yellow-600" },
  { title: "Monitoring Hub", url: "/monitoring-hub", icon: ChartScatter, color: "text-purple-600", },
  { title: "Resources", url: "/resources", icon: BookOpen, color: "text-purple-600" },
  { title: "News & Events", url: "/news-events", icon: Newspaper, color: "text-purple-600" },

];

export default function Layout({ children }) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    api.getProfile()
      .then((p) => { if (p?.isAdmin) setIsAdmin(true); })
      .catch(() => { });
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <Sidebar className="border-r border-green-200 bg-white/80 backdrop-blur-sm">

          {/* ── Logo → Landing page ─────────────────── */}
          <SidebarHeader className="border-b border-green-200 p-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900 group-hover:text-green-700 transition-colors">
                  EcoChamps
                </h2>
                <p className="text-xs text-green-600 font-medium">Learn • Act • Impact</p>
              </div>
            </Link>
          </SidebarHeader>

          {/* ── Nav items ───────────────────────────── */}
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-green-50 hover:text-green-700 transition-all duration-200 rounded-xl mb-1 group ${pathname === item.url ? "bg-green-100 text-green-700 shadow-sm" : ""
                          }`}
                      >
                        <Link href={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon
                            className={`w-5 h-5 transition-colors ${pathname === item.url
                              ? item.color
                              : "text-gray-500 group-hover:text-green-600"
                              }`}
                          />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {/* ── Admin-only entry ─ */}
                  {isAdmin && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={`transition-all duration-200 rounded-xl mb-1 group mt-1 border border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 ${pathname === "/admin" ? "bg-indigo-100 text-indigo-700 shadow-sm border-indigo-400" : ""
                          }`}
                      >
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3">
                          <ShieldCheck
                            className={`w-5 h-5 transition-colors ${pathname === "/admin" ? "text-indigo-600" : "text-indigo-400 group-hover:text-indigo-600"
                              }`}
                          />
                          <span className="font-medium text-indigo-700">Admin Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* ── Clerk UserButton footer ──────────────── */}
          <SidebarFooter className="border-t border-green-200 p-4">
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 ring-2 ring-green-300",
                  },
                }}
              />
              {user && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.fullName ?? user.firstName ?? "Eco Warrior"}
                  </p>
                  <p className="text-xs text-green-600 truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-green-100 p-2 rounded-lg transition-colors duration-200" />
              <Link href="/" className="flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">EcoChamps</h1>
              </Link>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
