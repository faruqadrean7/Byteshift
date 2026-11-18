"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "./Reveal";

const differentiators = [
  {
    title: "01. Diagnosa Akar Masalah Tanpa Biaya Tersembunyi",
    desc: "Kami memetakan hambatan proses bisnis secara objektif sebelum penulisan baris kode pertama.",
  },
  {
    title: "02. 100% Kepemilikan Hak Cipta & Source Code",
    desc: "Seluruh aset kode dan database menjadi milik perusahaan Anda seutuhnya tanpa lisensi berulang.",
  },
  {
    title: "03. Jaminan Keamanan OWASP & Kepatuhan NDA",
    desc: "Perlindungan data rahasia bisnis terikat secara hukum dan diaudit secara berkala.",
  },
  {
    title: "04. Garansi SLA 99.9% & Respon Cepat 24/7",
    desc: "Dedicated engineering lead siaga menjaga kelancaran sistem pasca peluncuran.",
  },
];

export default function Process() {
  return (
    <section id="proses" className="relative bg-[#F8FAFC] py-20 sm:py-28 lg:py-36 text-slate-900 border-b border-slate-200 overflow-hidden">
      <div className="container relative px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          
          {/* Left Column: Image with Signature Yellow Circle Accent */}
          <Reveal className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Signature Yellow Graphic Circle Accent */}
            <div className="absolute -right-6 -top-6 sm:-right-8 sm:-top-8 lg:-right-10 lg:-top-10 h-44 w-44 sm:h-56 sm:w-56 lg:h-72 lg:w-72 rounded-full bg-[#FFD13B] pointer-events-none z-0" />
            
            {/* Main Rounded Photo */}
            <div className="relative z-10 overflow-hidden rounded-3xl lg:rounded-[2.5rem] shadow-2xl border-4 lg:border-8 border-white aspect-[4/3] bg-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80"
                alt="Presentasi strategi solusi teknologi Byteshift"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </Reveal>

          {/* Right Column: "Things You Didn't Know!" / Value Pillars */}
          <Reveal className="flex flex-col items-start justify-center">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-[#13203A]">
              Things You
              <br />
              <span className="text-[#4C9AED]">Didn&apos;t Know!</span>
            </h2>

            <div className="mt-8 space-y-4 lg:space-y-5 w-full">
              {differentiators.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="font-display text-base sm:text-lg lg:text-xl font-bold text-[#13203A] flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 lg:h-6 lg:w-6 text-[#4C9AED] shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <p className="mt-2 pl-7.5 lg:pl-8.5 text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 lg:mt-10">
              <Button
                asChild
                className="h-13 sm:h-14 lg:h-16 rounded-full bg-[#4C9AED] hover:bg-[#3E85D8] text-slate-100 font-bold px-8 sm:px-10 lg:px-12 text-sm sm:text-base lg:text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
              >
                <Link href="/kontak" className="flex items-center gap-2.5">
                  <span>Konsultasikan Kebutuhan Anda</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
