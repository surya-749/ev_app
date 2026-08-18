"use client";

import { useEffect, useState } from "react";
import { Zap, ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#stations", label: "Stations" },
  { href: "#optimise", label: "Optimisation" },
  { href: "#analytics", label: "Analytics" },
  { href: "#prototype", label: "Prototype" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-[#e5e5e5] bg-white/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
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

          {/* Desktop nav */}
          <div className="hidden items-center gap-7 md:flex" role="list">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                role="listitem"
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] transition hover:text-[#0a0a0a]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              id="demo-mode-toggle"
              onClick={() => setDemoMode((d) => !d)}
              aria-pressed={demoMode}
              className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#737373] sm:flex"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  demoMode ? "animate-pulse bg-[#0a0a0a]" : "bg-[#d4d4d4]"
                }`}
              />
              {demoMode ? "Demo Mode" : "Live Mode"}
            </button>

            <a
              href="#dashboard"
              id="open-dashboard-btn"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#0a0a0a] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[#292929]"
            >
              Open Dashboard
              <ArrowRight
                size={13}
                className="transition group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>

            {/* Hamburger */}
            <button
              className="ml-1 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Demo mode badge */}
      <AnimatePresence>
        {demoMode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white/90 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest shadow-lg backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0a0a0a]" />
            Simulation active
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[65px] z-40 border-b border-[#e5e5e5] bg-white/95 px-5 py-6 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-[#0a0a0a]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
