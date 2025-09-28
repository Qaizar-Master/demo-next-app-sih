import React from 'react';
import { motion } from 'framer-motion';

const GridCell = ({ building, onClick, isPlaceable }) => {
  const Icon = building?.icon;
  return (
    <button
      onClick={onClick}
      className={`aspect-square border border-gray-200 flex items-center justify-center transition-colors duration-200 ${
        building ? 'bg-gray-100' : isPlaceable ? 'bg-green-100 hover:bg-green-200' : 'bg-white hover:bg-gray-50'
      }`}
    >
      {building && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Icon className="w-6 h-6 text-gray-700" />
        </motion.div>
      )}
    </button>
  );
};

export default function GameGrid({ grid, onCellClick, selectedBuilding, size }) {
  return (
    <div 
      className="grid gap-1 bg-gray-200 p-1 rounded-lg"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
    >
      {grid.map((cell, index) => (
        <GridCell 
          key={index}
          building={cell}
          onClick={() => onCellClick(index)}
          isPlaceable={selectedBuilding && !cell}
        />
      ))}
    </div>
  );
}