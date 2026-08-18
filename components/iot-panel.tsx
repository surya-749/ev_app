"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, Pause, Play, Radio } from "lucide-react";
import { iotBaseline } from "@/lib/mock-data";
import { clamp } from "@/lib/calculations";

const STEP = { current: 1.5, power: 0.35, load: 8 };

export default function IotPanel() {
  const [state, setState] = useState({ ...iotBaseline });
  const [status, setStatus] = useState<"active" | "paused">("active");
  const [lastAction, setLastAction] = useState<string | null>(null);

  // Slight jitter to make values feel live
  useEffect(() => {
    if (status !== "active") return;
    const timer = setInterval(() => {
      setState((s) => ({
        ...s,
        current: parseFloat((s.current + (Math.random() - 0.5) * 0.1).toFixed(1)),
        temperature: parseFloat((s.temperature + (Math.random() - 0.5) * 0.2).toFixed(1)),
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, [status]);

  function increaseLoad() {
    setState((s) => {
      const cur = clamp(parseFloat((s.current + STEP.current).toFixed(1)), 0, 16);
      const pow = parseFloat((cur * (s.voltage / 1000)).toFixed(2));
      const load = clamp(s.load + STEP.load, 0, 100);
      return { ...s, current: cur, power: pow, load };
    });
    setLastAction("Load increased");
  }

  function reduceLoad() {
    setState((s) => {
      const cur = clamp(parseFloat((s.current - STEP.current).toFixed(1)), 0, 16);
      const pow = parseFloat((cur * (s.voltage / 1000)).toFixed(2));
      const load = clamp(s.load - STEP.load, 0, 100);
      return { ...s, current: cur, power: pow, load };
    });
    setLastAction("Load reduced");
  }

  function pauseCharging() {
    setStatus("paused");
    setLastAction("Charging paused");
  }

  function resumeCharging() {
    setStatus("active");
    setLastAction("Charging resumed");
  }

  const metrics = [
    { label: "Voltage", value: `${state.voltage} V` },
    { label: "Current", value: `${state.current} A` },
    { label: "Power", value: `${state.power} kW` },
    { label: "Temperature", value: `${state.temperature}°C` },
  ];

  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-7 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#737373]">
            ESP32 / Charger 01
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
            {status === "active" ? "Active charging" : "Charging paused"}
          </h3>
        </div>
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
          <span
            className={`h-2 w-2 rounded-full ${
              status === "active" ? "animate-pulse bg-[#0a0a0a]" : "bg-[#d4d4d4]"
            }`}
          />
          {status === "active" ? "Live" : "Paused"}
        </span>
      </div>

      {/* Sensor values */}
      <div className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="text-[10px] uppercase tracking-widest text-[#737373]">{m.label}</p>
            <motion.p
              key={m.value}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className="mt-2 font-mono text-2xl tracking-[-0.05em]"
            >
              {m.value}
            </motion.p>
          </div>
        ))}
      </div>

      {/* Load bar */}
      <div className="mt-8">
        <div className="mb-2 flex justify-between text-[10px] font-mono uppercase tracking-widest text-[#737373]">
          <span>Charger load</span>
          <span>{state.load}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#e5e5e5]">
          <motion.div
            className="h-full rounded-full bg-[#0a0a0a]"
            animate={{ width: `${state.load}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* AI status banner */}
      <div className="mt-8 flex items-center gap-4 rounded-lg border border-[#e5e5e5] bg-[#f4f4f4] p-4 text-xs">
        <Radio size={16} className="animate-pulse shrink-0" aria-hidden />
        <span>AI load balancing active</span>
        <span className="ml-auto font-mono text-[#737373]">NOMINAL</span>
      </div>

      {/* Last action */}
      <AnimatePresence>
        {lastAction && (
          <motion.p
            key={lastAction + Date.now()}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-center text-[10px] font-semibold uppercase tracking-widest text-[#737373]"
          >
            ✓ {lastAction}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Control buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          id="increase-load-btn"
          onClick={increaseLoad}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#e5e5e5] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider transition hover:-translate-y-0.5 hover:border-[#0a0a0a]"
        >
          <ArrowUp size={12} aria-hidden /> Increase load
        </button>
        <button
          id="reduce-load-btn"
          onClick={reduceLoad}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#e5e5e5] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider transition hover:-translate-y-0.5 hover:border-[#0a0a0a]"
        >
          <ArrowDown size={12} aria-hidden /> Reduce load
        </button>
        <button
          id="pause-charging-btn"
          onClick={pauseCharging}
          disabled={status === "paused"}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#e5e5e5] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider transition hover:-translate-y-0.5 hover:border-[#0a0a0a] disabled:opacity-40"
        >
          <Pause size={12} aria-hidden /> Pause
        </button>
        <button
          id="resume-charging-btn"
          onClick={resumeCharging}
          disabled={status === "active"}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#e5e5e5] px-4 py-3 text-[10px] font-semibold uppercase tracking-wider transition hover:-translate-y-0.5 hover:border-[#0a0a0a] disabled:opacity-40"
        >
          <Play size={12} aria-hidden /> Resume
        </button>
      </div>
    </div>
  );
}
