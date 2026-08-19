'use client';

import React, { useState, useEffect } from 'react';
import { EVStation, ChargerType } from '../types/ev';
import { RealMap } from './RealMap';
import { StationTrendModal } from './StationTrendModal';
import { fetchRealEVStationsFromOpenChargeMap, INDIAN_CITIES } from '../lib/evApi';
import { predictStationOccupancyTrend } from '../lib/optimizationEngine';
import { Zap, MapPin, Filter, Info, Sun, Clock, ArrowRight, Layers, Globe, RefreshCw, TrendingUp, Sparkles } from 'lucide-react';

interface StationMapProps {
  stations: EVStation[];
  onSelectStation: (station: EVStation) => void;
  onBookStation: (station: EVStation) => void;
  selectedStationId?: string;
  onUpdateStations?: (newStations: EVStation[]) => void;
}

export const StationMap: React.FC<StationMapProps> = ({
  stations,
  onSelectStation,
  onBookStation,
  selectedStationId,
  onUpdateStations
}) => {
  const [filterConnector, setFilterConnector] = useState<ChargerType | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedStation, setSelectedStation] = useState<EVStation | null>(
    stations.find(s => s.id === selectedStationId) || stations[0]
  );
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [isLoadingRealData, setIsLoadingRealData] = useState<boolean>(false);
  const [selectedCityKey, setSelectedCityKey] = useState<string>('bengaluru');
  const [isTrendModalOpen, setIsTrendModalOpen] = useState<boolean>(false);

  const loadCityEVStations = async (cityKey: string) => {
    setIsLoadingRealData(true);
    const city = INDIAN_CITIES[cityKey] || INDIAN_CITIES['bengaluru'];
    try {
      const realStations = await fetchRealEVStationsFromOpenChargeMap(city.lat, city.lng, 12, cityKey);
      if (realStations && realStations.length > 0) {
        if (onUpdateStations) onUpdateStations(realStations);
        setSelectedStation(realStations[0]);
      }
    } catch (e) {
      console.error('City fetch error:', e);
    } finally {
      setIsLoadingRealData(false);
    }
  };

  useEffect(() => {
    loadCityEVStations(selectedCityKey);
  }, []);

  const handleCityChange = (cityKey: string) => {
    setSelectedCityKey(cityKey);
    loadCityEVStations(cityKey);
  };

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

  const selectedTrendData = selectedStation ? predictStationOccupancyTrend(selectedStation) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 sm:p-8 max-w-7xl mx-auto">
      
      {/* Real Leaflet Map Column */}
      <div className="lg:col-span-8 space-y-5">
        
        {/* Controls Bar with Indian Cities Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
            <Globe className="h-4 w-4 text-black" />
            <span>Indian Cities EV Hubs:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
            
            {/* Indian City Dropdown */}
            <select
              value={selectedCityKey}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={isLoadingRealData}
              className="bg-white border border-neutral-300 text-neutral-900 font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:border-neutral-900 shadow-2xs text-xs"
            >
              <option value="bengaluru">Bengaluru (Bangalore)</option>
              <option value="mumbai">Mumbai (BKC / WEH)</option>
              <option value="delhi_ncr">Delhi NCR (Gurgaon / Noida)</option>
              <option value="hyderabad">Hyderabad (Hitec City)</option>
              <option value="chennai">Chennai (OMR IT Corridor)</option>
              <option value="pune">Pune (Hinjawadi IT Park)</option>
            </select>

            <button
              onClick={() => loadCityEVStations(selectedCityKey)}
              disabled={isLoadingRealData}
              className="flex items-center gap-1.5 rounded-xl bg-neutral-900 text-white px-3.5 py-2 font-bold text-xs hover:bg-neutral-800 transition-all shadow-2xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingRealData ? 'animate-spin' : ''}`} />
              {isLoadingRealData ? 'Updating...' : 'Refresh'}
            </button>

            <select
              value={filterConnector}
              onChange={(e) => setFilterConnector(e.target.value as any)}
              className="bg-white border border-neutral-300 text-neutral-900 font-bold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-900"
            >
              <option value="ALL">All Connectors</option>
              <option value="CCS2_DC">CCS2 (DC Fast)</option>
              <option value="Type2_AC">Type-2 AC (22kW)</option>
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
              Substations
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

      {/* Selected Station Drawer with Real-Time Occupancy & Trend Prediction */}
      <div className="lg:col-span-4">
        {selectedStation ? (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-5 shadow-sm sticky top-20">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block rounded-full bg-neutral-100 border border-neutral-200 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                  {selectedStation.category}
                </span>
                <span className="bg-neutral-900 text-white text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Live Telemetry
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-neutral-900 leading-tight">{selectedStation.name}</h3>
              <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-neutral-800" />
                {selectedStation.address} ({selectedStation.distanceKm} km away)
              </p>
            </div>

            {/* Occupancy & Expected Trend Breakdown Box */}
            {selectedTrendData && (
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-neutral-900" /> Occupancy & Trend
                  </span>
                  <span className="bg-neutral-900 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                    {selectedTrendData.trendStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 text-[10px] font-bold uppercase">Current Occupancy:</span>
                    <p className="font-extrabold text-neutral-900 text-sm">{selectedTrendData.currentOccupancyPercent}%</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] font-bold uppercase">Expected Peak:</span>
                    <p className="font-extrabold text-neutral-900 text-sm">{selectedTrendData.expectedPeakHourLabel}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsTrendModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-white py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition-all shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  View 24h Hourly Trend Chart
                </button>
              </div>
            )}

            {/* Tariff & Wait Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Dynamic Tariff</p>
                <p className="text-lg font-extrabold text-neutral-900 mt-1 font-mono">
                  ₹{selectedStation.currentTariff} <span className="text-xs text-neutral-500 font-normal">/kWh</span>
                </p>
              </div>

              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Est. Wait</p>
                <p className="text-lg font-extrabold text-neutral-900 mt-1 font-sans">
                  {selectedStation.waitingTimeMins > 0 ? `${selectedStation.waitingTimeMins} mins` : 'Instant'}
                </p>
              </div>
            </div>

            {/* Solar Mix Bar */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-neutral-900 flex items-center gap-1">
                  <Sun className="h-3.5 w-3.5" /> Renewable Energy
                </span>
                <span className="font-mono">{selectedStation.renewablePercent}% Clean</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-neutral-900 h-full rounded-full"
                  style={{ width: `${selectedStation.renewablePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Available Ports */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">Available Ports</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedStation.ports.map(port => (
                  <div 
                    key={port.id} 
                    className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded">
                        P{port.portNumber}
                      </span>
                      <span className="font-bold">{port.type.replace('_', ' ')}</span>
                    </div>
                    <span className="font-bold text-neutral-900">{port.maxPowerKw}kW</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onBookStation(selectedStation)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm transition-all"
            >
              Reserve Charging Slot
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 text-center text-neutral-500 space-y-2">
            <Info className="h-8 w-8 text-neutral-900 mx-auto" />
            <p className="text-sm font-bold text-neutral-900">Select a charging station from the map</p>
          </div>
        )}
      </div>

      {/* Station Trend & Occupancy Prediction Modal */}
      <StationTrendModal
        isOpen={isTrendModalOpen}
        onClose={() => setIsTrendModalOpen(false)}
        station={selectedStation}
        onBookStation={onBookStation}
      />
    </div>
  );
};
