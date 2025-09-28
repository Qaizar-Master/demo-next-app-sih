"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function GameBin({ bin, onDrop, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    
    // Assumes the draggable item's type is stored as 'text/plain'
    const itemType = e.dataTransfer.getData('text/plain');
    setIsDragOver(false);
    onDrop(itemType);
  };

  return (
    <motion.div
      animate={{ scale: isDragOver ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <Card
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-8 h-48 flex flex-col items-center justify-center transition-all duration-300 ${
          isDragOver ? 'ring-4 ring-blue-300' : '' // Removed scale-105 from here
        } ${bin.color} text-white hover:shadow-xl ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="text-5xl mb-4 pointer-events-none">{bin.emoji}</div>
        <h3 className="text-xl font-bold text-center pointer-events-none">{bin.name}</h3>
        <p className="text-sm opacity-90 text-center mt-2 pointer-events-none">
          Drop {bin.type} items here
        </p>
      </Card>
    </motion.div>
  );
}