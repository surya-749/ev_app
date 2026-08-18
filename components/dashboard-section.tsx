"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { DemandForecastChart, StationUtilisationChart, GridLoadChart } from "./demand-chart";

const metrics = [
  { label: "Active stations", value: "12", sub: "of 14 total" },
  { label: "Active chargers", value: "31/48", sub: "" },
  { label: "Network load", value: "68%", sub: "+4.2% vs yesterday" },
  { label: "Forecast accuracy", value: "94.2%", sub: "" },
  { label: "Avg wait time", value: "6.4m", sub: "" },
];

export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="container scroll-mt-20 py-28"
      aria-labelledby="dashboard-heading"
    >
      {/* Top bar */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
          <span className="h-px w-8 bg-[#0a0a0a]" aria-hidden />
          Network overview
        </div>
        <button
          id="presentation-mode-btn"
          className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition hover:bg-[#f4f4f4]"
          aria-label="Toggle presentation mode"
        >
          <SlidersHorizontal size={13} aria-hidden />
          Presentation mode
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2
            id="dashboard-heading"
            className="text-4xl font-semibold tracking-[-0.07em] md:text-6xl"
          >
            Charging network.
          </h2>
          <p className="mt-3 text-sm text-[#737373]">
            Live infrastructure intelligence · last updated just now
          </p>
        </div>
      </div>

      {/* Metrics row */}
      <div className="mt-12 grid grid-cols-2 gap-8 border-y border-[#e5e5e5] py-7 md:grid-cols-5">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="border-l border-[#e5e5e5] pl-4"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#737373]">{m.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.06em]">{m.value}</p>
            {m.sub && <p className="mt-1 text-xs text-[#737373]">{m.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <DemandForecastChart />
        <StationUtilisationChart />
      </div>
      <div className="mt-5">
        <GridLoadChart />
      </div>
    </section>
  );
}
