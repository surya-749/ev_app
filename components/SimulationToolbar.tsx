'use client';

import React, { useState } from 'react';
import { Zap, Sun, AlertTriangle, RotateCcw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 left-6 z-30">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-black uppercase text-black shadow-md hover:bg-neutral-50 transition-all font-mono"
        >
          <Sparkles className="h-4 w-4" />
          Simulation Sandbox
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-3xl rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
        
        <div className="flex items-center gap-2 text-neutral-900 font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-black" />
          <span>Sandbox Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          <button
            onClick={() => onSelectScenario('normal')}
            className={`rounded-xl px-3 py-1.5 font-bold transition-all ${
              activeScenario === 'normal'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            Baseline
          </button>

          <button
            onClick={() => onSelectScenario('peak_rush')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
              activeScenario === 'peak_rush'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            6 PM Surge
          </button>

          <button
            onClick={() => onSelectScenario('solar_drop')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
              activeScenario === 'solar_drop'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            Solar Max
          </button>

          <button
            onClick={() => onSelectScenario('grid_emergency')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all ${
              activeScenario === 'grid_emergency'
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-black border border-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Grid Overload
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-black font-bold bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl border border-neutral-300 transition-all"
            title="Reset Simulation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            className="text-neutral-500 hover:text-black p-1 rounded-lg hover:bg-neutral-100"
            title="Minimize"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
