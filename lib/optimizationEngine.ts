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
  // Calculate average charging speed (tapering after 80% is simplified with 0.85 factor)
  const hours = energyNeededKwh / (effectivePowerKw * 0.88);
  const mins = Math.ceil(hours * 60);
  return Math.max(10, Math.min(180, mins));
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
    // Find compatible port with highest speed
    const compatiblePorts = station.ports.filter(p =>
      vehicle.supportedConnectors.includes(p.type)
    );

    const bestPort: ChargerPort = compatiblePorts.length > 0
      ? compatiblePorts.reduce((prev, curr) => (curr.maxPowerKw > prev.maxPowerKw ? curr : prev))
      : station.ports[0];

    const durationMins = estimateChargingDurationMins(energyNeeded, vehicle.maxChargingPowerKw, bestPort.maxPowerKw);
    const cost = Number((energyNeeded * station.currentTariff).toFixed(2));
    const standardCost = Number((energyNeeded * 0.42).toFixed(2)); // baseline standard rate
    const savingsAmount = Math.max(0, Number((standardCost - cost).toFixed(2)));
    const savingsPercent = standardCost > 0 ? Math.round((savingsAmount / standardCost) * 100) : 0;

    // Grid score (0 to 100) based on renewable %, low stress level, and low wait time
    let gridScore = 50;
    if (station.renewablePercent > 70) gridScore += 25;
    else if (station.renewablePercent > 40) gridScore += 10;

    if (station.gridStressLevel === 'low') gridScore += 25;
    else if (station.gridStressLevel === 'moderate') gridScore += 10;
    else if (station.gridStressLevel === 'critical') gridScore -= 25;

    if (station.waitingTimeMins === 0) gridScore += 10;

    gridScore = Math.min(100, Math.max(10, gridScore));

    // Time slot formatting
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

    let matchReason = 'Balanced choice with good charger speed.';
    if (station.renewablePercent >= 80 && station.currentTariff < station.baseTariff) {
      matchReason = `🌿 High Green Solar Energy (${station.renewablePercent}%) & Off-Peak Rate!`;
    } else if (bestPort.maxPowerKw >= 200) {
      matchReason = `⚡ Ultra-Fast ${bestPort.maxPowerKw}kW Charger - Save ${durationMins} mins!`;
    } else if (station.distanceKm <= 2.0) {
      matchReason = `📍 Closest to your current route (${station.distanceKm} km away)`;
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

  // Sort recommendations by composite score
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
