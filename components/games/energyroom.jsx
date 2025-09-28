import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function EnergyRoom({ room, roomIndex, onDeviceClick, disabled }) {
  return (
    <Card className="min-h-96 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="text-center text-2xl">{room.name}</CardTitle>
      </CardHeader>
      <CardContent className="relative h-80">
        {/* Room Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-blue-200 rounded-lg opacity-30" />
        
        {/* Devices */}
        {room.devices.map((device, index) => (
          <motion.button
            key={device.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl shadow-lg transition-all duration-300 ${
              device.isOn 
                ? 'bg-red-100 border-2 border-red-300 hover:bg-red-200' 
                : 'bg-green-100 border-2 border-green-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}`}
            style={{
              left: `${device.position.x}%`,
              top: `${device.position.y}%`
            }}
            onClick={() => !disabled && onDeviceClick(roomIndex, device.id)}
            whileHover={!disabled ? { scale: 1.1 } : {}}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-center">
              <device.icon className={`w-8 h-8 mx-auto mb-2 ${
                device.isOn ? 'text-red-600' : 'text-green-600'
              }`} />
              <div className={`text-xs font-medium ${
                device.isOn ? 'text-red-800' : 'text-green-800'
              }`}>
                {device.name}
              </div>
              <div className={`text-xs ${
                device.isOn ? 'text-red-600' : 'text-green-600'
              }`}>
                {device.isOn ? 'ON' : 'OFF'}
              </div>
              {device.isOn && (
                <div className="text-xs text-yellow-600 font-bold">
                  +{device.points} pts
                </div>
              )}
            </div>
            
            {/* Energy Glow Effect for ON devices */}
            {device.isOn && (
              <div className="absolute inset-0 rounded-xl bg-yellow-300 opacity-20 animate-pulse" />
            )}
          </motion.button>
        ))}

        {/* Room Instructions */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-sm text-gray-600 bg-white/80 rounded-lg px-4 py-2">
            Click on glowing devices to turn them off and save energy! ⚡
          </p>
        </div>
      </CardContent>
    </Card>
  );
}