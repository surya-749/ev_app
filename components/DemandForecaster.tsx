'use client';

import React, { useState } from 'react';
import { DemandDataPoint, GridTransformerNode } from '../types/ev';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Activity, Zap, TrendingDown, Sun, ShieldAlert, Sparkles, Clock } from 'lucide-react';

interface DemandForecasterProps {
  forecastData: DemandDataPoint[];
  transformers: GridTransformerNode[];
  simulatedHour: number;
  onHourChange: (hour: number) => void;
  loadShavingActive: boolean;
  onToggleLoadShaving: () => void;
}

export const DemandForecaster: React.FC<DemandForecasterProps> = ({
  forecastData,
  transformers,
  simulatedHour,
  onHourChange,
  loadShavingActive,
  onToggleLoadShaving
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'load' | 'pricing' | 'renewables'>('load');

  const peakBaselineKw = Math.max(...forecastData.map(d => d.baselineDemandKw));
  const peakOptimizedKw = Math.max(...forecastData.map(d => d.optimizedDemandKw));
  const peakShavingPercent = Math.round(((peakBaselineKw - peakOptimizedKw) / peakBaselineKw) * 100);

  const currentPoint = forecastData.find(d => d.hour === simulatedHour) || forecastData[17];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
              <Activity className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-black text-black">24-Hour India Demand Forecasting & Load Shaving</h2>
          </div>
          <p className="text-xs text-neutral-600 mt-1">
            Predictive machine learning analytics comparing baseline uncoordinated load vs AI load-balanced dispatch across Indian cities.
          </p>
        </div>

        <button
          onClick={onToggleLoadShaving}
          className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider transition-all ${
            loadShavingActive
              ? 'bg-black text-white shadow-md'
              : 'bg-white text-black border-2 border-black hover:bg-neutral-100'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          AI Peak Shaving: {loadShavingActive ? 'ACTIVE' : 'DISABLED'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Peak Demand Shaving</p>
          <p className="text-3xl font-black text-black font-mono">
            {loadShavingActive ? `-${peakShavingPercent}%` : '0%'}
          </p>
          <p className="text-xs font-bold text-neutral-600">Smoothes evening spikes</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Solar Generation</p>
          <p className="text-3xl font-black text-black font-mono">
            {currentPoint.solarWindGenerationKw} <span className="text-xs text-neutral-500 font-normal">kW</span>
          </p>
          <p className="text-xs font-bold text-neutral-600">Midday Clean Power Surplus</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Grid Tariff Rate</p>
          <p className="text-3xl font-black text-black font-mono">
            ₹{currentPoint.tariffRate} <span className="text-xs text-neutral-500 font-normal">/kWh</span>
          </p>
          <p className="text-xs font-bold text-neutral-600">{currentPoint.timeLabel} Dynamic Rate</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-2 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Grid Congestion Risk</p>
          <p className="text-2xl font-black text-black uppercase font-mono">
            {currentPoint.congestionRisk}
          </p>
          <p className="text-xs font-bold text-neutral-600">Simulated Hour: {currentPoint.timeLabel}</p>
        </div>
      </div>

      {/* Main Grayscale Chart */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm">
        
        {/* Chart View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChartTab('load')}
              className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                activeChartTab === 'load'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-black border border-neutral-300'
              }`}
            >
              Power Grid Load (kW)
            </button>
            <button
              onClick={() => setActiveChartTab('pricing')}
              className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                activeChartTab === 'pricing'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-black border border-neutral-300'
              }`}
            >
              Dynamic Pricing Curve (₹/kWh)
            </button>
          </div>

          <div className="text-xs font-mono font-bold text-black flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-neutral-400"></span> Uncoordinated Peak</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-black"></span> AI Load-Balanced</span>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-[380px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'load' ? (
              <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#737373" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#737373" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="timeLabel" stroke="#171717" fontSize={11} fontWeight={600} />
                <YAxis stroke="#171717" fontSize={11} fontWeight={600} unit=" kW" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: '12px', color: '#000', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }} />
                
                <ReferenceLine y={6000} label={{ value: 'Grid Threshold (6000 kW)', fill: '#000', fontSize: 11, fontWeight: 'bold' }} stroke="#000" strokeDasharray="4 4" />
                
                <Area type="monotone" dataKey="baselineDemandKw" name="Baseline Peak Load" stroke="#737373" fillOpacity={1} fill="url(#colorBaseline)" strokeWidth={2} strokeDasharray="4 4" />
                {loadShavingActive && (
                  <Area type="monotone" dataKey="optimizedDemandKw" name="AI Load-Balanced Demand" stroke="#000000" fillOpacity={1} fill="url(#colorOptimized)" strokeWidth={3} />
                )}
              </AreaChart>
            ) : (
              <LineChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="timeLabel" stroke="#171717" fontSize={11} fontWeight={600} />
                <YAxis stroke="#171717" fontSize={11} fontWeight={600} unit=" ₹" domain={[0, 30]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: '12px', color: '#000', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="tariffRate" name="Dynamic Tariff (₹/kWh)" stroke="#000000" strokeWidth={3} dot={{ r: 4, fill: '#000000' }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hour Slider */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-black" />
            <span className="text-sm font-extrabold text-black">Simulate Hour of Day:</span>
            <span className="text-xs font-mono font-bold text-white bg-black px-3 py-1 rounded-lg">
              {currentPoint.timeLabel}
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="23"
          value={simulatedHour}
          onChange={(e) => onHourChange(parseInt(e.target.value))}
          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
      </div>
    </div>
  );
};
