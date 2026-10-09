"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="tentang" className="relative bg-white py-20 sm:py-28 lg:py-36 text-slate-900 overflow-hidden border-b border-slate-200">
      <div className="container relative px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          
          {/* Left Column: Image with Signature Yellow Circle Graphic Accent */}
          <Reveal className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Signature Yellow Graphic Circle Accent */}
            <div className="absolute -left-6 -top-6 sm:-left-8 sm:-top-8 lg:-left-10 lg:-top-10 h-44 w-44 sm:h-56 sm:w-56 lg:h-72 lg:w-72 rounded-full bg-[#FFD13B] pointer-events-none z-0" />
            
            {/* Main Rounded Photo */}
            <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl border-4 border-white aspect-[4/3] bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
                alt="Tim Konsultan Byteshift Consulting berdiskusi"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </Reveal>

          {/* Right Column: Narrative & Action */}
          <Reveal className="flex flex-col items-start justify-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.12] tracking-tight text-[#06152D]">
              Tentang Byteshift
              <br />
              <span className="text-blue-600">Technology Consulting</span>
            </h2>

            <p className="mt-5 lg:mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 font-normal">
              Byteshift adalah konsultan teknologi dan rekayasa perangkat lunak strategis. Kami mendampingi korporasi, institusi, dan bisnis berkembang dalam mengatasi kendala sistem yang lambat, mengotomatisasi alur kerja manual, dan membangun platform digital yang siap menopang pertumbuhan jangka panjang.
            </p>

            <div className="mt-7 lg:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="flex items-center gap-3 text-sm sm:text-base lg:text-lg font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                <span>Efisiensi Operasional 40%+</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base lg:text-lg font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                <span>100% Kepemilikan Source Code</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base lg:text-lg font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                <span>Arsitektur Tahan Lonjakan Trafik</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base lg:text-lg font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                <span>Dukungan Teknis Siaga 24/7</span>
              </div>
            </div>

            <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 lg:px-9 py-6 text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
              >
                <Link href="/tentang" className="flex items-center gap-2">
                  <span>Pelajari Selengkapnya</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-8 py-6 text-sm sm:text-base"
              >
                <Link href="/portfolio">Lihat Studi Kasus</Link>
              </Button>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
