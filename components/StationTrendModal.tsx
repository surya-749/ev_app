'use client';

import React from 'react';
import { EVStation } from '../types/ev';
import { predictStationOccupancyTrend } from '../lib/optimizationEngine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { TrendingUp, Clock, AlertTriangle, CheckCircle2, Zap, X, ArrowRight, Activity, Sparkles, MapPin } from 'lucide-react';

interface StationTrendModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: EVStation | null;
  onBookStation: (station: EVStation) => void;
}

export const StationTrendModal: React.FC<StationTrendModalProps> = ({
  isOpen,
  onClose,
  station,
  onBookStation
}) => {
  if (!isOpen || !station) return null;

  const trendData = predictStationOccupancyTrend(station);
  const activePorts = station.totalPorts - station.availablePorts;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-neutral-200 p-6 shadow-2xl space-y-6 overflow-hidden text-neutral-900 max-h-[90vh] overflow-y-auto z-[101]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:bg-neutral-100 p-2 rounded-full border border-neutral-300"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-black text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="h-3 w-3" /> Predictive Station Analytics
            </span>
            <span className="bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-black font-mono">
              {station.category}
            </span>
          </div>
          <h3 className="text-2xl font-black text-black leading-tight pt-1">{station.name}</h3>
          <p className="text-xs text-neutral-600 flex items-center gap-1 font-sans">
            <MapPin className="h-3.5 w-3.5 text-black" /> {station.address} ({station.distanceKm} km)
          </p>
        </div>

        {/* Current Occupancy & Trend Prediction Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Current Occupancy</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-black">{trendData.currentOccupancyPercent}%</span>
              <span className="text-xs font-mono font-bold text-neutral-500">({activePorts}/{station.totalPorts} Ports)</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden mt-1">
              <div 
                className="bg-black h-full rounded-full" 
                style={{ width: `${trendData.currentOccupancyPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Predicted Peak Hour</p>
            <p className="text-xl font-black text-black font-mono">{trendData.expectedPeakHourLabel}</p>
            <p className="text-[11px] font-bold text-neutral-600">{trendData.expectedPeakPercent}% Peak Occupancy</p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Best Charging Window</p>
            <p className="text-xl font-black text-black font-mono">{trendData.recommendedBestSlotLabel}</p>
            <p className="text-[11px] font-bold text-black flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Only {trendData.recommendedBestSlotPercent}% Occupancy
            </p>
          </div>
        </div>

        {/* 24-Hour Occupancy & Queue Trend Recharts Chart */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-black" />
              <h4 className="text-xs font-black uppercase tracking-wider text-black">24-Hour Occupancy & Queue Wait Trend</h4>
            </div>
            <span className="text-[10px] font-mono font-bold text-neutral-500">Updated Real-Time</span>
          </div>

          <div className="h-[220px] w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData.hourlyTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="timeLabel" stroke="#171717" fontSize={9} fontWeight={600} interval={3} />
                <YAxis stroke="#171717" fontSize={9} fontWeight={600} unit="%" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderRadius: '12px', color: '#000', fontSize: '11px', fontWeight: 'bold' }}
                  formatter={(value: any, name: any) => [
                    name === 'occupancyPercent' ? `${value}% Occupied` : `${value} mins wait`,
                    name === 'occupancyPercent' ? 'Expected Occupancy' : 'Predicted Wait Time'
                  ]}
                />
                <ReferenceLine y={80} stroke="#000" strokeDasharray="3 3" label={{ value: 'High Congestion (80%)', fill: '#000', fontSize: 9, fontWeight: 'bold' }} />
                <Bar dataKey="occupancyPercent" name="Expected Occupancy %" fill="#000000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs font-mono">
            <span className="text-neutral-500">Current Tariff: </span>
            <span className="font-black text-black">₹{station.currentTariff}/kWh</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookStation(station);
            }}
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md transition-all"
          >
            Reserve Slot at this Hub
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
