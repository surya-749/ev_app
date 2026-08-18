"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 20, scale: 0.96 },
  show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

// Animated network nodes
const nodes = [
  { id: "A", cx: "11%", cy: "52%", active: false },
  { id: "B", cx: "36%", cy: "18%", active: true },
  { id: "C", cx: "55%", cy: "56%", active: false },
  { id: "D", cx: "77%", cy: "24%", active: false },
  { id: "E", cx: "87%", cy: "69%", active: false },
];

export default function Hero() {
  return (
    <section
      id="platform"
      className="relative overflow-hidden border-b border-[#e5e5e5] pt-36 pb-0"
    >
      {/* Dot grid background */}
      <div className="dot-grid absolute inset-0 -z-10 opacity-60" aria-hidden />

      {/* Radial glow */}
      <div
        className="absolute right-[18%] top-20 -z-10 h-[500px] w-[500px] rounded-full bg-neutral-200/50 blur-3xl"
        aria-hidden
      />

      <div className="container pb-24">
        <div className="grid items-center gap-16 lg:grid-cols-[0.88fr_1.12fr]">

          {/* ── Left: copy ──────────────────────────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Pill */}
            <motion.div
              variants={fadeUp}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white/80 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em]"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0a0a0a]" />
              AI-powered EV infrastructure
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="max-w-2xl text-6xl font-semibold leading-[0.9] tracking-[-0.09em] sm:text-8xl"
            >
              Predict.
              <br />
              Explain.
              <br />
              <span className="text-[#737373]">Optimise.</span>
              <br />
              Charge smarter.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-lg text-base leading-7 text-[#737373]"
            >
              Intelligent charging infrastructure for a grid-ready EV future.
              Predict demand, balance the network, and understand every AI decision.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
              <a
                href="#story"
                id="explore-live-system-btn"
                className="group inline-flex items-center gap-3 rounded-full bg-[#0a0a0a] px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[#292929]"
              >
                Explore live system
                <ArrowRight size={13} className="transition group-hover:translate-x-1" aria-hidden />
              </a>
              <a
                href="#architecture"
                id="how-it-works-btn"
                className="group inline-flex items-center gap-3 rounded-full border border-[#e5e5e5] bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#0a0a0a] transition hover:-translate-y-0.5 hover:border-[#0a0a0a]"
              >
                View how it works
                <ArrowRight size={13} className="transition group-hover:translate-x-1" aria-hidden />
              </a>
            </motion.div>

            {/* Tech tags */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex gap-6 border-t border-[#e5e5e5] pt-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#737373]"
            >
              <span>ML Forecasting</span>
              <span>Optimisation</span>
              <span>XAI</span>
              <span>IoT</span>
            </motion.div>
          </motion.div>

          {/* ── Right: dashboard mockup ──────────────────────────────────── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="show"
          >
            <div className="relative aspect-[1.08] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#111] p-5 text-white shadow-2xl shadow-black/20 sm:p-7">
              {/* inner dot grid */}
              <div
                className="absolute inset-0 opacity-25"
                style={{ backgroundImage: "radial-gradient(#aaa 0.7px, transparent 0.7px)", backgroundSize: "18px 18px" }}
                aria-hidden
              />

              {/* Header */}
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">Live charging network</p>
                  <p className="mt-2 text-2xl font-medium tracking-[-0.06em]">Network intelligence</p>
                </div>
                <span className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-neutral-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  Live
                </span>
              </div>

              {/* Stats */}
              <div className="relative mt-8 grid grid-cols-2 gap-3 border-y border-white/10 py-4 sm:grid-cols-4">
                {[
                  { label: "Stations", val: "12" },
                  { label: "Chargers", val: "48" },
                  { label: "Sessions", val: "31" },
                  { label: "Load", val: "68%" },
                ].map((s) => (
                  <div key={s.label} className="border-l border-white/10 pl-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{s.label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-[-0.06em]">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Animated network graph */}
              <div className="relative mt-8 flex h-36 items-center justify-center">
                <svg className="absolute h-full w-full" viewBox="0 0 400 150" fill="none" aria-hidden>
                  {/* background path */}
                  <path
                    d="M44 78L145 27L218 81L311 36M218 81L350 97"
                    stroke="#444"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                  {/* animated flow */}
                  <path
                    d="M44 78L145 27L218 81L311 36"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeDasharray="80 180"
                  >
                    <animate attributeName="stroke-dashoffset" from="260" to="0" dur="3s" repeatCount="indefinite" />
                  </path>
                </svg>

                {nodes.map((n) => (
                  <div
                    key={n.id}
                    className={`absolute flex h-8 w-8 items-center justify-center rounded-full border text-[10px] transition ${
                      n.active
                        ? "border-white bg-white text-black"
                        : "border-neutral-600 bg-[#181818] text-neutral-300"
                    }`}
                    style={{ left: n.cx, top: n.cy }}
                    aria-label={`Station ${n.id}`}
                  >
                    {n.id}
                  </div>
                ))}
              </div>

              {/* Info cards */}
              <div className="relative grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-[9px] text-neutral-500">Demand forecast</p>
                  <p className="mt-1 font-mono text-sm">
                    +18%{" "}
                    <span className="text-[9px] text-neutral-500">next hour</span>
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-[9px] text-neutral-500">Grid load</p>
                  <p className="mt-1 font-mono text-sm">64%</p>
                </div>
                <div className="rounded-lg border border-white bg-white p-3 text-black">
                  <p className="text-[9px] text-neutral-500">Recommended</p>
                  <p className="mt-1 font-mono text-sm">
                    Station B{" "}
                    <span className="text-[9px]">· 8:30</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
