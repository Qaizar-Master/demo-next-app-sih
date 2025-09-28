import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Frown, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
// import { createPageUrl } from '@/lib/utils';

export default function WinLoseModal({ isOpen, status, stats, onPlayAgain }) {
  if (!isOpen) return null;
  
  const isWin = status === 'won';
  
  const title = isWin ? "City Flourished!" : "City in Crisis!";
  const Icon = isWin ? Trophy : Frown;
  const color = isWin ? "text-green-600" : "text-red-600";
  const bgColor = isWin ? "bg-green-100" : "bg-red-100";
  const reason = isWin
    ? "You've successfully built a sustainable and thriving city!"
    : stats.budget < 0
    ? "Your city went bankrupt."
    : "Pollution levels became unsustainable.";

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <div className={`w-16 h-16 ${bgColor} rounded-full mx-auto mb-4 flex items-center justify-center`}>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
          <DialogTitle className={`text-center text-2xl font-bold ${color}`}>
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-gray-600">{reason}</p>
          
          <div className="text-lg font-semibold">Final Stats:</div>
          <div className="grid grid-cols-2 gap-2 text-left p-4 bg-gray-50 rounded-lg">
            <p>Population: <span className="font-bold">{stats.population}</span></p>
            <p>Happiness: <span className="font-bold">{stats.happiness}%</span></p>
            <p>Budget: <span className="font-bold">${stats.budget.toLocaleString()}</span></p>
            <p>Pollution: <span className="font-bold">{stats.pollution}</span></p>
          </div>
          
          <div className="flex gap-3 pt-4">
           <Link href="/games">
              <Button variant="outline" className="w-half">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Games
              </Button>
          </Link>     
            <Button onClick={onPlayAgain} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}