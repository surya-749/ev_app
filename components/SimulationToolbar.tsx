'use client';

import React from 'react';
import { Zap, Sun, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';

interface SimulationToolbarProps {
  activeScenario: string;
  onSelectScenario: (scenario: 'normal' | 'peak_rush' | 'solar_drop' | 'grid_emergency' | 'fleet_surge') => void;
  onReset: () => void;
}

export const SimulationToolbar: React.FC<SimulationToolbarProps> = ({
  activeScenario,
  onSelectScenario,
  onReset
}) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl rounded-2xl border-2 border-black bg-white/95 p-3 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
        
        <div className="flex items-center gap-2 text-black font-black uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-black" />
          <span>Simulation Sandbox:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          <button
            onClick={() => onSelectScenario('normal')}
            className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
              activeScenario === 'normal'
                ? 'bg-black text-white shadow-sm'
                : 'bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            Baseline Normal
          </button>

          <button
            onClick={() => onSelectScenario('peak_rush')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
              activeScenario === 'peak_rush'
                ? 'bg-black text-white shadow-sm'
                : 'bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            6 PM Peak Surge
          </button>

          <button
            onClick={() => onSelectScenario('solar_drop')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
              activeScenario === 'solar_drop'
                ? 'bg-black text-white shadow-sm'
                : 'bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            Solar Peak (1 PM)
          </button>

          <button
            onClick={() => onSelectScenario('grid_emergency')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
              activeScenario === 'grid_emergency'
                ? 'bg-black text-white shadow-sm'
                : 'bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Transformer Stress
          </button>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-black font-bold bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl border border-neutral-300 transition-all"
          title="Reset Simulation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
