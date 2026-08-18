'use client';

import React, { useState, useMemo } from 'react';
import { EVVehicle, EVStation, Recommendation } from '../types/ev';
import { INITIAL_VEHICLES } from '../lib/mockData';
import { getSmartStationRecommendations, calculateEnergyNeeded } from '../lib/optimizationEngine';
import { Zap, Sparkles, BatteryCharging, Clock, DollarSign, ArrowRight, CheckCircle2, Car, Activity, MapPin, Cpu, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

interface SmartRecommenderProps {
  stations: EVStation[];
  onBookRecommendation: (rec: Recommendation, vehicle: EVVehicle, currentSoC: number, targetSoC: number) => void;
  simulatedHour: number;
}

export const SmartRecommender: React.FC<SmartRecommenderProps> = ({
  stations,
  onBookRecommendation,
  simulatedHour
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<EVVehicle>(INITIAL_VEHICLES[0]);
  const [currentSoC, setCurrentSoC] = useState<number>(20);
  const [targetSoC, setTargetSoC] = useState<number>(85);
  const [preferredTime, setPreferredTime] = useState<number>(simulatedHour);

  // Compute recommendations dynamically
  const recommendations = useMemo(() => {
    return getSmartStationRecommendations(
      selectedVehicle,
      currentSoC,
      targetSoC,
      preferredTime,
      stations
    );
  }, [selectedVehicle, currentSoC, targetSoC, preferredTime, stations]);

  const energyNeeded = calculateEnergyNeeded(currentSoC, targetSoC, selectedVehicle.batteryCapacityKwh);

  const scrollToPlanner = () => {
    const el = document.getElementById('smart-planner-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12">
      
      {/* Hero Section (Matching Campus Flow Landing Page) */}
      <div className="py-10 space-y-6 text-left max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-[11px] font-bold text-black uppercase tracking-widest shadow-xs">
          <Zap className="h-3.5 w-3.5 fill-black text-black" />
          BUILT FOR SMART EV INFRASTRUCTURE
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-black tracking-tight leading-[1.05]">
          Everything you need for EV charging, in one place
        </h1>

        <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl leading-relaxed font-normal">
          Demand forecasting, AI slot recommendations, real geospatial maps, and grid load balancing — all under one roof.
        </p>

        {/* Action Buttons (Campus Flow Style) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={scrollToPlanner}
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md transition-all"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
          
          <button
            onClick={scrollToPlanner}
            className="rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-xs font-bold text-black hover:border-black hover:bg-neutral-50 transition-all shadow-xs"
          >
            Explore AI Planner
          </button>
        </div>
      </div>

      {/* Feature Highlight Cards (Identical to Campus Flow "Features" Section) */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-black tracking-tight">Features</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">WHAT YOU GET WITH CHARGEGRID</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-black hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-black">Demand Forecaster</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Machine learning time-series load predictions for peak grid capacity and dynamic Time-of-Use tariffs.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-black hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-black">AI Slot Recommender</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Matches EV model battery specs with off-peak solar windows to eliminate waiting lines and save 35% on tariffs.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-black hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-black">Real Geospatial Map</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Live OpenStreetMap telemetry featuring charger port output, substation transmission polylines, and real-time status.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-black hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-black">Grid Operator Control</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Automated peak load shaving, transformer load monitors, and Vehicle-to-Grid (V2G) discharge rewards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive AI Finder Form */}
      <div id="smart-planner-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Form Box */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-4">
            <div className="h-8 w-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black">
              <Car className="h-4 w-4" />
            </div>
            <h3 className="text-base font-extrabold text-black">Your Vehicle & Charging Plan</h3>
          </div>

          {/* Vehicle Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-black">Select EV Model:</label>
            <div className="space-y-2">
              {INITIAL_VEHICLES.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`w-full flex items-center justify-between rounded-xl p-3 border text-xs transition-all ${
                    selectedVehicle.id === v.id
                      ? 'bg-black text-white border-black font-bold shadow-xs'
                      : 'bg-white border-neutral-200 text-black hover:border-black'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{v.icon}</span>
                    <div className="text-left">
                      <p className="font-extrabold">{v.brand} {v.model}</p>
                      <p className={`text-[10px] ${selectedVehicle.id === v.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {v.batteryCapacityKwh} kWh • Max {v.maxChargingPowerKw}kW
                      </p>
                    </div>
                  </div>
                  {selectedVehicle.id === v.id && (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Battery SoC Sliders */}
          <div className="space-y-4 bg-neutral-50 border border-neutral-200 rounded-xl p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-neutral-600 flex items-center gap-1">
                  <BatteryCharging className="h-3.5 w-3.5 text-black" /> Current SoC %
                </span>
                <span className="font-mono text-black">{currentSoC}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="75"
                value={currentSoC}
                onChange={(e) => setCurrentSoC(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-neutral-600 flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-black" /> Target SoC %
                </span>
                <span className="font-mono text-black">{targetSoC}%</span>
              </div>
              <input
                type="range"
                min={currentSoC + 10}
                max="100"
                value={targetSoC}
                onChange={(e) => setTargetSoC(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold">
              <span className="text-neutral-600">Energy Needed:</span>
              <span className="font-mono text-black">{energyNeeded} kWh</span>
            </div>
          </div>

          {/* Preferred Hour */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-black flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> Preferred Charging Hour:
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(parseInt(e.target.value))}
              className="w-full bg-white border border-neutral-300 text-black font-bold rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-black font-mono"
            >
              {Array.from({ length: 24 }).map((_, h) => {
                const ampm = h >= 12 ? 'PM' : 'AM';
                const hour12 = h % 12 === 0 ? 12 : h % 12;
                const label = `${hour12.toString().padStart(2, '0')}:00 ${ampm}`;
                return (
                  <option key={h} value={h}>
                    {label} {h >= 11 && h <= 14 ? '— ☀️ Solar Peak (Lowest Rate)' : h >= 17 && h <= 20 ? '— ⚡ Grid Surge' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Right Recommendation List */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="text-lg font-black text-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-black" />
              AI Recommended Station & Time Slots
            </h3>
            <span className="text-xs font-bold text-neutral-500 font-mono">Ranked by Lowest Grid Load</span>
          </div>

          <div className="space-y-5">
            {recommendations.slice(0, 3).map((rec, index) => {
              const isBest = index === 0;

              return (
                <div
                  key={rec.station.id}
                  className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
                    isBest
                      ? 'bg-white border-2 border-black shadow-md'
                      : 'bg-white border border-neutral-200 hover:border-black shadow-xs'
                  }`}
                >
                  {isBest && (
                    <div className="absolute top-0 right-0 rounded-bl-xl bg-black px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">
                      RECOMMENDED • SAVE {rec.savingsPercent}%
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-neutral-100 border border-neutral-300 px-3 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">
                          {rec.station.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-neutral-500">
                          📍 {rec.station.distanceKm} km away
                        </span>
                      </div>

                      <h4 className="text-xl font-black text-black leading-tight">{rec.station.name}</h4>
                      <p className="text-xs font-bold text-neutral-700">{rec.matchReason}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs pt-1 font-mono">
                        <span className="bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-lg text-black font-bold">
                          ⚡ {rec.recommendedPort.type.replace('_', ' ')} ({rec.recommendedPort.maxPowerKw}kW)
                        </span>
                        <span className="bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-lg text-black font-bold">
                          ☀️ {rec.station.renewablePercent}% Clean
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-start md:items-end gap-4 bg-neutral-50 border border-neutral-200 rounded-xl p-4 min-w-[210px]">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Estimated Cost:</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-black font-mono">${rec.estimatedCost}</span>
                          <span className="text-xs text-neutral-400 line-through font-mono">${rec.standardCost}</span>
                        </div>
                      </div>

                      <div className="space-y-0.5 md:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Slot Duration:</p>
                        <p className="text-sm font-extrabold text-black font-mono">{rec.estimatedDurationMins} mins ({rec.recommendedSlotTime})</p>
                      </div>

                      <button
                        onClick={() => onBookRecommendation(rec, selectedVehicle, currentSoC, targetSoC)}
                        className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-5 text-xs font-black uppercase tracking-wider transition-all ${
                          isBest
                            ? 'bg-black text-white hover:bg-neutral-800 shadow-sm'
                            : 'bg-white text-black border-2 border-black hover:bg-neutral-100'
                        }`}
                      >
                        Reserve Slot
                        <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
