'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { SmartRecommender } from '../components/SmartRecommender';
import { StationMap } from '../components/StationMap';
import { DemandForecaster } from '../components/DemandForecaster';
import { GridOperatorDashboard } from '../components/GridOperatorDashboard';
import { SlotBookingModal } from '../components/SlotBookingModal';
import { SimulationToolbar } from '../components/SimulationToolbar';

import {
  INITIAL_STATIONS,
  INITIAL_GRID_TRANSFORMERS,
  HOURLY_DEMAND_FORECAST,
  INITIAL_RESERVATIONS,
  INITIAL_VEHICLES
} from '../lib/mockData';
import { EVStation, GridTransformerNode, DemandDataPoint, Reservation, Recommendation, EVVehicle, ChargerPort } from '../types/ev';
import { Calendar, X, Zap } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'driver' | 'forecaster' | 'operator' | 'map'>('driver');
  const [stations, setStations] = useState<EVStation[]>(INITIAL_STATIONS);
  const [transformers, setTransformers] = useState<GridTransformerNode[]>(INITIAL_GRID_TRANSFORMERS);
  const [forecastData, setForecastData] = useState<DemandDataPoint[]>(HOURLY_DEMAND_FORECAST);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);

  // Simulation states
  const [simulatedHour, setSimulatedHour] = useState<number>(14);
  const [loadShavingActive, setLoadShavingActive] = useState<boolean>(true);
  const [v2gActive, setV2gActive] = useState<boolean>(false);
  const [tariffMultiplier, setTariffMultiplier] = useState<number>(1.0);
  const [activeScenario, setActiveScenario] = useState<string>('normal');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal & Drawer states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [selectedBookingStation, setSelectedBookingStation] = useState<EVStation | null>(null);
  const [selectedBookingPort, setSelectedBookingPort] = useState<ChargerPort | undefined>(undefined);
  const [selectedBookingVehicle, setSelectedBookingVehicle] = useState<EVVehicle | undefined>(INITIAL_VEHICLES[0]);
  const [initialStartSoC, setInitialStartSoC] = useState<number>(20);
  const [initialTargetSoC, setInitialTargetSoC] = useState<number>(80);

  const [isReservationsDrawerOpen, setIsReservationsDrawerOpen] = useState<boolean>(false);

  // Handle Scenario Preset Changes
  const handleSelectScenario = (scenario: 'normal' | 'peak_rush' | 'solar_drop' | 'grid_emergency' | 'fleet_surge') => {
    setActiveScenario(scenario);

    if (scenario === 'normal') {
      setStations(INITIAL_STATIONS);
      setTransformers(INITIAL_GRID_TRANSFORMERS);
      setForecastData(HOURLY_DEMAND_FORECAST);
      setSimulatedHour(14);
      setTariffMultiplier(1.0);
    } else if (scenario === 'peak_rush') {
      setSimulatedHour(18); // 6 PM Peak
      setTariffMultiplier(1.6);
      setTransformers(prev => prev.map(t => 
        t.id === 'TX-103' ? { ...t, currentLoadKw: 1450, status: 'overloaded', temperatureC: 81 } : t
      ));
      setStations(prev => prev.map(s => 
        s.id === 'st-4' ? { ...s, currentTariff: 0.58, waitingTimeMins: 35, gridStressLevel: 'critical' } : s
      ));
    } else if (scenario === 'solar_drop') {
      setSimulatedHour(13); // 1 PM Solar Max
      setTariffMultiplier(0.7);
      setStations(prev => prev.map(s => 
        s.category === 'SolarMicrogrid' ? { ...s, currentTariff: 0.16, renewablePercent: 98, gridStressLevel: 'low' } : s
      ));
    } else if (scenario === 'grid_emergency') {
      setSimulatedHour(17);
      setTransformers(prev => prev.map(t => ({ ...t, status: 'stressed', currentLoadKw: Math.round(t.capacityKw * 0.9) })));
      setStations(prev => prev.map(s => ({ ...s, gridStressLevel: 'critical', currentTariff: Number((s.baseTariff * 1.8).toFixed(2)) })));
    }
  };

  const handleResetSimulation = () => {
    handleSelectScenario('normal');
  };

  // Open booking modal for a station
  const handleOpenBookingForStation = (station: EVStation, port?: ChargerPort) => {
    setSelectedBookingStation(station);
    setSelectedBookingPort(port || station.ports[0]);
    setSelectedBookingVehicle(INITIAL_VEHICLES[0]);
    setIsBookingModalOpen(true);
  };

  // Open booking modal from AI recommendation
  const handleBookRecommendation = (
    rec: Recommendation,
    vehicle: EVVehicle,
    currentSoC: number,
    targetSoC: number
  ) => {
    setSelectedBookingStation(rec.station);
    setSelectedBookingPort(rec.recommendedPort);
    setSelectedBookingVehicle(vehicle);
    setInitialStartSoC(currentSoC);
    setInitialTargetSoC(targetSoC);
    setIsBookingModalOpen(true);
  };

  // Confirm booking handler
  const handleConfirmBooking = (newRes: Reservation) => {
    setReservations(prev => [newRes, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col pb-24 bg-dot-pattern">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        transformers={transformers}
        activeReservationsCount={reservations.length}
        onOpenReservations={() => setIsReservationsDrawerOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        simulatedHour={simulatedHour}
        activeScenario={activeScenario}
        onResetSimulation={handleResetSimulation}
      />

      {/* Main Tab Content Area */}
      <main className="flex-1">
        {activeTab === 'driver' && (
          <SmartRecommender
            stations={stations}
            onBookRecommendation={handleBookRecommendation}
            simulatedHour={simulatedHour}
          />
        )}

        {activeTab === 'map' && (
          <StationMap
            stations={stations}
            onSelectStation={(st) => setSelectedBookingStation(st)}
            onBookStation={(st) => handleOpenBookingForStation(st)}
          />
        )}

        {activeTab === 'forecaster' && (
          <DemandForecaster
            forecastData={forecastData}
            transformers={transformers}
            simulatedHour={simulatedHour}
            onHourChange={setSimulatedHour}
            loadShavingActive={loadShavingActive}
            onToggleLoadShaving={() => setLoadShavingActive(!loadShavingActive)}
          />
        )}

        {activeTab === 'operator' && (
          <GridOperatorDashboard
            transformers={transformers}
            stations={stations}
            tariffMultiplier={tariffMultiplier}
            onTariffMultiplierChange={(val) => {
              setTariffMultiplier(val);
              setStations(prev => prev.map(s => ({
                ...s,
                currentTariff: Number((s.baseTariff * val).toFixed(2))
              })));
            }}
            loadShavingActive={loadShavingActive}
            onToggleLoadShaving={() => setLoadShavingActive(!loadShavingActive)}
            v2gActive={v2gActive}
            onToggleV2G={() => setV2gActive(!v2gActive)}
            onThrottleTransformer={(id) => {
              setTransformers(prev => prev.map(t => t.id === id ? { ...t, currentLoadKw: Math.round(t.capacityKw * 0.65), status: 'normal' } : t));
            }}
          />
        )}
      </main>

      {/* Floating Simulation Sandbox Controls Toolbar */}
      <SimulationToolbar
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        onReset={handleResetSimulation}
      />

      {/* Slot Reservation Modal */}
      <SlotBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        station={selectedBookingStation}
        selectedPort={selectedBookingPort}
        vehicle={selectedBookingVehicle}
        initialStartSoC={initialStartSoC}
        initialTargetSoC={initialTargetSoC}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Active Digital Reservations Side Drawer (B&W Style) */}
      {isReservationsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border-l-2 border-black p-6 space-y-6 overflow-y-auto h-full shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-black" />
                <h3 className="text-lg font-black text-black">Active Charging Passes</h3>
              </div>
              <button
                onClick={() => setIsReservationsDrawerOpen(false)}
                className="text-black hover:bg-neutral-100 p-2 rounded-full border border-neutral-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {reservations.length === 0 ? (
              <div className="text-center text-neutral-500 py-12 space-y-2 font-mono">
                <Zap className="h-10 w-10 text-neutral-300 mx-auto" />
                <p className="text-sm font-bold text-black">No active passes</p>
                <p className="text-xs">Book charging slots from the Smart Finder or Map.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white border-2 border-black rounded-2xl p-5 space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-black text-black">{res.id}</span>
                      <span className="bg-black text-white font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                        {res.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-black leading-tight">{res.stationName}</h4>
                      <p className="text-xs text-neutral-600">{res.locationName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-50 p-3 rounded-xl border border-neutral-200 font-mono">
                      <div>
                        <span className="text-neutral-500 uppercase text-[9px] font-bold">Time:</span>
                        <p className="text-black font-bold">{res.slotTime}</p>
                      </div>
                      <div>
                        <span className="text-neutral-500 uppercase text-[9px] font-bold">Vehicle:</span>
                        <p className="text-black font-bold truncate">{res.vehicleName}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 font-mono">
                      <span className="text-neutral-600">Total Price: <span className="text-black font-black">${res.totalCost}</span></span>
                      <span className="text-black font-bold">Saved ${res.savingsAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
