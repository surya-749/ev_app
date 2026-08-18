"use client";

import { motion } from "framer-motion";

const problems = [
  {
    num: "01",
    title: "Peak-hour congestion",
    body: "Charging demand concentrates during specific hours, creating gridlock across stations.",
  },
  {
    num: "02",
    title: "Uneven utilisation",
    body: "Some stations are overcrowded while others sit idle — wasted capacity everywhere.",
  },
  {
    num: "03",
    title: "Grid stress",
    body: "Simultaneous charging creates sudden local power demand spikes that destabilise the grid.",
  },
  {
    num: "04",
    title: "Blind recommendations",
    body: "Users are rarely told why one station or time slot is better than another.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProblemSection() {
  return (
    <section className="container py-28" aria-labelledby="problem-heading">
      <div className="max-w-3xl">
        <div className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
          <span className="h-px w-8 bg-[#0a0a0a]" aria-hidden />
          The infrastructure gap
        </div>
        <h2
          id="problem-heading"
          className="text-4xl font-semibold leading-[0.98] tracking-[-0.07em] md:text-6xl"
        >
          EV charging is growing faster than infrastructure intelligence.
        </h2>
      </div>

      <motion.div
        className="mt-16 grid gap-px overflow-hidden border border-[#e5e5e5] bg-[#e5e5e5] sm:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {problems.map((p) => (
          <motion.div
            key={p.num}
            variants={item}
            className="group bg-white p-7 transition hover:bg-[#f4f4f4]"
          >
            <span className="font-mono text-xs text-[#a3a3a3]">{p.num}</span>
            <h3 className="mt-20 text-xl font-medium tracking-[-0.04em]">{p.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#737373]">{p.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
