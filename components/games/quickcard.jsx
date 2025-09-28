import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function QuestionCard({ scenario, onChoice }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <scenario.icon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">{scenario.title}</CardTitle>
          <p className="text-gray-600">{scenario.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {scenario.choices.map((choice, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => onChoice(choice)}
                variant="outline"
                className="w-full p-4 h-auto flex items-center justify-between hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                <span className="text-left flex-1">{choice.text}</span>
                <div className="text-right text-sm">
                  <div className="text-red-600">+{choice.emissions} kg CO₂</div>
                  <div className="text-green-600">+{choice.points} pts</div>
                </div>
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}