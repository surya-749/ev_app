"use client";

import { motion } from "framer-motion";
import { Cpu, Radio } from "lucide-react";
import IotPanel from "./iot-panel";

const pipeline = [
  { id: "CURRENT SENSOR", icon: Radio },
  { id: "ESP32", icon: Cpu },
  { id: "LOAD MONITOR", icon: Radio },
  { id: "AI DECISION", icon: Cpu },
  { id: "RELAY CONTROL", icon: Radio },
  { id: "CHARGING LOAD", icon: Cpu },
];

export default function PrototypeSection() {
  return (
    <section
      id="prototype"
      className="scroll-mt-20 border-y border-[#e5e5e5] bg-[#f4f4f4]/40"
      aria-labelledby="prototype-heading"
    >
      <div className="container py-28">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">

          {/* ── Left: copy + pipeline ─────────────────────────────────── */}
          <div>
            <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
              <span className="h-px w-8 bg-[#0a0a0a]" aria-hidden />
              Physical intelligence layer
            </div>
            <h2
              id="prototype-heading"
              className="text-4xl font-semibold tracking-[-0.07em] md:text-6xl"
            >
              Make the decision physical.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#737373]">
              A simulated ESP32 control layer shows how network intelligence becomes a
              real-world action — from AI prediction to relay control.
            </p>

            {/* Pipeline diagram */}
            <div className="mt-10 space-y-1">
              {pipeline.map((step, i) => (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full rounded-lg border border-[#e5e5e5] bg-white px-5 py-3 text-center"
                  >
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest">
                      {step.id}
                    </span>
                  </motion.div>
                  {i < pipeline.length - 1 && (
                    <div className="mx-auto h-4 w-px bg-[#e5e5e5] relative">
                      <motion.div
                        className="absolute inset-0 bg-[#0a0a0a]"
                        initial={{ scaleY: 0, transformOrigin: "top" }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 + 0.25, duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Hardware specs */}
            <div className="mt-8 grid grid-cols-2 gap-2">
              {["ESP32", "Current Sensor", "Voltage Sensor", "Relay Module", "OLED Display", "Sim. EV Load"].map((hw) => (
                <div
                  key={hw}
                  className="rounded-lg border border-[#e5e5e5] bg-white px-3 py-2 text-center text-[9px] font-semibold uppercase tracking-widest text-[#737373]"
                >
                  {hw}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: live IoT panel ─────────────────────────────────── */}
          <IotPanel />
        </div>
      </div>
    </section>
  );
}
