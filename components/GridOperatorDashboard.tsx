'use client';

import React from 'react';
import { GridTransformerNode, EVStation } from '../types/ev';
import { Cpu, Zap, Sliders, ToggleLeft, ToggleRight, Activity, Thermometer, Sun } from 'lucide-react';

interface GridOperatorDashboardProps {
  transformers: GridTransformerNode[];
  stations: EVStation[];
  tariffMultiplier: number;
  onTariffMultiplierChange: (val: number) => void;
  loadShavingActive: boolean;
  onToggleLoadShaving: () => void;
  v2gActive: boolean;
  onToggleV2G: () => void;
  onThrottleTransformer: (id: string) => void;
}

export const GridOperatorDashboard: React.FC<GridOperatorDashboardProps> = ({
  transformers,
  stations,
  tariffMultiplier,
  onTariffMultiplierChange,
  loadShavingActive,
  onToggleLoadShaving,
  v2gActive,
  onToggleV2G,
  onThrottleTransformer
}) => {
  const totalCap = transformers.reduce((acc, t) => acc + t.capacityKw, 0);
  const totalLoad = transformers.reduce((acc, t) => acc + t.currentLoadKw, 0);
  const overallStress = Math.round((totalLoad / totalCap) * 100);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
              <Cpu className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-black text-black">Power Grid Operator Command Center</h2>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Real-time transformer monitoring, peak shaving dispatch, and dynamic pricing rules.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 shadow-sm">
          <Activity className="h-5 w-5 text-black" />
          <div>
            <p className="text-[10px] text-neutral-500 uppercase font-black tracking-wider">Total Grid Stress</p>
            <p className="text-lg font-black text-black font-mono">{overallStress}% ({totalLoad} / {totalCap} kW)</p>
          </div>
        </div>
      </div>

      {/* Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Dynamic Tariff */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-4 w-4" /> Tariff Multiplier
            </span>
            <span className="text-sm font-black font-mono text-white bg-black px-2.5 py-1 rounded-lg">
              {tariffMultiplier.toFixed(1)}x
            </span>
          </div>

          <p className="text-xs text-neutral-600">
            Adjust surge multiplier to disincentivize charging during peak grid hours.
          </p>

          <input
            type="range"
            min="0.6"
            max="2.0"
            step="0.1"
            value={tariffMultiplier}
            onChange={(e) => onTariffMultiplierChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
        </div>

        {/* Load Shedding */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4 w-4" /> Automated Load Shedding
            </span>
            <button onClick={onToggleLoadShaving}>
              {loadShavingActive ? (
                <ToggleRight className="h-8 w-8 text-black" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-neutral-400" />
              )}
            </button>
          </div>

          <p className="text-xs text-neutral-600">
            Caps charger output to 80kW when local substation load exceeds 85%.
          </p>
        </div>

        {/* V2G Rewards */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4" /> Vehicle-to-Grid (V2G)
            </span>
            <button onClick={onToggleV2G}>
              {v2gActive ? (
                <ToggleRight className="h-8 w-8 text-black" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-neutral-400" />
              )}
            </button>
          </div>

          <p className="text-xs text-neutral-600">
            Discharges energy back into grid for $0.65/kWh credit during grid peaks.
          </p>
        </div>
      </div>

      {/* Transformer Status Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-black uppercase tracking-wider text-black flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          Substation Transformer Nodes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {transformers.map(t => {
            const loadPercent = Math.round((t.currentLoadKw / t.capacityKw) * 100);

            return (
              <div
                key={t.id}
                className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black font-mono text-white bg-black px-2 py-0.5 rounded">
                      {t.id}
                    </span>
                    <h4 className="text-sm font-black text-black mt-2">{t.name}</h4>
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase border border-neutral-300 bg-neutral-100 text-black">
                    {t.status}
                  </span>
                </div>

                <div className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Load:</span>
                    <span className="font-bold text-black">{t.currentLoadKw} / {t.capacityKw} kW ({loadPercent}%)</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
                    <div
                      className="bg-black h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, loadPercent)}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => onThrottleTransformer(t.id)}
                  className="w-full rounded-xl bg-black text-white hover:bg-neutral-800 py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                >
                  Balance Transformer Load
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
