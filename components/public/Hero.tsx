"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/types/database";

export default function Hero({ settings }: { settings: SiteSettings | null }) {
  const waNumber = settings?.whatsapp_number || "6282210810793";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Halo Byteshift, saya ingin konsultasi mengenai solusi kebutuhan sistem dan tantangan teknologi pada bisnis saya."
  )}`;

  return (
    <section className="relative overflow-hidden bg-[#0E1420] pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-52 lg:pb-44 text-steel-text min-h-[92vh] lg:min-h-[96vh] flex items-center justify-center">
      {/* 1. Full-Bleed Ambient Video Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-bg-poster.webp"
          className="h-full w-full object-cover object-center opacity-75 md:opacity-85 scale-100 transition-opacity duration-1000"
        >
          <source src="/ByteshiftLogoHeroSection.mp4" type="video/mp4" />
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Seamless Navy Vignettes & Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1420] via-[#0E1420]/50 to-[#0E1420]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1420]/85 via-transparent to-[#0E1420]/85" />
        
        {/* Soft Ambient Royal Glow */}
        <div className="absolute left-1/2 top-1/4 h-[350px] sm:h-[550px] lg:h-[700px] w-[350px] sm:w-[550px] lg:w-[700px] -translate-x-1/2 rounded-full bg-steel-accent/15 blur-[120px] sm:blur-[160px]" />
        <div className="absolute inset-0 grid-pattern opacity-[0.12]" />
      </div>

      {/* 2. Hero Content Container */}
      <div className="container relative z-10 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl lg:max-w-5xl xl:max-w-6xl text-center">
          {/* Punchy, High-Impact Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.5rem] font-extrabold leading-[1.08] tracking-tight text-steel-text"
          >
            Tuntaskan Kendala Sistem.{" "}
            <span className="text-steel-accent2">
              Wujudkan Solusi Nyata.
            </span>
          </motion.h1>

          {/* Simple, Punchy Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto mt-6 lg:mt-8 max-w-2xl lg:max-w-3xl xl:max-w-4xl text-base sm:text-xl lg:text-2xl leading-relaxed text-steel-soft font-normal"
          >
            {settings?.tagline ??
              "Bangun platform digital andal, otomatisasi alur kerja, dan percepat pertumbuhan bisnis Anda tanpa kerumitan teknis."}
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-9 sm:mt-11 lg:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-full bg-steel-accent hover:bg-steel-accent2 font-bold text-[#0b1220] text-base lg:text-lg shadow-lg shadow-black/25 transition-all hover:scale-105 h-14 lg:h-16 px-8 sm:px-10 lg:px-12"
            >
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5"
              >
                <span>Konsultasi Sekarang</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full border-white/20 bg-white/[0.08] text-steel-text text-base lg:text-lg font-semibold backdrop-blur-md hover:bg-white/15 hover:border-white/40 transition-all h-14 lg:h-16 px-8 sm:px-10 lg:px-12"
            >
              <Link href="/portfolio">Lihat Studi Kasus</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 3. Smooth Organic Curved SVG Wave at Bottom */}
      <div className="absolute -bottom-1 left-0 right-0 pointer-events-none overflow-hidden leading-none z-10">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 md:h-20 text-[#0E1420] preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,75 480,10 720,45 C960,80 1200,20 1440,55 L1440,80 L0,80 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}


