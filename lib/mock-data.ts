// ─── Mock Data for GRIDWISE — Smart EV Charging Platform ────────────────────

export type StationStatus = "available" | "moderate" | "congested";

export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  chargerCount: number;
  availableChargers: number;
  currentLoad: number;
  predictedLoad: number;
  waitTime: number;
  distance: number;
  score: number;
  status: StationStatus;
  address: string;
}

export interface DemandPoint {
  hour: number;
  label: string;
  historical: number;
  predicted: number;
  gridLoad: number;
}

export interface ChargingSession {
  id: string;
  stationId: string;
  evId: string;
  startTime: string;
  duration: number;
  power: number;
  status: "active" | "queued" | "completed";
}

export interface OptimisationResult {
  evId: string;
  stationName: string;
  time: string;
  energy: number;
}

// ─── Stations ───────────────────────────────────────────────────────────────
export const stations: Station[] = [
  {
    id: "A",
    name: "Station A",
    lat: 12.9716,
    lng: 77.5946,
    chargerCount: 6,
    availableChargers: 2,
    currentLoad: 78,
    predictedLoad: 82,
    waitTime: 12,
    distance: 1.2,
    score: 72,
    status: "congested",
    address: "MG Road, Bengaluru",
  },
  {
    id: "B",
    name: "Station B",
    lat: 12.9352,
    lng: 77.6245,
    chargerCount: 6,
    availableChargers: 4,
    currentLoad: 54,
    predictedLoad: 58,
    waitTime: 4,
    distance: 1.8,
    score: 94,
    status: "available",
    address: "Koramangala, Bengaluru",
  },
  {
    id: "C",
    name: "Station C",
    lat: 12.9915,
    lng: 77.7141,
    chargerCount: 8,
    availableChargers: 5,
    currentLoad: 63,
    predictedLoad: 67,
    waitTime: 7,
    distance: 2.4,
    score: 81,
    status: "moderate",
    address: "Whitefield, Bengaluru",
  },
  {
    id: "D",
    name: "Station D",
    lat: 12.9081,
    lng: 77.6476,
    chargerCount: 4,
    availableChargers: 1,
    currentLoad: 82,
    predictedLoad: 88,
    waitTime: 15,
    distance: 3.1,
    score: 61,
    status: "congested",
    address: "BTM Layout, Bengaluru",
  },
  {
    id: "E",
    name: "Station E",
    lat: 13.0358,
    lng: 77.5972,
    chargerCount: 8,
    availableChargers: 6,
    currentLoad: 41,
    predictedLoad: 44,
    waitTime: 3,
    distance: 4.2,
    score: 88,
    status: "available",
    address: "Hebbal, Bengaluru",
  },
];

// ─── 24-hour Demand Data ─────────────────────────────────────────────────────
const hours = Array.from({ length: 25 }, (_, i) => i);
export const demandData: DemandPoint[] = hours.map((h) => {
  const label = h === 24 ? "00:00" : `${String(h).padStart(2, "0")}:00`;
  const base =
    20 +
    30 * Math.sin(((h - 7) * Math.PI) / 14) +
    25 * Math.sin(((h - 17) * Math.PI) / 8);
  const historical = Math.max(10, Math.min(95, Math.round(base + (h < 18 ? 0 : 5))));
  const predicted = h >= 20 ? Math.round(historical * (1 + 0.08 * Math.random())) : 0;
  const gridLoad = Math.round(historical * 0.85 + 5);
  return { hour: h % 24, label, historical, predicted, gridLoad };
});

// ─── Station Utilisation (for bar chart) ─────────────────────────────────────
export const stationUtilisation = stations.map((s) => ({
  name: s.name,
  load: s.currentLoad,
  predicted: s.predictedLoad,
}));

// ─── Active Sessions ─────────────────────────────────────────────────────────
export const activeSessions: ChargingSession[] = [
  { id: "S001", stationId: "B", evId: "EV-KA-001", startTime: "20:14", duration: 28, power: 22, status: "active" },
  { id: "S002", stationId: "B", evId: "EV-KA-047", startTime: "20:02", duration: 44, power: 22, status: "active" },
  { id: "S003", stationId: "C", evId: "EV-KA-112", startTime: "19:55", duration: 31, power: 50, status: "active" },
  { id: "S004", stationId: "A", evId: "EV-KA-203", startTime: "20:08", duration: 55, power: 11, status: "active" },
  { id: "S005", stationId: "E", evId: "EV-KA-317", startTime: "20:17", duration: 19, power: 150, status: "active" },
];

// ─── Optimisation Results ────────────────────────────────────────────────────
export const optimisationResults: OptimisationResult[] = [
  { evId: "EV 01", stationName: "Station B", time: "8:20 PM", energy: 20 },
  { evId: "EV 02", stationName: "Station C", time: "8:35 PM", energy: 18 },
  { evId: "EV 03", stationName: "Station A", time: "8:50 PM", energy: 22 },
  { evId: "EV 04", stationName: "Station E", time: "9:00 PM", energy: 15 },
  { evId: "EV 05", stationName: "Station B", time: "9:10 PM", energy: 25 },
];

// ─── XAI Feature Importance ──────────────────────────────────────────────────
export const xaiFeatures = [
  { label: "Lower grid load", value: 42, color: "#ffffff" },
  { label: "Shorter wait time", value: 31, color: "#d4d4d4" },
  { label: "Charger availability", value: 19, color: "#a3a3a3" },
  { label: "User preference match", value: 8, color: "#737373" },
];

// ─── IoT Sensor baseline ────────────────────────────────────────────────────
export const iotBaseline = {
  voltage: 230,
  current: 8.4,
  power: 1.93,
  temperature: 31,
  load: 78,
};

// ─── Ticker items ────────────────────────────────────────────────────────────
export const tickerItems = [
  "LIVE DEMAND 72%",
  "12 STATIONS ONLINE",
  "48 CHARGERS",
  "PEAK LOAD 7:30 PM",
  "AI CONFIDENCE 94.2%",
  "NETWORK LOAD 68%",
  "31 ACTIVE SESSIONS",
  "FORECAST ACCURACY 94.2%",
];
