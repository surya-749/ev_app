export type ChargerType = 'CCS2_DC' | 'CHAdeMO' | 'Type2_AC' | 'Tesla_NACS';
export type PortStatus = 'available' | 'charging' | 'reserved' | 'maintenance';
export type GridStressLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface ChargerPort {
  id: string;
  portNumber: number;
  type: ChargerType;
  maxPowerKw: number;
  status: PortStatus;
  currentKwOutput: number;
  costPerKwh: number;
}

export interface EVStation {
  id: string;
  name: string;
  category: 'Superhub' | 'FastCharge' | 'Destination' | 'FleetDepot' | 'SolarMicrogrid';
  locationName: string;
  address: string;
  lat: number;
  lng: number;
  distanceKm: number;
  totalPorts: number;
  availablePorts: number;
  gridTransformerId: string;
  transformerCapKw: number;
  currentLoadKw: number;
  gridStressLevel: GridStressLevel;
  renewablePercent: number;
  baseTariff: number; // e.g. $0.25/kWh
  currentTariff: number; // dynamic rate e.g. $0.18 or $0.38/kWh
  waitingTimeMins: number;
  rating: number;
  amenities: string[];
  ports: ChargerPort[];
}

export interface DemandDataPoint {
  hour: number;
  timeLabel: string;
  baselineDemandKw: number;
  optimizedDemandKw: number;
  gridCapacityKw: number;
  solarWindGenerationKw: number;
  tariffRate: number;
  congestionRisk: GridStressLevel;
}

export interface GridTransformerNode {
  id: string;
  name: string;
  substationRegion: string;
  capacityKw: number;
  currentLoadKw: number;
  solarInputKw: number;
  connectedStationsCount: number;
  status: 'normal' | 'stressed' | 'overloaded';
  temperatureC: number;
}

export interface EVVehicle {
  id: string;
  brand: string;
  model: string;
  batteryCapacityKwh: number;
  maxChargingPowerKw: number;
  usableSoC: number; // e.g. 10 to 90%
  supportedConnectors: ChargerType[];
  efficiencyKwhPerKm: number;
  icon: string;
}

export interface Recommendation {
  station: EVStation;
  recommendedSlotTime: string; // e.g., "14:15 - 15:00"
  recommendedPort: ChargerPort;
  estimatedDurationMins: number;
  energyToDeliverKwh: number;
  estimatedCost: number;
  standardCost: number;
  savingsAmount: number;
  savingsPercent: number;
  gridScore: number; // 0-100
  matchReason: string;
  waitTimeAvoidedMins: number;
}

export interface Reservation {
  id: string;
  stationId: string;
  stationName: string;
  locationName: string;
  portId: string;
  portType: ChargerType;
  chargingPowerKw: number;
  vehicleName: string;
  startBatteryPercent: number;
  targetBatteryPercent: number;
  slotDate: string;
  slotTime: string;
  durationMins: number;
  energyKwh: number;
  totalCost: number;
  savingsAmount: number;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  qrToken: string;
  createdAt: string;
}

export interface SimulationState {
  isSimulating: boolean;
  simulationSpeed: number; // 1x, 5x, 10x
  activeScenario: 'normal' | 'peak_rush' | 'solar_drop' | 'grid_emergency' | 'fleet_surge';
  currentHour: number;
  dynamicTariffMultiplier: number;
  loadShavingEnabled: boolean;
  v2gIncentiveEnabled: boolean;
}
