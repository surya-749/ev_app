"use client";

import { Zap } from "lucide-react";

const links = [
  { href: "#platform", label: "Platform" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#stations", label: "Stations" },
  { href: "#optimise", label: "Optimisation" },
  { href: "#prototype", label: "Prototype" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-white" aria-label="Site footer">
      <div className="container py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Brand */}
          <div>
            <a
              href="#top"
              className="flex items-center gap-2 text-sm font-bold tracking-[-0.04em]"
              aria-label="GRIDWISE home"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0a0a0a] text-white">
                <Zap size={13} fill="currentColor" aria-hidden />
              </span>
              GRIDWISE
            </a>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373]">
              Predict. Explain. Optimise. Charge Smarter.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] transition hover:text-[#0a0a0a]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-[#e5e5e5] pt-6 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a3a3a3] sm:flex-row sm:justify-between">
          <span>SIH 2026 · Problem Statement 86</span>
          <span>AI + XAI + Optimisation + IoT</span>
        </div>
      </div>
    </footer>
  );
}
