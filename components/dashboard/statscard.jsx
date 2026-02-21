"use client";

import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, color, bgColor, subtitle, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      {/* Soft bg glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 ${bgColor} rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{title}</p>
          <p className="text-4xl font-black text-gray-900 tracking-tight leading-none">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-2 font-medium">{subtitle}</p>
          )}
        </div>
        <div className={`shrink-0 w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}