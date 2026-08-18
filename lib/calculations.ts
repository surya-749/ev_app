// ─── Calculation utilities for GRIDWISE ─────────────────────────────────────

import type { Station } from "./mock-data";

/** Score a station 0-100 based on load, wait time, and availability */
export function scoreStation(station: Station): number {
  const loadScore = (100 - station.currentLoad) * 0.45;
  const waitScore = Math.max(0, (20 - station.waitTime) / 20) * 100 * 0.35;
  const availScore = (station.availableChargers / station.chargerCount) * 100 * 0.2;
  return Math.round(loadScore + waitScore + availScore);
}

/** Format a number with a leading zero if < 10 */
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Format power in kW or MW */
export function formatPower(kw: number): string {
  if (kw >= 1000) return `${(kw / 1000).toFixed(1)} MW`;
  return `${kw.toFixed(2)} kW`;
}

/** Compute mock optimisation results for a given number of EVs */
export function computeOptimisation(numEvs: number, gridConstraint: number) {
  const stationOrder = ["B", "C", "E", "A", "D"];
  return Array.from({ length: Math.min(numEvs, 8) }, (_, i) => ({
    evId: `EV ${pad(i + 1)}`,
    stationName: `Station ${stationOrder[i % stationOrder.length]}`,
    time: `${8 + Math.floor((i * 15) / 60)}:${pad((20 + i * 15) % 60)} PM`,
    energy: Math.round(15 + Math.random() * 15),
  }));
}

/** Clamp a number between min and max */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

/** Linear interpolate between a and b by t */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
