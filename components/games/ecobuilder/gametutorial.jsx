import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Smile, Cloud, DollarSign, Target, Play } from 'lucide-react';

export default function GameTutorial({ onStart }) {
  return (
    <Card className="p-8 text-center bg-gradient-to-r from-indigo-500 to-green-500 text-white">
      <CardContent>
        <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Building2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Welcome to Eco-City Builder!</h2>
        <p className="text-xl mb-6 text-indigo-100">
          Your mission: Build a sustainable city by balancing growth and the environment.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 text-left mb-8 max-w-4xl mx-auto">
          <div className="p-4 bg-white/10 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2"><Target className="w-5 h-5"/> Your Goal</h3>
            <p>Reach a population of 100 without going bankrupt or polluting too much.</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2"><DollarSign className="w-5 h-5"/> How to Play</h3>
            <p>Select buildings from the menu and place them on the grid. Each building has costs and effects.</p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2 mb-2"><Smile className="w-5 h-5"/> Balance is Key</h3>
            <p>1) Keep your citizens happy<Smile/> 2) your budget positive<DollarSign/> 3) Your pollution low<Cloud/></p>
          </div>
        </div>

        <Button onClick={onStart} size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
          <Play className="w-5 h-5 mr-2" />
          Start Building
        </Button>
      </CardContent>
    </Card>
  );
}