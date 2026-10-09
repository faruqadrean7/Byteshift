"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicMediaUrl } from "@/lib/storage";
import type { Portfolio } from "@/types/database";

export default function PortfolioSlider({ items }: { items: Portfolio[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const count = items.length;

  const nextSlide = useCallback(() => {
    if (count <= 1) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count <= 1) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Autoplay
  useEffect(() => {
    if (isPaused || count <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, count]);

  if (!items.length) return null;

  const active = items[current];
  const cover = publicMediaUrl(active.cover_image);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: "easeOut" },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.35, ease: "easeIn" },
    }),
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Slider Card Frame */}
      <div className="overflow-hidden rounded-3xl border border-blue-500/20 bg-[#061233]/90 backdrop-blur-xl shadow-2xl shadow-black/50">
        <div className="relative min-h-[420px] p-5 sm:p-10 lg:p-14">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.id || current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]"
            >
              {/* Left Column: Case Study Narrative */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {active.category && (
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-300 shadow-sm">
                      {active.category}
                    </span>
                  )}
                  {active.client_name && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                      <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{active.client_name}</span>
                    </span>
                  )}
                </div>

                <h3 className="mt-3 sm:mt-4 font-display text-xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white">
                  {active.title}
                </h3>

                {active.short_desc && (
                  <p className="mt-3 sm:mt-4 text-xs sm:text-base leading-relaxed text-slate-300">
                    {active.short_desc}
                  </p>
                )}

                {/* Solution Guarantee Highlights */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-[11px] sm:text-xs font-semibold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Solusi Tuntas &amp; Live</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/50 px-3 py-1 text-[11px] sm:text-xs font-semibold text-cyan-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Garansi SLA 99.9%</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto rounded-full bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 px-7 py-5 text-sm sm:text-base"
                  >
                    <Link
                      href={`/portfolio/${active.slug}`}
                      className="flex items-center justify-center gap-2"
                    >
                      <span>Lihat Dampak &amp; Solusi Lengkap</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Visual Showcase */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-500/20 bg-[#03091a] shadow-lg">
                {cover ? (
                  <Image
                    src={cover}
                    alt={active.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#061233] to-[#0c2466] text-white p-8">
                    <span className="font-display text-4xl sm:text-5xl font-extrabold opacity-25">
                      {active.title.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030718]/70 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between border-t border-blue-500/20 bg-[#040b1e]/90 px-5 py-3.5 sm:px-10 sm:py-4">
          {/* Slide Indicator & Dots */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-300">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
            <div className="flex gap-1.5">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > current ? 1 : -1);
                    setCurrent(idx);
                  }}
                  aria-label={`Ke slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === idx
                      ? "w-7 bg-cyan-400 shadow-sm shadow-cyan-400/50"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Prev / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Slide sebelumnya"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-blue-500/30 bg-[#06143c] text-slate-200 shadow-sm transition-all hover:border-cyan-400 hover:bg-[#0c2360] hover:text-white active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide selanjutnya"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-blue-500/30 bg-[#06143c] text-slate-200 shadow-sm transition-all hover:border-cyan-400 hover:bg-[#0c2360] hover:text-white active:scale-95"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


