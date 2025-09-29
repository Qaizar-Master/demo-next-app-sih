"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Gamepad2,
  Target,
  Trophy,
  User,
  Leaf,
  Settings,
  BookOpen,
  UserIcon,
  User2Icon,
  Newspaper,
  TreePine,
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
  {
    title: "Dashboard",
    url: "/dashboard", // Direct path
    icon: Home,
    color: "text-green-600",
  },
  {
    title: "Games",
    url: "/games", // Direct path
    icon: Gamepad2,
    color: "text-blue-600",
  },
  {
    title: "Challenges",
    url: "/challenges", // Direct path
    icon: Target,
    color: "text-orange-600",
  },
  {
    title: "Leaderboard",
    url: "/leaderboard", // Direct path
    icon: Trophy,
    color: "text-yellow-600",
  },
  {
    title: "Classroom Connect",
    url: "/classroom", // Direct path
    icon: User2Icon,
    color: "text-purple-600",
  },
  {
    title: "Resources",
    url: "/resources", // Direct path
    icon: BookOpen,
    color: "text-purple-600",
  },
  {
    title: "EcoTree",
    url: "/eco-tree", // Direct path
    icon: TreePine,
    color: "text-purple-600",
  },
  {
    title: "News & Events",
    url: "/news-events", // Direct path
    icon: Newspaper,
    color: "text-purple-600",
  },
  
];

export default function Layout({ children }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --eco-primary: #10B981;
            --eco-secondary: #059669;
            --eco-accent: #34D399;
            --eco-background: #F0FDF4;
            --eco-surface: #FFFFFF;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <Sidebar className="border-r border-green-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-green-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">EcoChamps</h2>
                <p className="text-xs text-green-600 font-medium">
                  Learn • Act • Impact
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-green-50 hover:text-green-700 transition-all duration-200 rounded-xl mb-1 group ${
                          pathname === item.url
                            ? "bg-green-100 text-green-700 shadow-sm"
                            : ""
                        }`}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <item.icon
                            className={`w-5 h-5 transition-colors ${
                              pathname === item.url
                                ? item.color
                                : "text-gray-500 group-hover:text-green-600"
                            }`}
                          />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-green-200 p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-gray-900 text-sm">Eco Warrior</p>
              <p className="text-xs text-green-600">Making Earth Better</p>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-green-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-green-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">EcoLearn</h1>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
