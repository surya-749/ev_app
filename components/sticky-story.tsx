"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Cpu, ArrowRight } from "lucide-react";

// ─── Card data ───────────────────────────────────────────────────────────────
const cards = [
  {
    index: "01",
    category: "Demand forecasting",
    title: "Predict",
    body: "Forecast the demand before the congestion happens.",
    theme: "light",
    content: <PredictContent />,
  },
  {
    index: "02",
    category: "Network scheduling",
    title: "Optimise",
    body: "Find the best EV → Station → Time combination.",
    theme: "light",
    content: <OptimiseContent />,
  },
  {
    index: "03",
    category: "Explainable AI",
    title: "Explain",
    body: "Don't just recommend. Explain why.",
    theme: "dark",
    content: <ExplainContent />,
  },
  {
    index: "04",
    category: "IoT action",
    title: "Control",
    body: "Turn intelligence into physical action.",
    theme: "light",
    content: <ControlContent />,
  },
];

function PredictContent() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
      <div>
        <div className="mt-10 grid grid-cols-3 gap-3 font-mono text-xs">
          {[
            { label: "NOW", evs: 42, load: "48%" },
            { label: "+1 HR", evs: 58, load: "67%" },
            { label: "+2 HR", evs: 71, load: "81%" },
          ].map((col) => (
            <div key={col.label}>
              <p className="opacity-40">{col.label}</p>
              <p className="mt-3 text-lg">
                {col.evs} <small className="text-[9px] opacity-50">EVs</small>
              </p>
              <p className="mt-1 opacity-50">{col.load} load</p>
            </div>
          ))}
        </div>
      </div>
      {/* Mini demand chart (CSS bars) */}
      <div className="h-44 rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-end gap-1.5">
        {[35, 42, 38, 55, 68, 72, 58, 81, 76, 65, 45, 38].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition"
            style={{
              height: `${h}%`,
              background: i >= 9 ? "repeating-linear-gradient(45deg,rgba(255,255,255,.25) 0,rgba(255,255,255,.25) 2px,transparent 2px,transparent 6px)" : "rgba(255,255,255,0.7)",
              border: i >= 9 ? "1px solid rgba(255,255,255,0.3)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function OptimiseContent() {
  const rows = [
    { id: "A", wait: 12, load: 78, score: 72, best: false },
    { id: "B", wait: 4, load: 54, score: 94, best: true },
    { id: "C", wait: 7, load: 63, score: 81, best: false },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
      <p className="max-w-xs text-lg leading-7 opacity-70">
        Find the best EV → Station → Time combination.
      </p>
      <div className="overflow-hidden rounded-xl border border-[#e5e5e5]">
        <div className="grid grid-cols-4 border-b border-[#e5e5e5] px-4 py-3 font-mono text-[10px] uppercase tracking-widest opacity-50">
          <span>Station</span><span>Wait</span><span>Load</span><span>Score</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.id}
            className={`grid grid-cols-4 items-center px-4 py-4 font-mono text-sm ${
              r.best ? "bg-[#0a0a0a] text-white" : "border-b border-[#e5e5e5]"
            }`}
          >
            <span>Station {r.id}</span>
            <span>{r.wait} min</span>
            <span>{r.load}%</span>
            <span className="font-semibold">{r.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExplainContent() {
  const features = [
    { label: "Lower grid load", pct: 42 },
    { label: "Shorter wait", pct: 31 },
    { label: "Availability", pct: 19 },
    { label: "User preference", pct: 8 },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-widest">
          <Sparkles size={13} aria-hidden />
          AI confidence: 94.2%
        </div>
      </div>
      <div className="space-y-5">
        {features.map((f) => (
          <div key={f.label}>
            <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              <span>{f.label}</span>
              <span>{f.pct}%</span>
            </div>
            <div className="h-1 bg-white/10">
              <div
                className="h-full bg-white bar-animate"
                style={{ width: `${f.pct}%`, animationDelay: `${f.pct * 10}ms` }}
              />
            </div>
          </div>
        ))}
        <p className="border-t border-white/10 pt-5 text-sm leading-6 text-neutral-400">
          Station B was selected because it has lower predicted congestion, lower grid
          stress, and shorter waiting time.
        </p>
      </div>
    </div>
  );
}

function ControlContent() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      <p className="max-w-xs text-lg leading-7 opacity-70">
        Turn intelligence into physical action.
      </p>
      <div className="grid gap-3 sm:grid-cols-4">
        {["AI", "ESP32", "SENSOR", "RELAY"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex-1 rounded-xl border border-[#e5e5e5] p-5 text-center">
              <Cpu size={16} className="mx-auto mb-3 opacity-50" aria-hidden />
              <p className="font-mono text-[10px] uppercase tracking-wider">{step}</p>
            </div>
            {i < 3 && (
              <ArrowRight size={14} className="hidden opacity-30 sm:block" aria-hidden />
            )}
          </div>
        ))}
        {/* Charger status */}
        <div className="sm:col-span-4 mt-2 rounded-xl border border-[#e5e5e5] bg-[#f4f4f4] p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs">CHARGER 01 · ACTIVE</span>
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#0a0a0a]" />
              Load 78%
            </span>
          </div>
          <div className="mt-5 h-2 rounded-full bg-[#e5e5e5]">
            <div className="h-full w-[78%] rounded-full bg-[#0a0a0a] transition-all duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Single sticky card ──────────────────────────────────────────────────────
function StickyCard({
  card,
  index,
}: {
  card: (typeof cards)[0];
  index: number;
}) {
  const isDark = card.theme === "dark";
  return (
    <article
      className={`sticky top-24 min-h-[520px] overflow-hidden rounded-2xl border p-7 shadow-xl shadow-black/[0.04] md:p-12 ${
        isDark
          ? "border-[#252525] bg-[#111] text-white"
          : "border-[#e5e5e5] bg-white"
      }`}
      style={{ zIndex: index + 1, transform: `translateY(${index * 12}px)` }}
      aria-label={`${card.title} — ${card.category}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
              isDark ? "opacity-50" : "opacity-40"
            }`}
          >
            {card.index} / {card.category}
          </p>
          <h3 className="mt-5 text-4xl font-semibold tracking-[-0.07em] md:text-6xl">
            {card.title}
          </h3>
        </div>
        <span
          className={`font-mono text-xs ${isDark ? "opacity-40" : "opacity-30"}`}
        >
          GRIDWISE / 2026
        </span>
      </div>
      <div className="mt-12">{card.content}</div>
    </article>
  );
}

// ─── Exported section ────────────────────────────────────────────────────────
export default function StickyStory() {
  return (
    <section
      id="story"
      className="container scroll-mt-20 pb-32"
      aria-labelledby="story-heading"
    >
      <div className="mb-12 max-w-xl">
        <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
          <span className="h-px w-8 bg-[#0a0a0a]" aria-hidden />
          One intelligent loop
        </div>
        <h2
          id="story-heading"
          className="text-4xl font-semibold tracking-[-0.07em] md:text-5xl"
        >
          From prediction to physical action.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#737373]">
          Four intelligence layers, working together to make every charge more intentional.
        </p>
      </div>

      <div className="space-y-5">
        {cards.map((card, i) => (
          <StickyCard key={card.index} card={card} index={i} />
        ))}
      </div>
    </section>
  );
}
