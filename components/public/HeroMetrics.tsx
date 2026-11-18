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
    <section className="relative bg-white py-14 sm:py-20 lg:py-24 text-slate-900 border-t border-slate-200">
      <div className="container relative px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustPillars.map((pillar) => {
            const Icon = pillar.icon;
            if (pillar.isHighlighted) {
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl lg:rounded-3xl bg-[#4C9AED] p-6 sm:p-7 lg:p-8 shadow-xl text-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20"
                >
                  <div className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl bg-white/20 text-slate-100 mb-4 lg:mb-5">
                    <Icon className="h-6 w-6 lg:h-7 lg:w-7" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg lg:text-xl font-extrabold text-slate-100">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm lg:text-[15px] leading-relaxed text-blue-50">
                    {pillar.desc}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={pillar.title}
                className="rounded-2xl lg:rounded-3xl bg-[#F8FAFC] border border-slate-200 p-6 sm:p-7 lg:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 mb-4 lg:mb-5">
                  <Icon className="h-6 w-6 lg:h-7 lg:w-7" />
                </div>
                <h3 className="font-display text-base sm:text-lg lg:text-xl font-extrabold text-[#13203A]">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm lg:text-[15px] leading-relaxed text-slate-600">
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
