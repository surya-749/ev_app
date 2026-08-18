"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X } from "lucide-react";
import { stations } from "@/lib/mock-data";
import type { Station } from "@/lib/mock-data";

// Station marker positions on our SVG map canvas
const markerPositions: Record<string, { x: string; y: string }> = {
  A: { x: "24%", y: "37%" },
  B: { x: "57%", y: "47%" },
  C: { x: "76%", y: "28%" },
  D: { x: "39%", y: "72%" },
  E: { x: "82%", y: "74%" },
};

function StatusBadge({ status }: { status: Station["status"] }) {
  const map = {
    available: "Available",
    moderate: "Moderate",
    congested: "Congested",
  };
  return (
    <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-white">
      {map[status]}
    </span>
  );
}

// XAI Modal
function XAIModal({ onClose }: { onClose: () => void }) {
  const features = [
    { label: "Grid Load", rating: "Low", detail: "54% vs 72% network avg" },
    { label: "Waiting Time", rating: "Very Low", detail: "4 min estimated wait" },
    { label: "Availability", rating: "High", detail: "4 of 6 chargers free" },
    { label: "User Preference", rating: "Matched", detail: "Within preferred radius" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 backdrop-blur-sm sm:items-center"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-labelledby="xai-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          className="relative w-full max-w-lg rounded-2xl border border-[#e5e5e5] bg-white p-7 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#e5e5e5] transition hover:bg-[#f4f4f4]"
            aria-label="Close XAI modal"
          >
            <X size={14} />
          </button>

          <p className="text-[10px] uppercase tracking-widest text-[#737373]">Explainable AI · Station B</p>
          <h3 id="xai-modal-title" className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
            Why Station B?
          </h3>

          <div className="mt-6 space-y-4">
            {features.map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-4 rounded-lg border border-[#e5e5e5] p-4">
                <div>
                  <p className="text-xs font-semibold">{f.label}</p>
                  <p className="mt-0.5 text-xs text-[#737373]">{f.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#f4f4f4] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                  {f.rating}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-[#0a0a0a] p-5 text-white">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400">AI Confidence</p>
            <p className="mt-1 font-mono text-3xl">94.2%</p>
          </div>

          <p className="mt-5 text-sm leading-7 text-[#737373]">
            Station B provides the best balance between charging availability, waiting time, and grid
            demand for your requested charging window.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Station info popup on map
function StationPopup({ station, onClose }: { station: Station; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute bottom-5 left-5 right-5 rounded-xl border border-black/10 bg-white/95 p-5 shadow-xl backdrop-blur"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#737373]">Selected station</p>
          <p className="mt-1 text-xl font-semibold tracking-[-0.05em]">{station.name}</p>
          <p className="mt-0.5 text-xs text-[#737373]">{station.address}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={station.status} />
          <button onClick={onClose} aria-label="Close station info">
            <X size={12} className="text-[#737373]" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <span>
          <b className="block">{station.distance} km</b>
          <small className="text-[#737373]">distance</small>
        </span>
        <span>
          <b className="block">{station.availableChargers}/{station.chargerCount}</b>
          <small className="text-[#737373]">available</small>
        </span>
        <span>
          <b className="block">{station.waitTime} min</b>
          <small className="text-[#737373]">est. wait</small>
        </span>
      </div>
    </motion.div>
  );
}

export default function ChargingMap() {
  const [selected, setSelected] = useState<Station | null>(null);
  const [xaiOpen, setXaiOpen] = useState(false);
  const recommended = stations.find((s) => s.id === "B")!;

  return (
    <section id="stations" className="scroll-mt-20 border-y border-[#e5e5e5] bg-[#f4f4f4]/40">
      <div className="container py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

          {/* ── Left: info + recommendation ──────────────────────────────── */}
          <div>
            <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
              <span className="h-px w-8 bg-[#0a0a0a]" aria-hidden />
              Live station intelligence
            </div>
            <h2 className="text-4xl font-semibold tracking-[-0.07em] md:text-6xl">
              Find the smarter station.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#737373]">
              Real-time station intelligence, not just location.
            </p>

            {/* Recommendation card */}
            <div className="mt-10 rounded-2xl border border-[#e5e5e5] bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#737373]">
                    Recommended for you
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                    Station B
                  </h3>
                  <p className="mt-1 text-sm text-[#737373]">
                    {recommended.distance} km away · {recommended.waitTime} min wait
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-4xl font-semibold">
                    94<span className="text-lg text-[#737373]">/100</span>
                  </p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest">
                    Best match
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-4 border-y border-[#e5e5e5] py-4 text-xs">
                <span>
                  <b className="block text-xl">
                    {recommended.availableChargers}/{recommended.chargerCount}
                  </b>
                  <small className="text-[#737373]">chargers available</small>
                </span>
                <span>
                  <b className="block text-xl">{recommended.currentLoad}%</b>
                  <small className="text-[#737373]">predicted grid load</small>
                </span>
              </div>

              <button
                id="why-this-station-btn"
                onClick={() => setXaiOpen(true)}
                className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider underline underline-offset-4 transition hover:opacity-60"
              >
                Why this station? <Zap size={13} aria-hidden />
              </button>
            </div>
          </div>

          {/* ── Right: CSS/SVG map ────────────────────────────────────────── */}
          <div
            className="relative min-h-[500px] overflow-hidden rounded-2xl border border-[#e5e5e5]"
            style={{
              background: "#dededb",
              backgroundImage:
                "linear-gradient(25deg, transparent 48%, #c9c9c6 49%, #c9c9c6 51%, transparent 52%), linear-gradient(110deg, transparent 48%, #c5c5c2 49%, #c5c5c2 51%, transparent 52%)",
              backgroundSize: "140px 90px, 110px 150px",
            }}
          >
            {/* Map circles (decorative) */}
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/20" aria-hidden />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black ring-8 ring-black/10" aria-hidden />

            {/* Map label */}
            <div className="absolute left-6 top-6 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest backdrop-blur">
              Bengaluru · Live map
            </div>

            {/* Station markers */}
            {stations.map((st) => {
              const pos = markerPositions[st.id];
              const isRec = st.id === "B";
              const isSel = selected?.id === st.id;
              return (
                <button
                  key={st.id}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition hover:scale-110 ${isRec ? "z-10" : ""}`}
                  style={{ left: pos.x, top: pos.y }}
                  onClick={() => setSelected(isSel ? null : st)}
                  aria-label={`Select ${st.name}`}
                  aria-pressed={isSel}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-lg ${
                      isRec
                        ? "border-black bg-black text-white"
                        : "border-white bg-white text-black"
                    }`}
                  >
                    <Zap size={14} fill={isRec ? "white" : "none"} aria-hidden />
                  </span>
                  <span className="mt-1 block font-mono text-[9px] font-semibold text-center">
                    {st.id}
                  </span>
                </button>
              );
            })}

            {/* Station popup */}
            <AnimatePresence>
              {selected && (
                <StationPopup station={selected} onClose={() => setSelected(null)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* XAI modal */}
      <AnimatePresence>
        {xaiOpen && <XAIModal onClose={() => setXaiOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
