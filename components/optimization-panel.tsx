"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { computeOptimisation } from "@/lib/calculations";

const steps = [
  "Analysing demand...",
  "Checking station capacity...",
  "Predicting grid load...",
  "Optimising schedule...",
  "Generating explanation...",
];

export default function OptimisationPanel() {
  const [numEvs, setNumEvs] = useState(8);
  const [duration, setDuration] = useState(35);
  const [gridConstraint, setGridConstraint] = useState(72);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState<ReturnType<typeof computeOptimisation>>([]);

  async function runOptimisation() {
    setPhase("running");
    setStepIdx(0);
    for (let i = 0; i < steps.length; i++) {
      setStepIdx(i);
      await new Promise((r) => setTimeout(r, 600));
    }
    setResults(computeOptimisation(numEvs, gridConstraint));
    setPhase("done");
  }

  return (
    <section
      id="optimise"
      className="scroll-mt-20 bg-[#0a0a0a] text-white"
      aria-labelledby="optimise-heading"
    >
      <div className="container py-28">
        <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">

          {/* ── Controls ──────────────────────────────────────────────── */}
          <div>
            <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              <span className="h-px w-8 bg-neutral-600" aria-hidden />
              Simulation engine
            </div>
            <h2
              id="optimise-heading"
              className="text-4xl font-semibold tracking-[-0.07em] md:text-6xl"
            >
              Charging optimisation engine.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-400">
              Simulate the best charging plan for a changing network.
            </p>

            <div className="mt-10 space-y-6">
              {/* Number of EVs */}
              <div>
                <div className="mb-3 flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                  <span>Number of EVs</span>
                  <span className="text-white">{numEvs} vehicles</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={numEvs}
                  onChange={(e) => setNumEvs(+e.target.value)}
                  className="h-1 w-full white-thumb"
                  aria-label="Number of EVs"
                />
              </div>

              {/* Duration */}
              <div>
                <div className="mb-3 flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                  <span>Required duration</span>
                  <span className="text-white">{duration} minutes</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={120}
                  value={duration}
                  onChange={(e) => setDuration(+e.target.value)}
                  className="h-1 w-full white-thumb"
                  aria-label="Required charging duration"
                />
              </div>

              {/* Grid constraint */}
              <div>
                <div className="mb-3 flex justify-between text-[10px] uppercase tracking-widest text-neutral-400">
                  <span>Grid constraint</span>
                  <span className="text-white">{gridConstraint}% maximum load</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={gridConstraint}
                  onChange={(e) => setGridConstraint(+e.target.value)}
                  className="h-1 w-full white-thumb"
                  aria-label="Grid constraint percentage"
                />
              </div>

              <button
                id="run-optimisation-btn"
                onClick={runOptimisation}
                disabled={phase === "running"}
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-black transition hover:-translate-y-0.5 hover:bg-neutral-100 disabled:opacity-50"
              >
                {phase === "running" ? "Optimising..." : "Run Optimisation"}
                <ArrowRight size={13} className="transition group-hover:translate-x-1" aria-hidden />
              </button>
            </div>
          </div>

          {/* ── Results ──────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-7 md:p-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                  Recommended charging plan
                </p>
                <h3 className="mt-2 text-2xl font-medium tracking-[-0.05em]">
                  {phase === "done" ? "Balanced for the grid" : "Awaiting simulation"}
                </h3>
              </div>
              <span className="rounded-full border border-white/20 px-3 py-1 font-mono text-[9px] uppercase">
                Simulation
              </span>
            </div>

            {/* Running steps */}
            <AnimatePresence mode="wait">
              {phase === "running" && (
                <motion.div
                  key="running"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 space-y-3"
                >
                  {steps.map((s, i) => (
                    <motion.div
                      key={s}
                      className={`flex items-center gap-3 font-mono text-xs transition ${
                        i <= stepIdx ? "text-white" : "text-neutral-600"
                      }`}
                      animate={i === stepIdx ? { opacity: [0.5, 1, 0.5] } : {}}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${i <= stepIdx ? "bg-white" : "bg-neutral-700"}`} />
                      {s}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {phase === "done" && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Table header */}
                  <div className="mt-6 grid grid-cols-4 border-b border-white/10 pb-3 font-mono text-[9px] uppercase tracking-widest text-neutral-500">
                    <span>EV</span><span>Station</span><span>Time</span><span className="text-right">Energy</span>
                  </div>
                  <div className="divide-y divide-white/10">
                    {results.map((r) => (
                      <div key={r.evId} className="grid grid-cols-4 py-4 font-mono text-xs">
                        <span>{r.evId}</span>
                        <span className="text-white">{r.stationName}</span>
                        <span className="text-neutral-400">{r.time}</span>
                        <span className="text-right text-neutral-400">{r.energy} kWh</span>
                      </div>
                    ))}
                  </div>

                  {/* Improvement stats */}
                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                    {[
                      { label: "Peak load reduced", val: "↓ 18%" },
                      { label: "Avg wait reduced", val: "↓ 37%" },
                      { label: "Utilisation improved", val: "↑ 24%" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                        <p className="font-mono text-lg font-semibold">{s.val}</p>
                        <p className="mt-1 text-[9px] uppercase tracking-widest text-neutral-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 flex h-40 items-center justify-center text-center text-sm text-neutral-600"
                >
                  Configure the parameters and click
                  <br />
                  "Run Optimisation" to begin.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
