'use client';

import React, { useState } from 'react';
import { EVStation, ChargerType, GridStressLevel } from '../types/ev';
import { Zap, MapPin, Filter, Info, Sun, Clock, DollarSign, ArrowRight, Sparkles } from 'lucide-react';

interface StationMapProps {
  stations: EVStation[];
  onSelectStation: (station: EVStation) => void;
  onBookStation: (station: EVStation) => void;
  selectedStationId?: string;
}

export const StationMap: React.FC<StationMapProps> = ({
  stations,
  onSelectStation,
  onBookStation,
  selectedStationId
}) => {
  const [filterConnector, setFilterConnector] = useState<ChargerType | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<EVStation | null>(
    stations.find(s => s.id === selectedStationId) || stations[0]
  );
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  const filteredStations = stations.filter(st => {
    if (filterConnector !== 'ALL') {
      const hasConnector = st.ports.some(p => p.type === filterConnector);
      if (!hasConnector) return false;
    }
    if (filterCategory !== 'ALL' && st.category !== filterCategory) {
      return false;
    }
    return true;
  });

  const getPinStyle = (stress: GridStressLevel, portsAvail: number) => {
    if (portsAvail === 0) return { bg: 'bg-neutral-400', text: 'text-white', border: 'border-neutral-500', label: 'FULL' };
    if (stress === 'critical') return { bg: 'bg-black', text: 'text-white', border: 'border-black', label: 'HIGH SURGE' };
    if (stress === 'low') return { bg: 'bg-white', text: 'text-black', border: 'border-black', label: 'OPTIMAL' };
    return { bg: 'bg-neutral-900', text: 'text-white', border: 'border-black', label: 'MODERATE' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 sm:p-8 max-w-7xl mx-auto">
      
      {/* Map Column */}
      <div className="lg:col-span-8 space-y-5">
        
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
            <Filter className="h-4 w-4" />
            <span>Geospatial Map Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={filterConnector}
              onChange={(e) => setFilterConnector(e.target.value as any)}
              className="bg-white border border-neutral-300 text-black font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-black"
            >
              <option value="ALL">🔌 All Connectors</option>
              <option value="CCS2_DC">CCS2 (DC Fast)</option>
              <option value="Tesla_NACS">Tesla NACS</option>
              <option value="Type2_AC">Type-2 AC</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-neutral-300 text-black font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-black"
            >
              <option value="ALL">📍 All Station Types</option>
              <option value="Superhub">⚡ Superhubs</option>
              <option value="SolarMicrogrid">☀️ Solar Microgrid</option>
              <option value="FastCharge">🏎️ Fast Charge</option>
            </select>

            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                showHeatmap
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-black border border-neutral-300'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Grid Load Grid
            </button>
          </div>
        </div>

        {/* B&W Map Visualizer Canvas Container */}
        <div className="relative h-[500px] w-full rounded-2xl border-2 border-neutral-300 bg-white overflow-hidden bg-dot-pattern shadow-sm">
          
          {/* Grid Overhead High-Voltage Lines (SVG) */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-30">
            <line x1="20%" y1="25%" x2="45%" y2="60%" stroke="#000000" strokeWidth="2" strokeDasharray="6,6" />
            <line x1="45%" y1="60%" x2="75%" y2="35%" stroke="#000000" strokeWidth="2" strokeDasharray="6,6" />
            <line x1="75%" y1="35%" x2="82%" y2="78%" stroke="#000000" strokeWidth="2" strokeDasharray="6,6" />
            <line x1="45%" y1="60%" x2="25%" y2="80%" stroke="#000000" strokeWidth="2" strokeDasharray="6,6" />
          </svg>

          {/* Substation Nodes */}
          <div className="absolute top-5 left-5 flex items-center gap-2 bg-white border border-black rounded-xl px-3 py-1.5 text-xs font-bold font-mono text-black shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-black"></span>
            <span>Substation TX-101 (Downtown Core)</span>
          </div>

          <div className="absolute bottom-5 right-5 flex items-center gap-2 bg-white border border-black rounded-xl px-3 py-1.5 text-xs font-bold font-mono text-black shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-black"></span>
            <span>Substation TX-104 (Solar Microgrid)</span>
          </div>

          {/* Station Markers */}
          {filteredStations.map((st, idx) => {
            const pin = getPinStyle(st.gridStressLevel, st.availablePorts);
            const isSelected = selectedStation?.id === st.id;

            const positions = [
              { top: '35%', left: '28%' },
              { top: '65%', left: '72%' },
              { top: '42%', left: '52%' },
              { top: '22%', left: '80%' },
              { top: '78%', left: '22%' },
              { top: '18%', left: '48%' }
            ];

            const pos = positions[idx % positions.length];

            return (
              <div
                key={st.id}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => {
                  setSelectedStation(st);
                  onSelectStation(st);
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-200 ${
                  isSelected ? 'z-30 scale-125' : 'z-10 hover:scale-110'
                }`}
              >
                {/* Station Pin */}
                <div className={`relative flex items-center justify-center h-12 w-12 rounded-2xl border-2 ${pin.border} ${pin.bg} ${pin.text} shadow-md transition-all`}>
                  <Zap className="h-6 w-6 stroke-[2.5]" />

                  {/* Availability pill */}
                  <span className="absolute -bottom-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black text-white px-1 text-[10px] font-black border border-white">
                    {st.availablePorts}/{st.totalPorts}
                  </span>
                </div>

                {/* Hover Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-14 hidden group-hover:flex flex-col items-center pointer-events-none z-40 w-48">
                  <div className="bg-black text-white text-xs rounded-xl p-2.5 shadow-xl text-center space-y-1">
                    <p className="font-bold truncate">{st.name}</p>
                    <p className="text-[11px] font-mono text-neutral-300">${st.currentTariff}/kWh • {st.waitingTimeMins}m wait</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-5 left-5 bg-white/95 border border-neutral-300 rounded-xl p-3 text-xs space-y-1 font-mono shadow-sm">
            <p className="font-bold text-black mb-1">Status Legend:</p>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-black bg-white"></span>
              <span className="text-neutral-700">Optimal (Off-Peak / High Solar)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-black"></span>
              <span className="text-neutral-700">High Peak Surge / Stressed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Station Drawer */}
      <div className="lg:col-span-4">
        {selectedStation ? (
          <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-5 shadow-lg sticky top-20">
            <div>
              <span className="inline-block rounded-full bg-neutral-100 border border-neutral-300 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black mb-2">
                {selectedStation.category}
              </span>
              <h3 className="text-xl font-black text-black leading-tight">{selectedStation.name}</h3>
              <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-black" />
                {selectedStation.address} ({selectedStation.distanceKm} km)
              </p>
            </div>

            {/* Tariff & Wait Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Dynamic Tariff</p>
                <p className="text-lg font-black text-black mt-1 font-mono">
                  ${selectedStation.currentTariff} <span className="text-xs text-neutral-500 font-normal">/kWh</span>
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Est. Wait</p>
                <p className="text-lg font-black text-black mt-1">
                  {selectedStation.waitingTimeMins > 0 ? `${selectedStation.waitingTimeMins} mins` : 'Instant'}
                </p>
              </div>
            </div>

            {/* Clean Solar Mix Bar */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-black flex items-center gap-1">
                  <Sun className="h-3.5 w-3.5" /> Renewable Energy
                </span>
                <span className="font-mono">{selectedStation.renewablePercent}% Clean</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-black h-full rounded-full"
                  style={{ width: `${selectedStation.renewablePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Ports */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-black">Available Ports</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedStation.ports.map(port => (
                  <div 
                    key={port.id} 
                    className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded">
                        P{port.portNumber}
                      </span>
                      <span className="font-bold">{port.type.replace('_', ' ')}</span>
                    </div>
                    <span className="font-bold text-black">{port.maxPowerKw}kW</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onBookStation(selectedStation)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md transition-all"
            >
              Reserve Charging Slot
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center text-neutral-500 space-y-2">
            <Info className="h-8 w-8 text-black mx-auto" />
            <p className="text-sm font-bold text-black">Select a charging station from the map</p>
          </div>
        )}
      </div>
    </div>
  );
};
