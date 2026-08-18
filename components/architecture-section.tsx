"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const archLayers = [
  { id: "USER / EV", label: "User / EV" },
  { id: "WEB APPLICATION", label: "Web Application" },
  { id: "DEMAND FORECASTING ML MODEL", label: "Demand Forecasting ML Model" },
  { id: "OPTIMISATION ENGINE", label: "Optimisation Engine" },
  { id: "XAI EXPLANATION", label: "XAI Explanation Layer" },
  { id: "ESP32 / IOT LAYER", label: "ESP32 / IoT Layer" },
];

const before = [
  "High peak-hour congestion",
  "Long unpredictable waits",
  "Uneven station utilisation",
  "Grid stress at peak times",
  "No explanation given",
];

const after = [
  "Predicted demand, zero surprise",
  "Optimised schedules, shorter waits",
  "Balanced infrastructure load",
  "Reduced peak grid draw by 18%",
  "Every decision fully explained",
];

const phases = [
  { num: "01", label: "Prototype", detail: "ESP32 + simulated EV loads" },
  { num: "02", label: "Smart Charging", detail: "Real charger integration" },
  { num: "03", label: "Renewable Aware", detail: "Solar + grid availability" },
  { num: "04", label: "V2G", detail: "Vehicle-to-grid optimisation" },
  { num: "05", label: "City Scale", detail: "Multi-station intelligent network" },
];

const impact = [
  { value: "↓ 37%", label: "Average waiting time" },
  { value: "↓ 18%", label: "Peak grid load" },
  { value: "↑ 24%", label: "Station utilisation" },
  { value: "94.2%", label: "AI prediction confidence" },
];

export default function ArchitectureAndMore() {
  return (
    <>
      {/* ── Architecture ──────────────────────────────────────────────────── */}
      <section
        id="architecture"
        className="container scroll-mt-20 py-28"
        aria-labelledby="arch-heading"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
            <span className="h-px w-8 bg-[#0a0a0a]" aria-hidden />
            System architecture
            <span className="h-px w-8 bg-[#0a0a0a]" aria-hidden />
          </div>
          <h2
            id="arch-heading"
            className="text-4xl font-semibold tracking-[-0.07em] md:text-6xl"
          >
            One system. Five intelligence layers.
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-xl space-y-2">
          {archLayers.map((layer, i) => (
            <div key={layer.id} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl border border-[#e5e5e5] bg-white p-5 text-center text-sm font-medium shadow-sm transition hover:-translate-y-1 hover:border-[#0a0a0a]"
              >
                {layer.label}
              </motion.div>
              {i < archLayers.length - 1 && (
                <div className="mx-auto h-5 w-px bg-[#e5e5e5]">
                  <motion.div
                    className="h-full bg-[#0a0a0a] origin-top"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 + 0.3, duration: 0.25 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Before vs After ───────────────────────────────────────────────── */}
      <section className="border-y border-[#e5e5e5] bg-[#f4f4f4]/40">
        <div className="container py-28">
          <div className="mb-12 text-center">
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
              The transformation
            </div>
            <h2 className="text-4xl font-semibold tracking-[-0.07em] md:text-5xl">
              Before vs After GRIDWISE
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Before */}
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-8">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-[#a3a3a3]">
                Today
              </p>
              <div className="space-y-4">
                {before.map((b) => (
                  <div key={b} className="flex items-start gap-3 text-sm text-[#737373]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4d4d4]" />
                    {b}
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="rounded-2xl border border-[#0a0a0a] bg-[#0a0a0a] p-8 text-white">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                With GRIDWISE
              </p>
              <div className="space-y-4">
                {after.map((a) => (
                  <div key={a} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact metrics ────────────────────────────────────────────────── */}
      <section className="container py-28" aria-labelledby="impact-heading">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
          Prototype results
        </div>
        <h2
          id="impact-heading"
          className="mb-2 text-4xl font-semibold tracking-[-0.07em] md:text-5xl"
        >
          Measured impact.
        </h2>
        <p className="mb-12 text-xs font-semibold uppercase tracking-widest text-[#737373]">
          ⓘ Simulated prototype results
        </p>
        <div className="grid grid-cols-2 gap-px overflow-hidden border border-[#e5e5e5] bg-[#e5e5e5] md:grid-cols-4">
          {impact.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white p-8"
            >
              <p className="font-mono text-4xl font-semibold tracking-[-0.06em]">{s.value}</p>
              <p className="mt-3 text-sm text-[#737373]">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Future scope timeline ──────────────────────────────────────────── */}
      <section className="border-t border-[#e5e5e5] bg-[#f4f4f4]/40">
        <div className="container py-28">
          <div className="mb-12">
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
              Roadmap
            </div>
            <h2 className="text-4xl font-semibold tracking-[-0.07em] md:text-5xl">
              Future scope.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-5">
            {phases.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="relative rounded-2xl border border-[#e5e5e5] bg-white p-6"
              >
                <span className="font-mono text-xs text-[#a3a3a3]">PHASE {p.num}</span>
                <h3 className="mt-4 font-semibold tracking-[-0.03em]">{p.label}</h3>
                <p className="mt-2 text-xs leading-5 text-[#737373]">{p.detail}</p>
                {i < phases.length - 1 && (
                  <ArrowRight
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#d4d4d4] hidden sm:block"
                    aria-hidden
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ────────────────────────────────────────────────────── */}
      <section className="container py-20">
        <div className="mb-10 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
          Technical capabilities
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Machine Learning", sub: "Demand forecasting" },
            { label: "Optimisation", sub: "Scheduling & load balancing" },
            { label: "XAI", sub: "Explainable recommendations" },
            { label: "IoT", sub: "ESP32 + sensors + relay" },
            { label: "Web", sub: "Next.js dashboard" },
            { label: "Data", sub: "Real-time monitoring" },
          ].map((t) => (
            <div
              key={t.label}
              className="rounded-xl border border-[#e5e5e5] bg-white p-5 transition hover:border-[#0a0a0a]"
            >
              <p className="text-xs font-semibold">{t.label}</p>
              <p className="mt-2 text-[10px] leading-4 text-[#737373]">{t.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="border-t border-[#e5e5e5] bg-[#0a0a0a] text-white">
        <div className="container py-32 text-center">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
            The mission
          </p>
          <h2 className="mx-auto max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] md:text-7xl">
            Don't build more chargers. Build smarter chargers.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-neutral-400">
            Transform existing charging infrastructure into an intelligent, adaptive,
            grid-aware network — starting today.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#story"
              id="launch-demo-btn"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:-translate-y-0.5 hover:bg-neutral-100"
            >
              Launch Live Demo
              <ArrowRight size={13} className="transition group-hover:translate-x-1" aria-hidden />
            </a>
            <a
              href="#architecture"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:border-white/50"
            >
              Explore Architecture
              <ArrowRight size={13} className="transition group-hover:translate-x-1" aria-hidden />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
