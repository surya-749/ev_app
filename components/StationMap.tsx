'use client';

import React, { useState } from 'react';
import { EVStation, ChargerType, GridStressLevel } from '../types/ev';
import { RealMap } from './RealMap';
import { Zap, MapPin, Filter, Info, Sun, Clock, DollarSign, ArrowRight, Sparkles, Layers } from 'lucide-react';

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
  const [showGridLines, setShowGridLines] = useState<boolean>(true);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 sm:p-8 max-w-7xl mx-auto">
      
      {/* Real Leaflet Map Column */}
      <div className="lg:col-span-8 space-y-5">
        
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
            <Filter className="h-4 w-4" />
            <span>Interactive Real Map Controls:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
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
              onClick={() => setShowGridLines(!showGridLines)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                showGridLines
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-black border border-neutral-300'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Substation Lines
            </button>
          </div>
        </div>

        {/* Real Leaflet Map Render */}
        <RealMap
          stations={filteredStations}
          selectedStationId={selectedStation?.id}
          onSelectStation={(st) => {
            setSelectedStation(st);
            onSelectStation(st);
          }}
          onBookStation={onBookStation}
          showGridLines={showGridLines}
        />
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
                {selectedStation.address} ({selectedStation.distanceKm} km away)
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

            {/* Solar Mix Bar */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-black flex items-center gap-1">
                  <Sun className="h-3.5 w-3.5" /> Renewable Mix
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

            {/* Available Ports */}
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
