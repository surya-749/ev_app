import React, { useState, useMemo } from 'react';
import { EVVehicle, EVStation, Recommendation } from '../types/ev';
import { INITIAL_VEHICLES } from '../lib/mockData';
import { getSmartStationRecommendations, calculateEnergyNeeded, predictStationOccupancyTrend } from '../lib/optimizationEngine';
import { StationTrendModal } from './StationTrendModal';
import { Zap, Sparkles, BatteryCharging, Clock, ArrowRight, CheckCircle2, Car, Activity, MapPin, Cpu, TrendingUp, Sun, ShieldAlert, Sliders, ShieldCheck } from 'lucide-react';

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
  const [trendStation, setTrendStation] = useState<EVStation | null>(null);

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

  const getVehicleIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'sports':
        return <Activity className="h-4 w-4 text-emerald-600" />;
      case 'luxury':
        return <Sparkles className="h-4 w-4 text-amber-600" />;
      case 'crossover':
        return <Car className="h-4 w-4 text-indigo-600" />;
      case 'compact':
        return <Zap className="h-4 w-4 text-sky-600" />;
      default:
        return <Car className="h-4 w-4 text-neutral-800" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-12">
      
      {/* Hero Section */}
      <div className="py-8 space-y-5 text-left max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-[11px] font-bold text-neutral-800 uppercase tracking-widest shadow-2xs">
          <Zap className="h-3.5 w-3.5 fill-neutral-900 text-neutral-900" />
          INDIA EV CHARGING PLATFORM
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-neutral-900 tracking-tight leading-[1.1]">
          Smart EV Charging & Grid Optimization
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed font-normal">
          AI slot recommendations, real-time demand forecasting, geospatial map navigation, and automated grid load balancing.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={scrollToPlanner}
            className="flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-sm transition-all"
          >
            Find Optimal Station
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
          
          <button
            onClick={scrollToPlanner}
            className="rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-xs font-bold text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 transition-all shadow-2xs"
          >
            Explore AI Planner
          </button>
        </div>
      </div>

      {/* Feature Highlight Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">System Capabilities</h2>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">CHARGEGRID FEATURES</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
          
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-3 shadow-2xs hover:border-neutral-400 hover:shadow-sm transition-all">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Demand Forecaster</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Machine learning load predictions for peak grid capacity and dynamic Time-of-Use tariffs in ₹ INR.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-3 shadow-2xs hover:border-neutral-400 hover:shadow-sm transition-all">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">AI Slot Recommender</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Matches Tata, MG, & Hyundai battery specs with off-peak solar windows to eliminate waiting lines.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-3 shadow-2xs hover:border-neutral-400 hover:shadow-sm transition-all">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Geospatial EV Map</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Live OpenStreetMap telemetry featuring Tata Power EZ Charge, Zeon, Jio-bp, and Statiq charging hubs.
            </p>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-3 shadow-2xs hover:border-neutral-400 hover:shadow-sm transition-all">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">Grid Operator Control</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Automated peak load shaving, transformer load monitors, and Vehicle-to-Grid (V2G) discharge rewards.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive AI Finder Form */}
      <div id="smart-planner-form" className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Left Form Box */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-6 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-4">
            <div className="h-8 w-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
              <Car className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">EV Model & Charge Profile</h3>
          </div>

          {/* Vehicle Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">Select EV Model:</label>
            <div className="space-y-2">
              {INITIAL_VEHICLES.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`w-full flex items-center justify-between rounded-xl p-3 border text-xs transition-all ${
                    selectedVehicle.id === v.id
                      ? 'bg-neutral-900 text-white border-neutral-900 font-bold shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedVehicle.id === v.id ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-700'}`}>
                      {getVehicleIcon(v.icon)}
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{v.brand} {v.model}</p>
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
          <div className="space-y-4 bg-neutral-50 border border-neutral-200/80 rounded-xl p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <BatteryCharging className="h-3.5 w-3.5 text-neutral-900" /> Current SoC %
                </span>
                <span className="font-mono text-neutral-900">{currentSoC}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="75"
                value={currentSoC}
                onChange={(e) => setCurrentSoC(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-neutral-900" /> Target SoC %
                </span>
                <span className="font-mono text-neutral-900">{targetSoC}%</span>
              </div>
              <input
                type="range"
                min={currentSoC + 10}
                max="100"
                value={targetSoC}
                onChange={(e) => setTargetSoC(parseInt(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
              />
            </div>

            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs font-bold">
              <span className="text-neutral-600">Energy Needed:</span>
              <span className="font-mono text-neutral-900">{energyNeeded} kWh</span>
            </div>
          </div>

          {/* Preferred Hour */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Preferred Charging Hour:
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(parseInt(e.target.value))}
              className="w-full bg-white border border-neutral-300 text-neutral-900 font-bold rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-neutral-900 font-mono"
            >
              {Array.from({ length: 24 }).map((_, h) => {
                const ampm = h >= 12 ? 'PM' : 'AM';
                const hour12 = h % 12 === 0 ? 12 : h % 12;
                const label = `${hour12.toString().padStart(2, '0')}:00 ${ampm}`;
                return (
                  <option key={h} value={h}>
                    {label} {h >= 11 && h <= 14 ? '— Solar Peak (Lowest Tariff)' : h >= 17 && h <= 20 ? '— Grid Surge' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Right Recommendation List */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-neutral-900" />
              AI Recommended Charging Stations
            </h3>
            <span className="text-xs font-bold text-neutral-500 font-mono">Ranked by Lowest Grid Load</span>
          </div>

          <div className="space-y-5">
            {recommendations.slice(0, 3).map((rec, index) => {
              const isBest = index === 0;
              const trend = predictStationOccupancyTrend(rec.station);

              return (
                <div
                  key={rec.station.id}
                  className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
                    isBest
                      ? 'bg-white border-2 border-neutral-900 shadow-md'
                      : 'bg-white border border-neutral-200/80 hover:border-neutral-400 shadow-2xs'
                  }`}
                >
                  {isBest && (
                    <div className="absolute top-0 right-0 rounded-bl-xl bg-neutral-900 px-4 py-1 text-[10px] font-extrabold text-white uppercase tracking-widest">
                      RECOMMENDED CHOICE • SAVE {rec.savingsPercent}%
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-neutral-100 border border-neutral-200 px-3 py-0.5 text-[10px] font-bold text-neutral-800 uppercase tracking-wider">
                          {rec.station.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-neutral-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-neutral-700" /> {rec.station.distanceKm} km away
                        </span>
                      </div>

                      <h4 className="text-xl font-extrabold text-neutral-900 leading-tight">{rec.station.name}</h4>
                      <p className="text-xs font-bold text-neutral-600">{rec.matchReason}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs pt-1 font-mono">
                        <span className="bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-lg text-neutral-900 font-bold flex items-center gap-1">
                          <Zap className="h-3 w-3 text-neutral-800" /> {rec.recommendedPort.type.replace('_', ' ')} ({rec.recommendedPort.maxPowerKw}kW)
                        </span>
                        <span className="bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-lg text-neutral-900 font-bold flex items-center gap-1">
                          <Sun className="h-3 w-3 text-neutral-800" /> {rec.station.renewablePercent}% Clean
                        </span>
                        <button
                          onClick={() => setTrendStation(rec.station)}
                          className="bg-neutral-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-neutral-800 transition-all"
                        >
                          <TrendingUp className="h-3 w-3" /> 24h Occupancy ({trend.currentOccupancyPercent}%)
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-start md:items-end gap-4 bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 min-w-[210px]">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Estimated Cost:</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-neutral-900 font-mono">₹{rec.estimatedCost}</span>
                          <span className="text-xs text-neutral-400 line-through font-mono">₹{rec.standardCost}</span>
                        </div>
                      </div>

                      <div className="space-y-0.5 md:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Slot Duration:</p>
                        <p className="text-sm font-bold text-neutral-900 font-mono">{rec.estimatedDurationMins} mins ({rec.recommendedSlotTime})</p>
                      </div>

                      <button
                        onClick={() => onBookRecommendation(rec, selectedVehicle, currentSoC, targetSoC)}
                        className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all ${
                          isBest
                            ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs'
                            : 'bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-100'
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

      {/* Station Occupancy Trend Modal */}
      <StationTrendModal
        isOpen={!!trendStation}
        onClose={() => setTrendStation(null)}
        station={trendStation}
        onBookStation={(st) => {
          setTrendStation(null);
          const rec = recommendations.find(r => r.station.id === st.id) || recommendations[0];
          onBookRecommendation(rec, selectedVehicle, currentSoC, targetSoC);
        }}
      />
    </div>
  );
};
