import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function WasteItem({ item, onDrop, disabled }) {
  const handleDragStart = (e) => {
    if (disabled) return;
    e.dataTransfer.setData('text/plain', item.type);
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <Card 
        draggable={!disabled}
        onDragStart={handleDragStart}
        className={`p-8 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-300 ${item.color} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">{item.emoji}</div>
          <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1 capitalize">{item.type}</p>
        </div>
      </Card>
    </motion.div>
  );
}