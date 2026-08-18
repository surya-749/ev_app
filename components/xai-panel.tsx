"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { xaiFeatures } from "@/lib/mock-data";
import { motion, useInView } from "framer-motion";

export default function XAIPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="analytics"
      className="container scroll-mt-20 py-28"
      aria-labelledby="xai-heading"
    >
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left copy */}
        <div>
          <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
            <span className="h-px w-8 bg-[#0a0a0a]" aria-hidden />
            Explainable intelligence
          </div>
          <h2
            id="xai-heading"
            className="text-4xl font-semibold tracking-[-0.07em] md:text-6xl"
          >
            AI decisions you can understand.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#737373]">
            Every recommendation comes with a plain-English reason, not a black box.
          </p>
        </div>

        {/* XAI breakdown */}
        <div
          className="rounded-2xl border border-[#e5e5e5] p-7 md:p-10"
          ref={ref}
        >
          {/* Header */}
          <div className="flex justify-between border-b border-[#e5e5e5] pb-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#737373]">
                Selected recommendation
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                Station B · 8:30 PM
              </h3>
            </div>
            <div className="text-right">
              <p className="font-mono text-3xl">94.2%</p>
              <p className="mt-1 text-[9px] uppercase tracking-widest text-[#737373]">
                AI confidence
              </p>
            </div>
          </div>

          {/* Feature bars */}
          <div className="mt-8 space-y-6">
            {xaiFeatures.map((f, i) => (
              <div key={f.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-[#737373]">{f.label}</span>
                  <span className="font-mono text-xs">+{f.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#f4f4f4]">
                  <motion.div
                    className="h-full rounded-full bg-[#0a0a0a]"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${f.value}%` } : { width: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI confidence badge */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#e5e5e5] px-4 py-2 text-[10px] uppercase tracking-widest">
            <Sparkles size={13} aria-hidden />
            AI confidence: 94.2%
          </div>

          {/* Plain English */}
          <p className="mt-6 border-t border-[#e5e5e5] pt-6 text-sm leading-7 text-[#737373]">
            Station B provides the best balance between charging availability, waiting
            time, and grid demand for your requested charging window. Lower congestion
            and grid stress make it the optimal selection.
          </p>
        </div>
      </div>
    </section>
  );
}
