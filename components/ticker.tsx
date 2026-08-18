"use client";

import { tickerItems } from "@/lib/mock-data";

export default function Ticker() {
  const items = [...tickerItems, ...tickerItems]; // duplicate for seamless loop

  return (
    <div
      className="overflow-hidden border-b border-[#e5e5e5] bg-[#0a0a0a] text-white"
      aria-label="Live network status ticker"
    >
      <div className="flex min-w-max animate-marquee gap-12 py-3 text-[9px] font-semibold uppercase tracking-[0.22em]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            {item}
            <b className="text-neutral-600">✳</b>
          </span>
        ))}
      </div>
    </div>
  );
}
