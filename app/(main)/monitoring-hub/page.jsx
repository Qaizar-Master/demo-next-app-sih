"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf,
    MapPin,
    Info,
    Wind,
    CloudRain,
    Activity,
    Droplet,
    Flame,
    Timer,
    Factory,
    Loader2,
    AlertCircle,
    Crosshair,
    ArrowLeft
} from 'lucide-react';
import Header from '@/components/Landing/Header';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// --- Inner Map Component ---
// This component uses Leaflet hooks and MUST be rendered only on the client.
const MapInner = ({ selectedLocation, onMapClick }) => {
    // We import these inside the client-only component to avoid SSR issues with hooks
    const { MapContainer, TileLayer, Marker, Popup, useMapEvents } = require('react-leaflet');
    const L = require('leaflet');

    // Fix Leaflet marker icon issue in Next.js
    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, [L]);

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                onMapClick(e.latlng);
            },
        });
        return null;
    };

    return (
        <MapContainer
            center={[selectedLocation.lat, selectedLocation.lon]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler />

            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                <Popup>
                    <div className="p-2 text-center">
                        <h4 className="font-bold text-sm tracking-tight">{selectedLocation.name}</h4>
                        <p className="text-[10px] text-slate-500">Active Monitoring Station</p>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

// Dynamically import the Inner Map with SSR disabled
const DynamicMap = dynamic(() => Promise.resolve(MapInner), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center flex-col gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-slate-400 font-medium">Initializing Global Map...</span>
        </div>
    )
});

const PollutionMapPage = () => {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;

    const [selectedLocation, setSelectedLocation] = useState({
        name: "New Delhi",
        lat: 28.6139,
        lon: 77.2090
    });

    const [liveMetrics, setLiveMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRealTimeAQI = async (query) => {
        setLoading(true);
        setError(null);
        try {
            if (!API_KEY || API_KEY === 'your_weatherapi_key_here') {
                throw new Error("WeatherAPI Key is missing. Please add it to your .env file.");
            }

            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=yes`
            );

            if (!response.ok) {
                throw new Error("Location not found or API error.");
            }

            const data = await response.json();
            const aqi = data.current.air_quality;

            setSelectedLocation({
                name: data.location.name + (data.location.region ? `, ${data.location.region}` : ""),
                lat: data.location.lat,
                lon: data.location.lon
            });

            setLiveMetrics({
                aqi: aqi['us-epa-index'],
                co: aqi.co.toFixed(1),
                no2: aqi.no2.toFixed(1),
                so2: aqi.so2.toFixed(1),
                o3: aqi.o3.toFixed(1),
                pm10: aqi.pm10.toFixed(1),
                pm25: aqi.pm2_5.toFixed(1),
                co2: 412
            });

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRealTimeAQI(`${selectedLocation.lat},${selectedLocation.lon}`);
    }, []);

    const handleMapClick = (latlng) => {
        fetchRealTimeAQI(`${latlng.lat},${latlng.lng}`);
    };

    const getEpaStatus = (index) => {
        const statuses = {
            1: "Good",
            2: "Moderate",
            3: "Unhealthy (Sensitives)",
            4: "Unhealthy",
            5: "Very Unhealthy",
            6: "Hazardous"
        };
        return statuses[index] || "Unknown";
    };

    const MetricCard = ({ icon: Icon, label, value, unit, colorClass, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between h-full group transition-all hover:shadow-md"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colorClass.split(' ')[1]} ${colorClass.split(' ')[0]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
                    {loading ? "..." : "Live"}
                </div>
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
                <div className="flex items-baseline gap-1">
                    {loading ? (
                        <div className="h-9 w-20 bg-slate-200 animate-pulse rounded-lg" />
                    ) : (
                        <span className="text-3xl font-extrabold text-slate-900">{value}</span>
                    )}
                    <span className="text-slate-400 text-sm font-bold uppercase">{unit}</span>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((value / (unit === 'ppm' ? 5 : 400)) * 100, 100)}%` }}
                        className={`h-full ${colorClass.split(' ')[0].replace('text-', 'bg-')}`}
                    />
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-white text-slate-900">

            <Link href="/dashboard">
                <span className="outline rounded ml-30 pt-30">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard
                    </Button>
                </span>
            </Link>
            <main className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                        Atmospheric Monitoring Hub
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                        <span className="text-emerald-700 font-bold">Interact with the map</span> to explore real-time air quality metrics powered by WeatherAPI.
                    </p>
                </motion.div>

                {/* Map Section */}
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Legend Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6 h-full">
                            <h3 className="font-bold text-xl flex items-center gap-2 text-slate-800">
                                <Info className="w-5 h-5 text-emerald-600" />
                                EPA AQI Scale
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { label: "Critical", range: "5-6", color: "bg-red-500", shadow: "shadow-red-200" },
                                    { label: "Poor", range: "4", color: "bg-orange-500", shadow: "shadow-orange-200" },
                                    { label: "Moderate", range: "2-3", color: "bg-yellow-400", shadow: "shadow-yellow-200" },
                                    { label: "Good", range: "1", color: "bg-green-500", shadow: "shadow-green-200" }
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-3 group translate-x-0 hover:translate-x-1 transition-transform">
                                        <div className={`w-3.5 h-3.5 rounded-full ${item.color} shadow-lg ${item.shadow}`} />
                                        <p className="text-sm font-bold text-slate-600">{item.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-emerald-50">
                                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                    <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                                        <MapPin className="w-3 h-3" />
                                        Pinned Location
                                    </div>
                                    <p className="text-base font-extrabold text-slate-900 leading-tight">{selectedLocation.name}</p>
                                    <div className="mt-2 text-[10px] text-slate-400 font-mono tracking-tighter">
                                        {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                                    </div>
                                    <div className="mt-4">
                                        {loading ? (
                                            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-white/50 px-3 py-1.5 rounded-xl border border-emerald-50">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Analyzing...
                                            </div>
                                        ) : (
                                            <div className="px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 inline-flex items-center gap-2 shadow-sm">
                                                <div className={`w-2 h-2 rounded-full ${liveMetrics?.aqi >= 4 ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                                                AQI: {liveMetrics ? getEpaStatus(liveMetrics.aqi) : "Unknown"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-[11px] flex items-start gap-2"
                                >
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="font-semibold">{error}</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Map Viewer */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-3 h-[550px] bg-white rounded-[40px] overflow-hidden border-[8px] border-white shadow-2xl relative z-10"
                    >
                        <DynamicMap
                            selectedLocation={selectedLocation}
                            onMapClick={handleMapClick}
                        />
                    </motion.div>
                </div>

                {/* Dashboard Metrics */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-emerald-500 rounded-full" />
                            <h3 className="text-2xl font-bold text-slate-800">Real-Time Data: <span className="text-emerald-600 font-extrabold">{selectedLocation.name}</span></h3>
                        </div>
                        {!loading && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Source: World Pollution Index</div>}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedLocation.name + (liveMetrics ? "loaded" : "loading")}
                            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            <MetricCard
                                icon={Activity}
                                label="EPA Index"
                                value={liveMetrics?.aqi || 1}
                                unit="Scale"
                                colorClass={liveMetrics?.aqi >= 4 ? "text-red-600 bg-red-50 border-red-100" : "text-green-600 bg-green-50 border-green-100"}
                                delay={0.1}
                            />
                            <MetricCard
                                icon={Leaf}
                                label="Carbon Alert (CO2)"
                                value={liveMetrics?.co2 || 412}
                                unit="ppm"
                                colorClass="text-emerald-600 bg-emerald-50 border-emerald-100"
                                delay={0.2}
                            />
                            <MetricCard
                                icon={Flame}
                                label="Nitrogen Dioxide"
                                value={liveMetrics?.no2 || 0}
                                unit="μg/m³"
                                colorClass="text-orange-600 bg-orange-50 border-orange-100"
                                delay={0.3}
                            />
                            <MetricCard
                                icon={CloudRain}
                                label="Sulfur Dioxide"
                                value={liveMetrics?.so2 || 0}
                                unit="μg/m³"
                                colorClass="text-sky-600 bg-sky-50 border-sky-100"
                                delay={0.4}
                            />
                            <MetricCard
                                icon={Timer}
                                label="Carbon Monoxide"
                                value={liveMetrics?.co || 0}
                                unit="μg/m³"
                                colorClass="text-amber-600 bg-amber-50 border-amber-100"
                                delay={0.5}
                            />
                            <MetricCard
                                icon={Factory}
                                label="PM10 (Dust)"
                                value={liveMetrics?.pm10 || 0}
                                unit="μg/m³"
                                colorClass="text-rose-600 bg-rose-50 border-rose-100"
                                delay={0.6}
                            />
                            <MetricCard
                                icon={Wind}
                                label="PM2.5 (Particles)"
                                value={liveMetrics?.pm25 || 0}
                                unit="μg/m³"
                                colorClass="text-red-600 bg-red-50 border-red-100"
                                delay={0.7}
                            />

                            <div className="bg-gradient-to-br from-emerald-600 to-sky-600 p-8 rounded-[32px] shadow-xl flex flex-col justify-between text-white relative overflow-hidden group border-4 border-white">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125" />
                                <div className="p-3 bg-white/20 rounded-2xl w-fit relative z-10 shadow-inner">
                                    <Droplet className="w-6 h-6" />
                                </div>
                                <div className="relative z-10 mt-8">
                                    <h4 className="font-bold text-xl leading-tight mb-3">Live Insights</h4>
                                    <p className="text-emerald-50/80 text-xs leading-relaxed font-medium">
                                        {liveMetrics?.aqi <= 2
                                            ? "Healthy environmental conditions. Clear air detected for this region."
                                            : "Warning: High particulate matter. Protective measures recommended."
                                        }
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default PollutionMapPage;