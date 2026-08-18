'use client';

import React from 'react';
import { Zap, Activity, Sliders, Cpu, Calendar, Search } from 'lucide-react';
import { calculateOverallGridStress } from '../lib/optimizationEngine';
import { GridTransformerNode } from '../types/ev';

interface NavbarProps {
  activeTab: 'driver' | 'forecaster' | 'operator' | 'map';
  setActiveTab: (tab: 'driver' | 'forecaster' | 'operator' | 'map') => void;
  transformers: GridTransformerNode[];
  activeReservationsCount: number;
  onOpenReservations: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  simulatedHour: number;
  activeScenario: string;
  onResetSimulation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  transformers,
  activeReservationsCount,
  onOpenReservations,
  searchQuery,
  setSearchQuery,
  simulatedHour,
  activeScenario,
  onResetSimulation
}) => {
  const gridStats = calculateOverallGridStress(transformers);

  const formatHourLabel = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12.toString().padStart(2, '0')}:00 ${ampm}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand / Logo (Campus Flow inspiration) */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white font-extrabold text-sm tracking-tighter">
            CG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-black font-sans">
                Charge<span className="text-neutral-500 font-normal">Grid</span>
              </span>
              <span className="rounded-full bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">
                #86 B&W AI
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl bg-neutral-100 p-1 border border-neutral-200">
          <button
            onClick={() => setActiveTab('driver')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'driver'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            Smart Finder
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'map'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Geospatial Map
          </button>

          <button
            onClick={() => setActiveTab('forecaster')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'forecaster'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Demand Forecaster
          </button>

          <button
            onClick={() => setActiveTab('operator')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'operator'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-200/60'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            Grid Command
          </button>
        </nav>

        {/* Right Status Badge & Reservation Pass Drawer */}
        <div className="flex items-center gap-3">
          
          {/* Grid Status Pill */}
          <div className="hidden lg:flex items-center gap-3 rounded-xl bg-white border border-neutral-200 px-3.5 py-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-black"></span>
              <span className="text-xs font-bold font-mono text-black">{formatHourLabel(simulatedHour)}</span>
            </div>

            <div className="h-3 w-[1px] bg-neutral-300"></div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-neutral-500">Grid Stress:</span>
              <span className="font-bold text-black underline">
                {gridStats.stressPercentage}%
              </span>
            </div>
          </div>

          {/* Bookings / Passes Button */}
          <button
            onClick={onOpenReservations}
            className="relative flex items-center gap-2 rounded-xl bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold transition-all shadow-sm"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">My Passes</span>
            {activeReservationsCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-black px-1">
                {activeReservationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden overflow-x-auto border-t border-neutral-200 bg-white px-2 py-2 gap-2">
        <button
          onClick={() => setActiveTab('driver')}
          className={`flex-1 min-w-[100px] rounded-lg px-2.5 py-1.5 text-center text-xs font-bold ${
            activeTab === 'driver' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          Finder
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 min-w-[100px] rounded-lg px-2.5 py-1.5 text-center text-xs font-bold ${
            activeTab === 'map' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setActiveTab('forecaster')}
          className={`flex-1 min-w-[100px] rounded-lg px-2.5 py-1.5 text-center text-xs font-bold ${
            activeTab === 'forecaster' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          Forecaster
        </button>
        <button
          onClick={() => setActiveTab('operator')}
          className={`flex-1 min-w-[100px] rounded-lg px-2.5 py-1.5 text-center text-xs font-bold ${
            activeTab === 'operator' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          Grid Command
        </button>
      </div>
    </header>
  );
};
