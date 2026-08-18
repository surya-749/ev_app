"use client";

import { useEffect, useRef, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { demandData, stationUtilisation } from "@/lib/mock-data";
import { motion, useInView } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

// ─── Demand Forecast Chart ───────────────────────────────────────────────────
export function DemandForecastChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const chartData = demandData.map((d) => ({
    label: d.hour % 4 === 0 ? d.label : "",
    historical: d.historical,
    predicted: d.predicted || undefined,
    gridLoad: d.gridLoad,
  }));

  return (
    <div
      className="rounded-2xl border border-[#e5e5e5] p-5 md:p-7"
      ref={ref}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-xs font-semibold">Charging demand forecast</p>
          <p className="mt-1 text-xs text-[#737373]">Historical vs predicted network demand</p>
        </div>
        <span className="font-mono text-xs text-[#737373]">24 HOURS</span>
      </div>
      <div className="mt-7 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#a3a3a3" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#a3a3a3" }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              contentStyle={{ fontSize: 11, border: "1px solid #e5e5e5", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
              cursor={{ stroke: "#e5e5e5" }}
            />
            <ReferenceLine x="19:00" stroke="#a3a3a3" strokeDasharray="4 4" label={{ value: "Peak", position: "top", fontSize: 9, fill: "#737373" }} />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#0a0a0a"
              strokeWidth={1.5}
              dot={false}
              name="Historical"
              animationDuration={inView ? 1200 : 0}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#0a0a0a"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              name="Forecast"
              animationDuration={inView ? 1400 : 0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-5 text-[10px] font-medium text-[#737373]">
        <span className="flex items-center gap-2">
          <span className="h-px w-5 bg-[#0a0a0a]" />
          Historical
        </span>
        <span className="flex items-center gap-2">
          <span className="h-px w-5 bg-[#0a0a0a] [background-image:repeating-linear-gradient(to_right,#0a0a0a,#0a0a0a_5px,transparent_5px,transparent_9px)]" />
          Forecast
        </span>
      </div>
    </div>
  );
}

// ─── Station Utilisation Chart ───────────────────────────────────────────────
export function StationUtilisationChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div className="rounded-2xl border border-[#e5e5e5] p-5 md:p-7" ref={ref}>
      <p className="text-xs font-semibold">Station utilisation</p>
      <p className="mt-1 text-xs text-[#737373]">Current load by location</p>
      <div className="mt-7 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stationUtilisation} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#a3a3a3" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#a3a3a3" }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
              contentStyle={{ fontSize: 11, border: "1px solid #e5e5e5", borderRadius: 8 }}
              cursor={{ fill: "#f4f4f4" }}
            />
            <Bar dataKey="load" fill="#0a0a0a" name="Current Load" radius={[3, 3, 0, 0]} animationDuration={inView ? 900 : 0} />
            <Bar dataKey="predicted" fill="#d4d4d4" name="Predicted Load" radius={[3, 3, 0, 0]} animationDuration={inView ? 1100 : 0} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-5 text-[10px] font-medium text-[#737373]">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#0a0a0a]" />
          Current
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#d4d4d4]" />
          Predicted
        </span>
      </div>
    </div>
  );
}

// ─── Grid Load Area Chart ────────────────────────────────────────────────────
export function GridLoadChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const gridData = demandData.slice(0, 24).map((d) => ({
    label: d.hour % 6 === 0 ? d.label : "",
    gridLoad: d.gridLoad,
    optimised: Math.max(20, d.gridLoad - (d.gridLoad > 60 ? 12 : 4)),
  }));

  return (
    <div className="rounded-2xl border border-[#e5e5e5] p-5 md:p-7" ref={ref}>
      <div className="flex justify-between">
        <div>
          <p className="text-xs font-semibold">Grid load over 24 hours</p>
          <p className="mt-1 text-xs text-[#737373]">Actual vs GRIDWISE-optimised</p>
        </div>
        <span className="font-mono text-xs text-[#737373]">TODAY</span>
      </div>
      <div className="mt-7 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={gridData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
            <defs>
              <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4d4d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#d4d4d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#a3a3a3" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#a3a3a3" }} tickLine={false} axisLine={false} unit="%" />
            <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e5e5e5", borderRadius: 8 }} />
            <ReferenceLine y={80} stroke="#a3a3a3" strokeDasharray="4 4" label={{ value: "Peak threshold", position: "right", fontSize: 9, fill: "#737373" }} />
            <Area type="monotone" dataKey="gridLoad" stroke="#0a0a0a" strokeWidth={1.5} fill="url(#loadGrad)" name="Actual Load" dot={false} animationDuration={inView ? 1200 : 0} />
            <Area type="monotone" dataKey="optimised" stroke="#a3a3a3" strokeWidth={1} strokeDasharray="4 3" fill="url(#optGrad)" name="Optimised Load" dot={false} animationDuration={inView ? 1400 : 0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-5 text-[10px] font-medium text-[#737373]">
        <span className="flex items-center gap-2"><span className="h-px w-5 bg-[#0a0a0a]" />Actual</span>
        <span className="flex items-center gap-2"><span className="h-px w-5 bg-[#a3a3a3]" />Optimised</span>
      </div>
    </div>
  );
}
