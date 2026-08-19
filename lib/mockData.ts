import { EVStation, DemandDataPoint, GridTransformerNode, EVVehicle, Reservation } from '../types/ev';

export const INITIAL_VEHICLES: EVVehicle[] = [
  {
    id: 'v1',
    brand: 'Tata',
    model: 'Nexon EV Max',
    batteryCapacityKwh: 40.5,
    maxChargingPowerKw: 50,
    usableSoC: 80,
    supportedConnectors: ['CCS2_DC', 'Type2_AC'],
    efficiencyKwhPerKm: 0.14,
    icon: 'suv'
  },
  {
    id: 'v2',
    brand: 'Tata',
    model: 'Punch EV Long Range',
    batteryCapacityKwh: 35,
    maxChargingPowerKw: 50,
    usableSoC: 80,
    supportedConnectors: ['CCS2_DC', 'Type2_AC'],
    efficiencyKwhPerKm: 0.13,
    icon: 'crossover'
  },
  {
    id: 'v3',
    brand: 'MG',
    model: 'ZS EV Excite',
    batteryCapacityKwh: 50.3,
    maxChargingPowerKw: 60,
    usableSoC: 80,
    supportedConnectors: ['CCS2_DC', 'Type2_AC'],
    efficiencyKwhPerKm: 0.15,
    icon: 'compact'
  },
  {
    id: 'v4',
    brand: 'Hyundai',
    model: 'Ioniq 5 Ultra-Fast',
    batteryCapacityKwh: 77.4,
    maxChargingPowerKw: 235,
    usableSoC: 80,
    supportedConnectors: ['CCS2_DC', 'Type2_AC'],
    efficiencyKwhPerKm: 0.17,
    icon: 'sports'
  },
  {
    id: 'v5',
    brand: 'Mahindra',
    model: 'XUV400 EV',
    batteryCapacityKwh: 39.4,
    maxChargingPowerKw: 50,
    usableSoC: 80,
    supportedConnectors: ['CCS2_DC', 'Type2_AC'],
    efficiencyKwhPerKm: 0.15,
    icon: 'sedan'
  },
  {
    id: 'v6',
    brand: 'BYD',
    model: 'Atto 3 Supreme',
    batteryCapacityKwh: 60.48,
    maxChargingPowerKw: 80,
    usableSoC: 80,
    supportedConnectors: ['CCS2_DC', 'Type2_AC'],
    efficiencyKwhPerKm: 0.16,
    icon: 'luxury'
  }
];

export const INITIAL_GRID_TRANSFORMERS: GridTransformerNode[] = [
  {
    id: 'TX-101',
    name: 'Bengaluru Central Substation',
    substationRegion: 'Indiranagar Core',
    capacityKw: 1500,
    currentLoadKw: 840,
    solarInputKw: 320,
    connectedStationsCount: 3,
    status: 'normal',
    temperatureC: 52
  },
  {
    id: 'TX-102',
    name: 'Whitefield IT corridor Substation',
    substationRegion: 'Whitefield Tech Park',
    capacityKw: 2000,
    currentLoadKw: 1420,
    solarInputKw: 750,
    connectedStationsCount: 3,
    status: 'stressed',
    temperatureC: 64
  },
  {
    id: 'TX-103',
    name: 'Electronic City Solar Microgrid',
    substationRegion: 'Electronic City Phase 1',
    capacityKw: 1800,
    currentLoadKw: 510,
    solarInputKw: 1450,
    connectedStationsCount: 2,
    status: 'normal',
    temperatureC: 41
  },
  {
    id: 'TX-104',
    name: 'Interstate Highway NH-44 Node',
    substationRegion: 'Hosur Road Corridor',
    capacityKw: 1400,
    currentLoadKw: 1320,
    solarInputKw: 210,
    connectedStationsCount: 2,
    status: 'overloaded',
    temperatureC: 78
  }
];

export const INITIAL_STATIONS: EVStation[] = [
  {
    id: 'ind-blr-1',
    name: 'Tata Power EZ Charge — Indiranagar Hub',
    category: 'Superhub',
    locationName: '100 Feet Road, Indiranagar',
    address: '100 Feet Rd, Indiranagar, Bengaluru, KA 560038',
    lat: 12.9784,
    lng: 77.6408,
    distanceKm: 2.1,
    totalPorts: 12,
    availablePorts: 5,
    gridTransformerId: 'TX-101',
    transformerCapKw: 1500,
    currentLoadKw: 680,
    gridStressLevel: 'low',
    renewablePercent: 88,
    baseTariff: 18,
    currentTariff: 14,
    waitingTimeMins: 0,
    rating: 4.8,
    amenities: ['Coffee Lounge', '24/7 Security', 'Restrooms', 'Free Wi-Fi'],
    ports: [
      { id: 'blr-p1', portNumber: 1, type: 'CCS2_DC', maxPowerKw: 150, status: 'available', currentKwOutput: 0, costPerKwh: 14 },
      { id: 'blr-p2', portNumber: 2, type: 'CCS2_DC', maxPowerKw: 150, status: 'charging', currentKwOutput: 120, costPerKwh: 14 },
      { id: 'blr-p3', portNumber: 3, type: 'CCS2_DC', maxPowerKw: 60, status: 'available', currentKwOutput: 0, costPerKwh: 14 },
      { id: 'blr-p4', portNumber: 4, type: 'Type2_AC', maxPowerKw: 22, status: 'available', currentKwOutput: 0, costPerKwh: 12 }
    ]
  },
  {
    id: 'ind-blr-2',
    name: 'Jio-bp pulse — Electronic City Microgrid',
    category: 'SolarMicrogrid',
    locationName: 'Phase 1, Electronic City',
    address: 'Hosur Main Rd, Electronic City, Bengaluru, KA 560100',
    lat: 12.8452,
    lng: 77.6602,
    distanceKm: 8.4,
    totalPorts: 16,
    availablePorts: 11,
    gridTransformerId: 'TX-103',
    transformerCapKw: 1800,
    currentLoadKw: 420,
    gridStressLevel: 'low',
    renewablePercent: 96,
    baseTariff: 16,
    currentTariff: 12,
    waitingTimeMins: 0,
    rating: 4.9,
    amenities: ['Solar Canopy', 'Wildbeans Cafe', 'EV Wash'],
    ports: [
      { id: 'blr-p5', portNumber: 1, type: 'CCS2_DC', maxPowerKw: 200, status: 'available', currentKwOutput: 0, costPerKwh: 12 },
      { id: 'blr-p6', portNumber: 2, type: 'CCS2_DC', maxPowerKw: 150, status: 'available', currentKwOutput: 0, costPerKwh: 12 }
    ]
  },
  {
    id: 'ind-blr-3',
    name: 'Zeon Charging — Whitefield Tech Hub',
    category: 'FastCharge',
    locationName: 'ITPL Main Road, Whitefield',
    address: 'ITPL Main Rd, Whitefield, Bengaluru, KA 560066',
    lat: 12.9866,
    lng: 77.7381,
    distanceKm: 12.2,
    totalPorts: 8,
    availablePorts: 2,
    gridTransformerId: 'TX-102',
    transformerCapKw: 2000,
    currentLoadKw: 1420,
    gridStressLevel: 'high',
    renewablePercent: 45,
    baseTariff: 19,
    currentTariff: 22,
    waitingTimeMins: 10,
    rating: 4.6,
    amenities: ['Mall Access', 'Food Court', 'Restrooms'],
    ports: [
      { id: 'blr-p7', portNumber: 1, type: 'CCS2_DC', maxPowerKw: 120, status: 'charging', currentKwOutput: 110, costPerKwh: 22 }
    ]
  },
  {
    id: 'ind-blr-4',
    name: 'Statiq — Koramangala Forum Mall',
    category: 'Destination',
    locationName: 'Hosur Road, Koramangala',
    address: 'Nexus Mall, Koramangala 7th Block, Bengaluru, KA 560095',
    lat: 12.9352,
    lng: 77.6141,
    distanceKm: 4.5,
    totalPorts: 10,
    availablePorts: 7,
    gridTransformerId: 'TX-101',
    transformerCapKw: 1500,
    currentLoadKw: 520,
    gridStressLevel: 'low',
    renewablePercent: 65,
    baseTariff: 18,
    currentTariff: 15,
    waitingTimeMins: 0,
    rating: 4.7,
    amenities: ['Cinema', 'Food Court', 'Shopping'],
    ports: [
      { id: 'blr-p8', portNumber: 1, type: 'CCS2_DC', maxPowerKw: 60, status: 'available', currentKwOutput: 0, costPerKwh: 15 }
    ]
  }
];

export const HOURLY_DEMAND_FORECAST: DemandDataPoint[] = [
  { hour: 0, timeLabel: '12 AM', baselineDemandKw: 1800, optimizedDemandKw: 2100, gridCapacityKw: 6000, solarWindGenerationKw: 900, tariffRate: 12, congestionRisk: 'low' },
  { hour: 1, timeLabel: '01 AM', baselineDemandKw: 1400, optimizedDemandKw: 2200, gridCapacityKw: 6000, solarWindGenerationKw: 850, tariffRate: 11, congestionRisk: 'low' },
  { hour: 2, timeLabel: '02 AM', baselineDemandKw: 1200, optimizedDemandKw: 2300, gridCapacityKw: 6000, solarWindGenerationKw: 800, tariffRate: 11, congestionRisk: 'low' },
  { hour: 3, timeLabel: '03 AM', baselineDemandKw: 1100, optimizedDemandKw: 2400, gridCapacityKw: 6000, solarWindGenerationKw: 800, tariffRate: 11, congestionRisk: 'low' },
  { hour: 4, timeLabel: '04 AM', baselineDemandKw: 1300, optimizedDemandKw: 2100, gridCapacityKw: 6000, solarWindGenerationKw: 850, tariffRate: 12, congestionRisk: 'low' },
  { hour: 5, timeLabel: '05 AM', baselineDemandKw: 1900, optimizedDemandKw: 2000, gridCapacityKw: 6000, solarWindGenerationKw: 1000, tariffRate: 14, congestionRisk: 'low' },
  { hour: 6, timeLabel: '06 AM', baselineDemandKw: 2800, optimizedDemandKw: 2600, gridCapacityKw: 6000, solarWindGenerationKw: 1400, tariffRate: 16, congestionRisk: 'low' },
  { hour: 7, timeLabel: '07 AM', baselineDemandKw: 4200, optimizedDemandKw: 3100, gridCapacityKw: 6000, solarWindGenerationKw: 2100, tariffRate: 18, congestionRisk: 'moderate' },
  { hour: 8, timeLabel: '08 AM', baselineDemandKw: 5600, optimizedDemandKw: 3800, gridCapacityKw: 6000, solarWindGenerationKw: 3200, tariffRate: 21, congestionRisk: 'high' },
  { hour: 9, timeLabel: '09 AM', baselineDemandKw: 5800, optimizedDemandKw: 4100, gridCapacityKw: 6000, solarWindGenerationKw: 4100, tariffRate: 20, congestionRisk: 'high' },
  { hour: 10, timeLabel: '10 AM', baselineDemandKw: 4900, optimizedDemandKw: 4200, gridCapacityKw: 6000, solarWindGenerationKw: 4800, tariffRate: 16, congestionRisk: 'moderate' },
  { hour: 11, timeLabel: '11 AM', baselineDemandKw: 4200, optimizedDemandKw: 4500, gridCapacityKw: 6000, solarWindGenerationKw: 5400, tariffRate: 13, congestionRisk: 'low' },
  { hour: 12, timeLabel: '12 PM', baselineDemandKw: 3900, optimizedDemandKw: 4600, gridCapacityKw: 6000, solarWindGenerationKw: 5800, tariffRate: 12, congestionRisk: 'low' },
  { hour: 13, timeLabel: '01 PM', baselineDemandKw: 4100, optimizedDemandKw: 4500, gridCapacityKw: 6000, solarWindGenerationKw: 5600, tariffRate: 12, congestionRisk: 'low' },
  { hour: 14, timeLabel: '02 PM', baselineDemandKw: 4600, optimizedDemandKw: 4300, gridCapacityKw: 6000, solarWindGenerationKw: 5100, tariffRate: 14, congestionRisk: 'low' },
  { hour: 15, timeLabel: '03 PM', baselineDemandKw: 5200, optimizedDemandKw: 4200, gridCapacityKw: 6000, solarWindGenerationKw: 4400, tariffRate: 18, congestionRisk: 'moderate' },
  { hour: 16, timeLabel: '04 PM', baselineDemandKw: 5900, optimizedDemandKw: 4300, gridCapacityKw: 6000, solarWindGenerationKw: 3600, tariffRate: 22, congestionRisk: 'high' },
  { hour: 17, timeLabel: '05 PM', baselineDemandKw: 6400, optimizedDemandKw: 4500, gridCapacityKw: 6000, solarWindGenerationKw: 2600, tariffRate: 24, congestionRisk: 'critical' },
  { hour: 18, timeLabel: '06 PM', baselineDemandKw: 6600, optimizedDemandKw: 4600, gridCapacityKw: 6000, solarWindGenerationKw: 1700, tariffRate: 25, congestionRisk: 'critical' },
  { hour: 19, timeLabel: '07 PM', baselineDemandKw: 6100, optimizedDemandKw: 4400, gridCapacityKw: 6000, solarWindGenerationKw: 1100, tariffRate: 22, congestionRisk: 'high' },
  { hour: 20, timeLabel: '08 PM', baselineDemandKw: 5100, optimizedDemandKw: 3900, gridCapacityKw: 6000, solarWindGenerationKw: 950, tariffRate: 18, congestionRisk: 'moderate' },
  { hour: 21, timeLabel: '09 PM', baselineDemandKw: 4100, optimizedDemandKw: 3400, gridCapacityKw: 6000, solarWindGenerationKw: 900, tariffRate: 15, congestionRisk: 'low' },
  { hour: 22, timeLabel: '10 PM', baselineDemandKw: 3100, optimizedDemandKw: 3000, gridCapacityKw: 6000, solarWindGenerationKw: 900, tariffRate: 13, congestionRisk: 'low' },
  { hour: 23, timeLabel: '11 PM', baselineDemandKw: 2300, optimizedDemandKw: 2500, gridCapacityKw: 6000, solarWindGenerationKw: 900, tariffRate: 12, congestionRisk: 'low' }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-7891',
    stationId: 'ind-blr-1',
    stationName: 'Tata Power EZ Charge — Indiranagar',
    locationName: '100 Feet Road, Indiranagar',
    portId: 'blr-p1',
    portType: 'CCS2_DC',
    chargingPowerKw: 150,
    vehicleName: 'Tata Nexon EV Max',
    startBatteryPercent: 20,
    targetBatteryPercent: 80,
    slotDate: 'Today',
    slotTime: '13:00 - 13:35',
    durationMins: 35,
    energyKwh: 24.3,
    totalCost: 340,
    savingsAmount: 98,
    status: 'confirmed',
    qrToken: 'EV-TATA-EZ-7891',
    createdAt: '5 mins ago'
  }
];
