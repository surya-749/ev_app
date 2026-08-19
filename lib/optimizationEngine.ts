import { EVVehicle, EVStation, Recommendation, DemandDataPoint, GridTransformerNode, ChargerPort } from '../types/ev';

export function calculateEnergyNeeded(
  currentSoC: number,
  targetSoC: number,
  batteryCapacityKwh: number
): number {
  const diffPercent = Math.max(0, targetSoC - currentSoC);
  return Number(((diffPercent / 100) * batteryCapacityKwh).toFixed(1));
}

export function estimateChargingDurationMins(
  energyNeededKwh: number,
  vehicleMaxKw: number,
  portMaxKw: number
): number {
  const effectivePowerKw = Math.min(vehicleMaxKw, portMaxKw);
  if (effectivePowerKw <= 0) return 60;
  const hours = energyNeededKwh / (effectivePowerKw * 0.88);
  const mins = Math.ceil(hours * 60);
  return Math.max(10, Math.min(180, mins));
}

export interface StationHourlyTrend {
  hour: number;
  timeLabel: string;
  occupancyPercent: number;
  expectedPortsOccupied: number;
  expectedWaitMins: number;
  predictedTariffRate: number;
  trendStatus: 'clearing' | 'steady' | 'rising' | 'peak';
}

/**
 * Predicts 24-hour occupancy, wait time, and queue trends for a specific station.
 */
export function predictStationOccupancyTrend(station: EVStation): {
  hourlyTrends: StationHourlyTrend[];
  currentOccupancyPercent: number;
  expectedPeakHourLabel: string;
  expectedPeakPercent: number;
  recommendedBestSlotLabel: string;
  recommendedBestSlotPercent: number;
  trendStatus: 'clearing' | 'steady' | 'rising' | 'peak';
} {
  const busyPorts = station.totalPorts - station.availablePorts;
  const currentOccupancyPercent = Math.round((busyPorts / station.totalPorts) * 100);

  // Hourly multiplier baseline patterns for EV hubs (Morning rush 8-9 AM, midday solar drop 1-2 PM, evening rush 5-8 PM)
  const hourlyMultipliers = [
    0.15, 0.10, 0.08, 0.08, 0.12, 0.25, 0.45, 0.70, 0.88, 0.82,
    0.60, 0.35, 0.28, 0.30, 0.42, 0.65, 0.85, 0.95, 0.92, 0.78,
    0.55, 0.38, 0.25, 0.18
  ];

  const hourlyTrends: StationHourlyTrend[] = Array.from({ length: 24 }).map((_, h) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const timeLabel = `${hour12.toString().padStart(2, '0')}:00 ${ampm}`;

    let baseFactor = hourlyMultipliers[h];
    // Adjust based on station category
    if (station.category === 'SolarMicrogrid' && h >= 11 && h <= 14) {
      baseFactor *= 1.3; // High solar utilization
    } else if (station.category === 'Superhub' && (h === 8 || h === 18)) {
      baseFactor = Math.min(0.98, baseFactor * 1.15);
    }

    const occPercent = Math.min(100, Math.max(8, Math.round(baseFactor * 100)));
    const occupiedPorts = Math.min(station.totalPorts, Math.round((occPercent / 100) * station.totalPorts));
    const waitMins = occPercent > 80 ? Math.round((occPercent - 75) * 0.8) : 0;
    const tariff = Math.round(station.baseTariff * (occPercent > 75 ? 1.25 : occPercent < 40 ? 0.75 : 1.0));

    let trendStatus: 'clearing' | 'steady' | 'rising' | 'peak' = 'steady';
    if (occPercent > 85) trendStatus = 'peak';
    else if (h > 0 && occPercent > hourlyMultipliers[h - 1] * 100 + 10) trendStatus = 'rising';
    else if (h > 0 && occPercent < hourlyMultipliers[h - 1] * 100 - 10) trendStatus = 'clearing';

    return {
      hour: h,
      timeLabel,
      occupancyPercent: occPercent,
      expectedPortsOccupied: occupiedPorts,
      expectedWaitMins: waitMins,
      predictedTariffRate: tariff,
      trendStatus
    };
  });

  // Find peak hour and best off-peak hour
  const peakPoint = [...hourlyTrends].sort((a, b) => b.occupancyPercent - a.occupancyPercent)[0];
  const bestPoint = [...hourlyTrends].filter(t => t.hour >= 8 && t.hour <= 22).sort((a, b) => a.occupancyPercent - b.occupancyPercent)[0] || hourlyTrends[12];

  let currentTrendStatus: 'clearing' | 'steady' | 'rising' | 'peak' = 'steady';
  if (currentOccupancyPercent > 80) currentTrendStatus = 'peak';
  else if (currentOccupancyPercent > 55) currentTrendStatus = 'rising';
  else currentTrendStatus = 'clearing';

  return {
    hourlyTrends,
    currentOccupancyPercent,
    expectedPeakHourLabel: peakPoint.timeLabel,
    expectedPeakPercent: peakPoint.occupancyPercent,
    recommendedBestSlotLabel: bestPoint.timeLabel,
    recommendedBestSlotPercent: bestPoint.occupancyPercent,
    trendStatus: currentTrendStatus
  };
}

export function getSmartStationRecommendations(
  vehicle: EVVehicle,
  currentSoC: number,
  targetSoC: number,
  preferredHour: number,
  stations: EVStation[]
): Recommendation[] {
  const energyNeeded = calculateEnergyNeeded(currentSoC, targetSoC, vehicle.batteryCapacityKwh);

  const scoredStations = stations.map(station => {
    const compatiblePorts = station.ports.filter(p =>
      vehicle.supportedConnectors.includes(p.type)
    );

    const bestPort: ChargerPort = compatiblePorts.length > 0
      ? compatiblePorts.reduce((prev, curr) => (curr.maxPowerKw > prev.maxPowerKw ? curr : prev))
      : station.ports[0];

    const durationMins = estimateChargingDurationMins(energyNeeded, vehicle.maxChargingPowerKw, bestPort.maxPowerKw);
    const cost = Math.round(energyNeeded * station.currentTariff);
    const standardCost = Math.round(energyNeeded * 20); // Baseline ₹20/kWh
    const savingsAmount = Math.max(0, standardCost - cost);
    const savingsPercent = standardCost > 0 ? Math.round((savingsAmount / standardCost) * 100) : 0;

    let gridScore = 50;
    if (station.renewablePercent > 70) gridScore += 25;
    else if (station.renewablePercent > 40) gridScore += 10;

    if (station.gridStressLevel === 'low') gridScore += 25;
    else if (station.gridStressLevel === 'moderate') gridScore += 10;
    else if (station.gridStressLevel === 'critical') gridScore -= 25;

    if (station.waitingTimeMins === 0) gridScore += 10;

    gridScore = Math.min(100, Math.max(10, gridScore));

    const startMins = preferredHour * 60 + 15;
    const endMins = startMins + durationMins;
    const formatTime = (totalMins: number) => {
      const h = Math.floor(totalMins / 60) % 24;
      const m = totalMins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedH = h % 12 === 0 ? 12 : h % 12;
      return `${formattedH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    const slotTimeLabel = `${formatTime(startMins)} - ${formatTime(endMins)}`;

    let matchReason = 'Optimal charger speed for Tata, MG, and Hyundai EVs.';
    if (station.renewablePercent >= 80 && station.currentTariff < station.baseTariff) {
      matchReason = `Solar Peak Clean Power (${station.renewablePercent}%) & Discounted Rate (₹${station.currentTariff}/kWh)!`;
    } else if (bestPort.maxPowerKw >= 150) {
      matchReason = `Tata Power / Jio-bp ${bestPort.maxPowerKw}kW Ultra-Fast Charger!`;
    } else if (station.distanceKm <= 3.0) {
      matchReason = `Closest charging hub near your route (${station.distanceKm} km away)`;
    }

    return {
      station,
      recommendedSlotTime: slotTimeLabel,
      recommendedPort: bestPort,
      estimatedDurationMins: durationMins,
      energyToDeliverKwh: energyNeeded,
      estimatedCost: cost,
      standardCost,
      savingsAmount,
      savingsPercent,
      gridScore,
      matchReason,
      waitTimeAvoidedMins: station.waitingTimeMins > 0 ? station.waitingTimeMins : 15
    };
  });

  return scoredStations.sort((a, b) => b.gridScore - a.gridScore);
}

export function calculateOverallGridStress(transformers: GridTransformerNode[]): {
  totalCapKw: number;
  totalLoadKw: number;
  stressPercentage: number;
  status: 'optimal' | 'moderate' | 'high' | 'critical';
} {
  const totalCapKw = transformers.reduce((acc, t) => acc + t.capacityKw, 0);
  const totalLoadKw = transformers.reduce((acc, t) => acc + t.currentLoadKw, 0);
  const stressPercentage = Math.round((totalLoadKw / totalCapKw) * 100);

  let status: 'optimal' | 'moderate' | 'high' | 'critical' = 'optimal';
  if (stressPercentage > 85) status = 'critical';
  else if (stressPercentage > 75) status = 'high';
  else if (stressPercentage > 60) status = 'moderate';

  return { totalCapKw, totalLoadKw, stressPercentage, status };
}
