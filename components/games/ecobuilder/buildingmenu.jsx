
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Factory, 
  TreePine, 
  Sun, 
  Wind, 
  Building,
  DollarSign,
  Users,
  Smile,
  Cloud,
  Zap
} from 'lucide-react';

export const buildings = [
  { name: 'House', icon: Home, cost: 100, effects: { population: 10, happiness: 5, pollution: 1, energy: -2 } },
  { name: 'Apartment', icon: Building, cost: 300, effects: { population: 40, happiness: 10, pollution: 5, energy: -8 } },
  { name: 'Park', icon: TreePine, cost: 150, effects: { population: 0, happiness: 10, pollution: -5, energy: 0 } },
  { name: 'Factory', icon: Factory, cost: 500, effects: { population: 0, happiness: -10, pollution: 20, energy: -15 } },
  { name: 'Solar Farm', icon: Sun, cost: 400, effects: { population: 0, happiness: 2, pollution: -2, energy: 20 } },
  { name: 'Wind Turbine', icon: Wind, cost: 300, effects: { population: 0, happiness: 1, pollution: 0, energy: 15 } },
];

const EffectBadge = ({ icon: Icon, value, color }) => (
  <Badge variant="outline" className={`flex items-center gap-1 ${color}`}>
    <Icon className="w-3 h-3" />
    <span>{value > 0 ? `+${value}` : value}</span>
  </Badge>
);

export default function BuildingMenu({ selectedBuilding, onSelectBuilding, budget }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Building Menu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {buildings.map((building) => {
          const isSelected = selectedBuilding?.name === building.name;
          const isAffordable = budget >= building.cost;
          return (
            <button
              key={building.name}
              onClick={() => isAffordable && onSelectBuilding(building)}
              disabled={!isAffordable}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${!isAffordable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <building.icon className="w-5 h-5" />
                  <span className="font-semibold">{building.name}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-yellow-600">
                  <DollarSign className="w-4 h-4" />
                  {building.cost}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <EffectBadge icon={Users} value={building.effects.population} color="text-blue-600" />
                <EffectBadge icon={Smile} value={building.effects.happiness} color="text-green-600" />
                <EffectBadge icon={Cloud} value={building.effects.pollution} color={building.effects.pollution > 0 ? 'text-gray-600' : 'text-green-600'} />
                <EffectBadge icon={Zap} value={building.effects.energy} color={building.effects.energy > 0 ? 'text-orange-600' : 'text-gray-600'} />
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
