import { EVStation, DemandDataPoint, GridTransformerNode, EVVehicle, Reservation } from '../types/ev';

export const INITIAL_VEHICLES: EVVehicle[] = [
  {
    id: 'v1',
    brand: 'Tesla',
    model: 'Model Y Long Range',
    batteryCapacityKwh: 75,
    maxChargingPowerKw: 250,
    usableSoC: 80,
    supportedConnectors: ['Tesla_NACS', 'CCS2_DC'],
    efficiencyKwhPerKm: 0.16,
    icon: '⚡'
  },
  {
    id: 'v2',
    brand: 'Hyundai',
    model: 'Ioniq 5 Ultra-Fast',
    batteryCapacityKwh: 77.4,
    maxChargingPowerKw: 235,
    usableSoC: 80,
    supportedConnectors: ['CCS2_DC', 'Type2_AC'],
    efficiencyKwhPerKm: 0.17,
    icon: '🔋'
  },
  {
    id: 'v3',
    brand: 'Tata',
    model: 'Nexon EV Max',
    batteryCapacityKwh: 40.5,
    maxChargingPowerKw: 50,
    usableSoC: 80,
    supportedConnectors: ['CCS2_DC', 'Type2_AC'],
    efficiencyKwhPerKm: 0.14,
    icon: '🚗'
  },
  {
    id: 'v4',
    brand: 'Rivian',
    model: 'R1T Dual-Motor',
    batteryCapacityKwh: 135,
    maxChargingPowerKw: 220,
    usableSoC: 85,
    supportedConnectors: ['CCS2_DC', 'Tesla_NACS'],
    efficiencyKwhPerKm: 0.28,
    icon: '🛻'
  },
  {
    id: 'v5',
    brand: 'BMW',
    model: 'i4 eDrive40',
    batteryCapacityKwh: 83.9,
    maxChargingPowerKw: 205,
    usableSoC: 80,
    supportedConnectors: ['CCS2_DC', 'Type2_AC'],
    efficiencyKwhPerKm: 0.18,
    icon: '🏎️'
  }
];

export const INITIAL_GRID_TRANSFORMERS: GridTransformerNode[] = [
  {
    id: 'TX-101',
    name: 'Downtown Central Substation',
    substationRegion: 'District 1 - Urban Core',
    capacityKw: 1200,
    currentLoadKw: 940,
    solarInputKw: 180,
    connectedStationsCount: 3,
    status: 'stressed',
    temperatureC: 62
  },
  {
    id: 'TX-102',
    name: 'Tech Corridor High-Voltage Hub',
    substationRegion: 'District 4 - Tech Park',
    capacityKw: 2000,
    currentLoadKw: 1120,
    solarInputKw: 650,
    connectedStationsCount: 2,
    status: 'normal',
    temperatureC: 48
  },
  {
    id: 'TX-103',
    name: 'Interstate Highway Node 7',
    substationRegion: 'Northern Corridor',
    capacityKw: 1500,
    currentLoadKw: 1380,
    solarInputKw: 220,
    connectedStationsCount: 2,
    status: 'overloaded',
    temperatureC: 76
  },
  {
    id: 'TX-104',
    name: 'Green Solar Park Microgrid',
    substationRegion: 'Western Solar Valley',
    capacityKw: 1800,
    currentLoadKw: 620,
    solarInputKw: 1400,
    connectedStationsCount: 1,
    status: 'normal',
    temperatureC: 41
  }
];

export const INITIAL_STATIONS: EVStation[] = [
  {
    id: 'st-1',
    name: 'Metro City Center Superhub',
    category: 'Superhub',
    locationName: 'Downtown Plaza, Bay 4',
    address: '450 Financial Avenue, Downtown',
    lat: 37.7749,
    lng: -122.4194,
    distanceKm: 1.8,
    totalPorts: 12,
    availablePorts: 3,
    gridTransformerId: 'TX-101',
    transformerCapKw: 1200,
    currentLoadKw: 720,
    gridStressLevel: 'high',
    renewablePercent: 42,
    baseTariff: 0.32,
    currentTariff: 0.42,
    waitingTimeMins: 15,
    rating: 4.8,
    amenities: ['Coffee Lounge', 'Free Wi-Fi', 'Restrooms', '24/7 Security'],
    ports: [
      { id: 'p1-1', portNumber: 1, type: 'CCS2_DC', maxPowerKw: 150, status: 'charging', currentKwOutput: 142, costPerKwh: 0.42 },
      { id: 'p1-2', portNumber: 2, type: 'CCS2_DC', maxPowerKw: 150, status: 'charging', currentKwOutput: 128, costPerKwh: 0.42 },
      { id: 'p1-3', portNumber: 3, type: 'CCS2_DC', maxPowerKw: 150, status: 'available', currentKwOutput: 0, costPerKwh: 0.42 },
      { id: 'p1-4', portNumber: 4, type: 'Tesla_NACS', maxPowerKw: 250, status: 'charging', currentKwOutput: 210, costPerKwh: 0.45 },
      { id: 'p1-5', portNumber: 5, type: 'Tesla_NACS', maxPowerKw: 250, status: 'available', currentKwOutput: 0, costPerKwh: 0.45 },
      { id: 'p1-6', portNumber: 6, type: 'Type2_AC', maxPowerKw: 22, status: 'available', currentKwOutput: 0, costPerKwh: 0.28 }
    ]
  },
  {
    id: 'st-2',
    name: 'Solar Park EcoCharge Hub',
    category: 'SolarMicrogrid',
    locationName: 'Green Energy Complex',
    address: '88 Solar Boulevard, Innovation District',
    lat: 37.7833,
    lng: -122.4167,
    distanceKm: 3.4,
    totalPorts: 16,
    availablePorts: 11,
    gridTransformerId: 'TX-104',
    transformerCapKw: 1800,
    currentLoadKw: 380,
    gridStressLevel: 'low',
    renewablePercent: 95,
    baseTariff: 0.25,
    currentTariff: 0.19, // Discounted off-peak rate!
    waitingTimeMins: 0,
    rating: 4.9,
    amenities: ['Solar Canopy', 'Organic Cafe', 'Workstation Pods', 'EV Wash'],
    ports: [
      { id: 'p2-1', portNumber: 1, type: 'CCS2_DC', maxPowerKw: 200, status: 'available', currentKwOutput: 0, costPerKwh: 0.19 },
      { id: 'p2-2', portNumber: 2, type: 'CCS2_DC', maxPowerKw: 200, status: 'available', currentKwOutput: 0, costPerKwh: 0.19 },
      { id: 'p2-3', portNumber: 3, type: 'CCS2_DC', maxPowerKw: 150, status: 'available', currentKwOutput: 0, costPerKwh: 0.19 },
      { id: 'p2-4', portNumber: 4, type: 'Tesla_NACS', maxPowerKw: 250, status: 'charging', currentKwOutput: 180, costPerKwh: 0.21 },
      { id: 'p2-5', portNumber: 5, type: 'Type2_AC', maxPowerKw: 22, status: 'available', currentKwOutput: 0, costPerKwh: 0.15 }
    ]
  },
  {
    id: 'st-3',
    name: 'Tech Campus HyperFast',
    category: 'FastCharge',
    locationName: 'Silicon Quadrangle',
    address: '101 Innovation Way, Tech Park',
    lat: 37.7650,
    lng: -122.4280,
    distanceKm: 4.2,
    totalPorts: 10,
    availablePorts: 6,
    gridTransformerId: 'TX-102',
    transformerCapKw: 2000,
    currentLoadKw: 680,
    gridStressLevel: 'moderate',
    renewablePercent: 78,
    baseTariff: 0.28,
    currentTariff: 0.26,
    waitingTimeMins: 2,
    rating: 4.7,
    amenities: ['Gourmet Coffee', 'High-Speed Wi-Fi', 'Meeting Pods'],
    ports: [
      { id: 'p3-1', portNumber: 1, type: 'CCS2_DC', maxPowerKw: 180, status: 'available', currentKwOutput: 0, costPerKwh: 0.26 },
      { id: 'p3-2', portNumber: 2, type: 'CCS2_DC', maxPowerKw: 180, status: 'charging', currentKwOutput: 165, costPerKwh: 0.26 },
      { id: 'p3-3', portNumber: 3, type: 'Tesla_NACS', maxPowerKw: 250, status: 'available', currentKwOutput: 0, costPerKwh: 0.28 }
    ]
  },
  {
    id: 'st-4',
    name: 'Interstate Highway North Plaza',
    category: 'FastCharge',
    locationName: 'Exit 42 Expressway Rest Stop',
    address: 'Route 101 Northbound, Mile 42',
    lat: 37.7910,
    lng: -122.4050,
    distanceKm: 7.1,
    totalPorts: 8,
    availablePorts: 1,
    gridTransformerId: 'TX-103',
    transformerCapKw: 1500,
    currentLoadKw: 1380,
    gridStressLevel: 'critical',
    renewablePercent: 30,
    baseTariff: 0.35,
    currentTariff: 0.52, // Surge price due to overload!
    waitingTimeMins: 25,
    rating: 4.3,
    amenities: ['24h Convenience Store', 'Diner', 'Restrooms', 'Tire Check'],
    ports: [
      { id: 'p4-1', portNumber: 1, type: 'CCS2_DC', maxPowerKw: 150, status: 'charging', currentKwOutput: 148, costPerKwh: 0.52 },
      { id: 'p4-2', portNumber: 2, type: 'CCS2_DC', maxPowerKw: 150, status: 'charging', currentKwOutput: 145, costPerKwh: 0.52 },
      { id: 'p4-3', portNumber: 3, type: 'CHAdeMO', maxPowerKw: 60, status: 'charging', currentKwOutput: 58, costPerKwh: 0.45 },
      { id: 'p4-4', portNumber: 4, type: 'Tesla_NACS', maxPowerKw: 250, status: 'charging', currentKwOutput: 230, costPerKwh: 0.55 }
    ]
  },
  {
    id: 'st-5',
    name: 'Suburban West Mall Green Charging',
    category: 'Destination',
    locationName: 'Westfield Galleria Parkade',
    address: '1200 West Mall Expressway',
    lat: 37.7500,
    lng: -122.4400,
    distanceKm: 5.8,
    totalPorts: 14,
    availablePorts: 9,
    gridTransformerId: 'TX-101',
    transformerCapKw: 1200,
    currentLoadKw: 220,
    gridStressLevel: 'low',
    renewablePercent: 60,
    baseTariff: 0.26,
    currentTariff: 0.22,
    waitingTimeMins: 0,
    rating: 4.6,
    amenities: ['Shopping Mall', 'Cinema', 'Restaurants', 'Valet'],
    ports: [
      { id: 'p5-1', portNumber: 1, type: 'Type2_AC', maxPowerKw: 22, status: 'available', currentKwOutput: 0, costPerKwh: 0.22 },
      { id: 'p5-2', portNumber: 2, type: 'CCS2_DC', maxPowerKw: 60, status: 'available', currentKwOutput: 0, costPerKwh: 0.25 }
    ]
  },
  {
    id: 'st-6',
    name: 'Airport Skyport EV Terminal',
    category: 'Superhub',
    locationName: 'International Airport P3 Parking',
    address: 'Terminal 2 Skyway, Airport Blvd',
    lat: 37.7300,
    lng: -122.3800,
    distanceKm: 11.2,
    totalPorts: 20,
    availablePorts: 14,
    gridTransformerId: 'TX-102',
    transformerCapKw: 2000,
    currentLoadKw: 440,
    gridStressLevel: 'low',
    renewablePercent: 82,
    baseTariff: 0.30,
    currentTariff: 0.24,
    waitingTimeMins: 0,
    rating: 4.9,
    amenities: ['Airline Lounge', 'Luggage Check', '24/7 Food Court'],
    ports: [
      { id: 'p6-1', portNumber: 1, type: 'CCS2_DC', maxPowerKw: 150, status: 'available', currentKwOutput: 0, costPerKwh: 0.24 },
      { id: 'p6-2', portNumber: 2, type: 'Tesla_NACS', maxPowerKw: 250, status: 'available', currentKwOutput: 0, costPerKwh: 0.26 }
    ]
  }
];

export const HOURLY_DEMAND_FORECAST: DemandDataPoint[] = [
  { hour: 0, timeLabel: '12 AM', baselineDemandKw: 1800, optimizedDemandKw: 2100, gridCapacityKw: 6000, solarWindGenerationKw: 900, tariffRate: 0.16, congestionRisk: 'low' },
  { hour: 1, timeLabel: '01 AM', baselineDemandKw: 1400, optimizedDemandKw: 2200, gridCapacityKw: 6000, solarWindGenerationKw: 850, tariffRate: 0.14, congestionRisk: 'low' },
  { hour: 2, timeLabel: '02 AM', baselineDemandKw: 1200, optimizedDemandKw: 2300, gridCapacityKw: 6000, solarWindGenerationKw: 800, tariffRate: 0.14, congestionRisk: 'low' },
  { hour: 3, timeLabel: '03 AM', baselineDemandKw: 1100, optimizedDemandKw: 2400, gridCapacityKw: 6000, solarWindGenerationKw: 800, tariffRate: 0.14, congestionRisk: 'low' },
  { hour: 4, timeLabel: '04 AM', baselineDemandKw: 1300, optimizedDemandKw: 2100, gridCapacityKw: 6000, solarWindGenerationKw: 850, tariffRate: 0.15, congestionRisk: 'low' },
  { hour: 5, timeLabel: '05 AM', baselineDemandKw: 1900, optimizedDemandKw: 2000, gridCapacityKw: 6000, solarWindGenerationKw: 1000, tariffRate: 0.18, congestionRisk: 'low' },
  { hour: 6, timeLabel: '06 AM', baselineDemandKw: 2800, optimizedDemandKw: 2600, gridCapacityKw: 6000, solarWindGenerationKw: 1400, tariffRate: 0.22, congestionRisk: 'low' },
  { hour: 7, timeLabel: '07 AM', baselineDemandKw: 4200, optimizedDemandKw: 3100, gridCapacityKw: 6000, solarWindGenerationKw: 2100, tariffRate: 0.32, congestionRisk: 'moderate' },
  { hour: 8, timeLabel: '08 AM', baselineDemandKw: 5600, optimizedDemandKw: 3800, gridCapacityKw: 6000, solarWindGenerationKw: 3200, tariffRate: 0.42, congestionRisk: 'high' },
  { hour: 9, timeLabel: '09 AM', baselineDemandKw: 5800, optimizedDemandKw: 4100, gridCapacityKw: 6000, solarWindGenerationKw: 4100, tariffRate: 0.38, congestionRisk: 'high' },
  { hour: 10, timeLabel: '10 AM', baselineDemandKw: 4900, optimizedDemandKw: 4200, gridCapacityKw: 6000, solarWindGenerationKw: 4800, tariffRate: 0.28, congestionRisk: 'moderate' },
  { hour: 11, timeLabel: '11 AM', baselineDemandKw: 4200, optimizedDemandKw: 4500, gridCapacityKw: 6000, solarWindGenerationKw: 5400, tariffRate: 0.20, congestionRisk: 'low' },
  { hour: 12, timeLabel: '12 PM', baselineDemandKw: 3900, optimizedDemandKw: 4600, gridCapacityKw: 6000, solarWindGenerationKw: 5800, tariffRate: 0.18, congestionRisk: 'low' },
  { hour: 13, timeLabel: '01 PM', baselineDemandKw: 4100, optimizedDemandKw: 4500, gridCapacityKw: 6000, solarWindGenerationKw: 5600, tariffRate: 0.19, congestionRisk: 'low' },
  { hour: 14, timeLabel: '02 PM', baselineDemandKw: 4600, optimizedDemandKw: 4300, gridCapacityKw: 6000, solarWindGenerationKw: 5100, tariffRate: 0.24, congestionRisk: 'low' },
  { hour: 15, timeLabel: '03 PM', baselineDemandKw: 5200, optimizedDemandKw: 4200, gridCapacityKw: 6000, solarWindGenerationKw: 4400, tariffRate: 0.34, congestionRisk: 'moderate' },
  { hour: 16, timeLabel: '04 PM', baselineDemandKw: 5900, optimizedDemandKw: 4300, gridCapacityKw: 6000, solarWindGenerationKw: 3600, tariffRate: 0.44, congestionRisk: 'high' },
  { hour: 17, timeLabel: '05 PM', baselineDemandKw: 6400, optimizedDemandKw: 4500, gridCapacityKw: 6000, solarWindGenerationKw: 2600, tariffRate: 0.52, congestionRisk: 'critical' },
  { hour: 18, timeLabel: '06 PM', baselineDemandKw: 6600, optimizedDemandKw: 4600, gridCapacityKw: 6000, solarWindGenerationKw: 1700, tariffRate: 0.55, congestionRisk: 'critical' },
  { hour: 19, timeLabel: '07 PM', baselineDemandKw: 6100, optimizedDemandKw: 4400, gridCapacityKw: 6000, solarWindGenerationKw: 1100, tariffRate: 0.48, congestionRisk: 'high' },
  { hour: 20, timeLabel: '08 PM', baselineDemandKw: 5100, optimizedDemandKw: 3900, gridCapacityKw: 6000, solarWindGenerationKw: 950, tariffRate: 0.36, congestionRisk: 'moderate' },
  { hour: 21, timeLabel: '09 PM', baselineDemandKw: 4100, optimizedDemandKw: 3400, gridCapacityKw: 6000, solarWindGenerationKw: 900, tariffRate: 0.28, congestionRisk: 'low' },
  { hour: 22, timeLabel: '10 PM', baselineDemandKw: 3100, optimizedDemandKw: 3000, gridCapacityKw: 6000, solarWindGenerationKw: 900, tariffRate: 0.22, congestionRisk: 'low' },
  { hour: 23, timeLabel: '11 PM', baselineDemandKw: 2300, optimizedDemandKw: 2500, gridCapacityKw: 6000, solarWindGenerationKw: 900, tariffRate: 0.18, congestionRisk: 'low' }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-8921',
    stationId: 'st-2',
    stationName: 'Solar Park EcoCharge Hub',
    locationName: 'Green Energy Complex',
    portId: 'p2-1',
    portType: 'CCS2_DC',
    chargingPowerKw: 200,
    vehicleName: 'Hyundai Ioniq 5 Ultra-Fast',
    startBatteryPercent: 20,
    targetBatteryPercent: 80,
    slotDate: 'Today',
    slotTime: '13:00 - 13:35',
    durationMins: 35,
    energyKwh: 46.4,
    totalCost: 8.81,
    savingsAmount: 4.82,
    status: 'confirmed',
    qrToken: 'EV-SOLAR-8921-X9',
    createdAt: '10 mins ago'
  }
];
