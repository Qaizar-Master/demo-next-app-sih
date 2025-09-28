import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Smile, 
  DollarSign, 
  Cloud, 
  Zap,
  Target
} from 'lucide-react';

const StatItem = ({ icon: Icon, value, label, color }) => (
  <div className="flex items-center gap-3">
    <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export default function StatsDisplay({ stats, targetPopulation, maxPollution }) {
  const populationProgress = (stats.population / targetPopulation) * 100;
  const pollutionProgress = (stats.pollution / maxPollution) * 100;

  return (
    <Card className="bg-gray-50">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          <StatItem icon={Users} value={stats.population} label="Population" color="text-blue-600" />
          <StatItem icon={Smile} value={`${stats.happiness}%`} label="Happiness" color="text-green-600" />
          <StatItem icon={DollarSign} value={stats.budget.toLocaleString()} label="Budget" color="text-yellow-600" />
          <StatItem icon={Cloud} value={stats.pollution} label="Pollution" color="text-gray-600" />
          <StatItem icon={Zap} value={stats.energy} label="Energy" color="text-orange-600" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <div className="flex items-center gap-1 font-medium"><Target className="w-4 h-4"/> Population Goal</div>
              <span>{stats.population} / {targetPopulation}</span>
            </div>
            <Progress value={populationProgress} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <div className="flex items-center gap-1 font-medium"><Cloud className="w-4 h-4"/> Pollution Level</div>
              <span>{stats.pollution} / {maxPollution}</span>
            </div>
            <Progress value={pollutionProgress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}