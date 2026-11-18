"use client";

import { ShieldCheck, Headphones, Lock, Zap, CheckCircle2 } from "lucide-react";

const trustPillars = [
  {
    icon: ShieldCheck,
    title: "Garansi Stabilitas 99.9%",
    desc: "Meniadakan risiko downtime & kerugian operasional bisnis Anda.",
    isHighlighted: false,
  },
  {
    icon: Headphones,
    title: "24/7 Dedicated Support",
    desc: "Tim principal engineer siaga menjaga kelancaran sistem setiap saat.",
    isHighlighted: true, // Signature blue highlight matching reference image
  },
  {
    icon: Lock,
    title: "100% Kerahasiaan (NDA)",
    desc: "Perlindungan data rahasia berstandar enterprise & terikat hukum.",
    isHighlighted: false,
  },
  {
    icon: Zap,
    title: "Solusi Cepat & Terukur",
    desc: "Arsitektur modern yang siap diskalakan seiring ekspansi bisnis.",
    isHighlighted: false,
  },
];

export default function HeroMetrics() {
  return (
    <section className="relative bg-steel-surface py-14 sm:py-20 lg:py-24 text-steel-text">
      <div className="container relative px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustPillars.map((pillar) => {
            const Icon = pillar.icon;
            if (pillar.isHighlighted) {
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#263448] to-steel-surface2 border border-steel-accent/40 p-6 sm:p-7 lg:p-8 shadow-[0_18px_50px_-20px_rgba(106,141,181,0.4)] text-steel-text transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl bg-steel-accent/25 text-steel-accent2 mb-4 lg:mb-5">
                    <Icon className="h-6 w-6 lg:h-7 lg:w-7" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg lg:text-xl font-extrabold text-steel-text">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm lg:text-[15px] leading-relaxed text-steel-soft">
                    {pillar.desc}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={pillar.title}
                className="rounded-2xl lg:rounded-3xl bg-steel-surface2 border border-white/[0.08] p-6 sm:p-7 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-steel-accent/40 hover:bg-steel-raise"
              >
                <div className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl bg-steel-accent/15 text-steel-accent2 mb-4 lg:mb-5">
                  <Icon className="h-6 w-6 lg:h-7 lg:w-7" />
                </div>
                <h3 className="font-display text-base sm:text-lg lg:text-xl font-extrabold text-steel-text">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm lg:text-[15px] leading-relaxed text-steel-muted">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
