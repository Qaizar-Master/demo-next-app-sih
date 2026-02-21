"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Gamepad2, CalendarDays } from "lucide-react";
import { format, subDays, startOfWeek, eachDayOfInterval, getMonth, getYear } from "date-fns";

// ─── Helpers ────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getIntensity(points, maxPoints) {
  if (!points || points === 0) return 0;
  const ratio = points / maxPoints;
  if (ratio < 0.15) return 1;
  if (ratio < 0.35) return 2;
  if (ratio < 0.65) return 3;
  return 4;
}

const CELL_COLORS = [
  "bg-gray-100 border border-gray-200",     // 0 — empty
  "bg-emerald-200 border border-emerald-300", // 1 — light
  "bg-emerald-400 border border-emerald-500", // 2 — medium
  "bg-emerald-600 border border-emerald-700", // 3 — high
  "bg-emerald-800 border border-emerald-900", // 4 — max
];

const CELL_TITLE_COLORS = ["No activity", "Low activity", "Some activity", "High activity", "Most active"];

// ─── Heatmap grid ────────────────────────────────────────────────────────────

function ContributionGrid({ heatmapData }) {
  const today = new Date();
  const startDate = subDays(today, 364); // last 365 days
  // Align to the Monday of that week
  const gridStart = startOfWeek(startDate, { weekStartsOn: 1 });

  const allDays = eachDayOfInterval({ start: gridStart, end: today });

  // Build week columns: each column is 7 days (Mon–Sun)
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const maxPoints = Math.max(1, ...Object.values(heatmapData));

  // Month labels — find the first week where a new month starts
  const monthLabels = [];
  weeks.forEach((week, wi) => {
    const firstDay = week[0];
    const month = getMonth(firstDay);
    const prev = wi > 0 ? getMonth(weeks[wi - 1][0]) : -1;
    if (month !== prev) {
      monthLabels.push({ wi, label: MONTHS[month] });
    }
  });

  const [tooltip, setTooltip] = useState(null); // { text, x, y }

  return (
    <div className="relative overflow-x-auto select-none">
      {/* Month labels */}
      <div className="flex mb-1 pl-8">
        {weeks.map((_, wi) => {
          const label = monthLabels.find((m) => m.wi === wi);
          return (
            <div key={wi} className="w-[13px] mr-[2px] text-[9px] text-gray-400 font-medium shrink-0">
              {label ? label.label : ""}
            </div>
          );
        })}
      </div>

      <div className="flex gap-0">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-[2px] mr-1 shrink-0">
          {["Mon", "", "Wed", "", "Fri", "", "Sun"].map((d, i) => (
            <div key={i} className="h-[13px] text-[9px] text-gray-400 font-medium flex items-center">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const pts = heatmapData[key] ?? 0;
                const intensity = getIntensity(pts, maxPoints);
                const isFuture = day > today;

                return (
                  <div
                    key={key}
                    className={`w-[13px] h-[13px] rounded-[2px] cursor-pointer transition-transform hover:scale-125 ${isFuture ? "bg-gray-50 border border-gray-100" : CELL_COLORS[intensity]
                      }`}
                    onMouseEnter={(e) => {
                      if (isFuture) return;
                      setTooltip({
                        text: pts > 0
                          ? `${pts} pts · ${format(day, "MMM d, yyyy")}`
                          : `No activity · ${format(day, "MMM d, yyyy")}`,
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end text-[10px] text-gray-400 font-medium">
        <span>Less</span>
        {CELL_COLORS.map((cls, i) => (
          <div key={i} title={CELL_TITLE_COLORS[i]} className={`w-[13px] h-[13px] rounded-[2px] ${cls}`} />
        ))}
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl pointer-events-none whitespace-nowrap -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

// ─── Game session labels / colors ────────────────────────────────────────────

const gameTypeLabels = {
  WASTE_SORTING: "Waste Sorting",
  CARBON_CALCULATOR: "Carbon Calculator",
  ENERGY_SAVER: "Energy Saver",
  ECO_QUIZ: "Eco Quiz",
  CHALLENGE: "Challenge",
  "waste-sorting": "Waste Sorting",
  "carbon-calculator": "Carbon Calculator",
  "energy-saver": "Energy Saver",
  "eco-quiz": "Eco Quiz",
};

const gameTypeColors = {
  WASTE_SORTING: "bg-green-100 text-green-800",
  CARBON_CALCULATOR: "bg-blue-100 text-blue-800",
  ENERGY_SAVER: "bg-yellow-100 text-yellow-800",
  ECO_QUIZ: "bg-purple-100 text-purple-800",
  CHALLENGE: "bg-emerald-100 text-emerald-800",
  "waste-sorting": "bg-green-100 text-green-800",
  "carbon-calculator": "bg-blue-100 text-blue-800",
  "energy-saver": "bg-yellow-100 text-yellow-800",
  "eco-quiz": "bg-purple-100 text-purple-800",
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function ActivityFeed({ recentSessions }) {
  const [tab, setTab] = useState("heatmap"); // "heatmap" | "list"
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity-heatmap?months=12")
      .then((r) => r.json())
      .then((json) => setHeatmapData(json.data ?? {}))
      .catch(() => setHeatmapData({}))
      .finally(() => setLoading(false));
  }, []);

  // Total contribution days
  const activeDays = heatmapData ? Object.values(heatmapData).filter((v) => v > 0).length : 0;
  const totalPts = heatmapData ? Object.values(heatmapData).reduce((s, v) => s + v, 0) : 0;

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Recent Activity
          </CardTitle>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTab("heatmap")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${tab === "heatmap"
                ? "bg-white shadow-sm text-emerald-700"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Heatmap
            </button>
            <button
              onClick={() => setTab("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${tab === "list"
                ? "bg-white shadow-sm text-blue-700"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" /> Sessions
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {tab === "heatmap" ? (
          <div>
            {/* Summary row */}
            <div className="flex gap-4 mb-4 text-sm text-gray-600">
              <span><strong className="text-gray-900">{activeDays}</strong> active days</span>
              <span><strong className="text-emerald-600">{totalPts.toLocaleString()}</strong> total points (last 12 mo)</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-28 text-gray-400 text-sm animate-pulse">
                Loading activity…
              </div>
            ) : (
              <ContributionGrid heatmapData={heatmapData} />
            )}
          </div>
        ) : (
          /* Session list */
          recentSessions.length === 0 ? (
            <div className="text-center py-8">
              <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400">Play some games to see your activity here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.slice(0, 3).map((session) => {
                const type = session.type ?? session.game_type ?? "UNKNOWN";
                const date = session.createdAt ?? session.created_date;
                const pts = session.score ?? 0;
                return (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shrink-0">
                        <Gamepad2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{gameTypeLabels[type] ?? type}</p>
                        <p className="text-xs text-gray-500">{date ? format(new Date(date), "MMM d, h:mm a") : "—"}</p>
                      </div>
                    </div>
                    <Badge className={`${gameTypeColors[type] ?? "bg-gray-100 text-gray-800"} text-xs`}>
                      +{pts} pts
                    </Badge>
                  </div>
                );
              })}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
