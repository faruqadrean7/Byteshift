"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const whatWeDoCards = [
  {
    title: "Sistem Informasi & ERP Enterprise",
    category: "Operational Efficiency",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    description: "Satukan inventaris, keuangan, dan puluhan cabang dalam satu dashboard kendali sentral tanpa data ganda.",
    caseHighlight: "Kendala: Rekap cabang manual & data terpisah",
    benefitHighlight: "Benefit: 0% selisih stok & laporan instan",
    isHighlighted: false,
    href: "/kontak",
  },
  {
    title: "Rekayasa Software & Portal Web Custom",
    category: "Core Capability",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    description: "Bangun platform digital berkecepatan tinggi yang stabil menampung lonjakan puluhan ribu pengguna bersamaan.",
    caseHighlight: "Kendala: Server lambat & software kaku",
    benefitHighlight: "Benefit: 100% Hak cipta kode & arsitektur scalable",
    isHighlighted: true, // Signature highlighted blue card matching reference image
    href: "/kontak",
  },
  {
    title: "Automasi Cerdas & Integrasi API",
    category: "Process Automation",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    description: "Hilangkan kerja manual berulang dan sambungkan sistem Anda dengan payment gateway, logistik, bank, dan perpajakan.",
    caseHighlight: "Kendala: Input data manual boros waktu",
    benefitHighlight: "Benefit: Efisiensi kerja naik hingga 40%+",
    isHighlighted: false,
    href: "/kontak",
  },
  {
    title: "IoT Industri & Cloud Architecture",
    category: "Smart Monitoring",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    description: "Monitoring mesin pabrik real-time 24/7 dan infrastruktur cloud tahan downtime dengan kepatuhan SLA 99.9%.",
    caseHighlight: "Kendala: Mesin mati mendadak & risiko downtime",
    benefitHighlight: "Benefit: Deteksi dini sensor & garansi SLA 99.9%",
    isHighlighted: false,
    href: "/kontak",
  },
];

export default function Packages({
  waNumber,
}: {
  waNumber?: string | null;
}) {
  return (
    <section id="layanan" className="relative bg-[#172A4C] py-20 sm:py-28 lg:py-36 text-slate-100 border-b border-blue-900/50 overflow-hidden">
      <div className="container relative px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar: "What We Do" on Left, "Lihat Semua Layanan" on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-10 sm:pb-12 border-b border-blue-800/40">
          <div>
            <div className="h-1.5 w-14 bg-[#4C9AED] mb-4 rounded-full" />
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-100">
              What We Do
            </h2>
          </div>
          <Link
            href="/#sektor"
            className="inline-flex items-center gap-2 text-sm lg:text-base font-bold text-[#4C9AED] hover:text-slate-100 transition-colors group"
          >
            <span>Lihat Seluruh Kapabilitas</span>
            <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Vertical Feature Cards */}
        <div className="mt-10 lg:mt-14 grid gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
          {whatWeDoCards.map((card) => {
            if (card.isHighlighted) {
              // Highlighted Vibrant Sky Blue Card (Matching reference design)
              return (
                <div
                  key={card.title}
                  className="flex flex-col justify-between rounded-2xl lg:rounded-3xl bg-[#4C9AED] p-7 lg:p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/40 text-slate-100 min-h-[420px] lg:min-h-[480px]"
                >
                  <div>
                    <span className="inline-block rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-100 backdrop-blur-md">
                      {card.category}
                    </span>
                    <h3 className="mt-5 font-display text-xl lg:text-2xl font-extrabold leading-snug text-slate-100">
                      {card.title}
                    </h3>
                    <p className="mt-3.5 text-sm lg:text-[15px] leading-relaxed text-blue-50">
                      {card.description}
                    </p>

                    {/* Executive Benefit Highlight */}
                    <div className="mt-6 space-y-2 border-t border-white/25 pt-4 text-xs lg:text-sm">
                      <div className="flex items-center gap-2.5 text-slate-100 font-semibold">
                        <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-slate-100 shrink-0" />
                        <span>{card.benefitHighlight}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/20">
                    <Button
                      asChild
                      className="w-full h-11 lg:h-12 rounded-full bg-white text-[#172A4C] hover:bg-blue-50 font-bold shadow-md hover:scale-[1.02] transition-all"
                    >
                      <Link href="/kontak" className="flex items-center justify-center gap-2 text-xs lg:text-sm">
                        <span>Konsultasi Solusi</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            }

            // Dark Image Background Card
            return (
              <div
                key={card.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl lg:rounded-3xl bg-[#1B3252] border border-blue-800/40 p-6 sm:p-7 lg:p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#4C9AED]/60 hover:shadow-2xl min-h-[420px] lg:min-h-[480px]"
              >
                {/* Photo Background with Dark Gradient Overlay */}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13203A] via-[#172A4C]/90 to-[#172A4C]/70" />

                <div className="relative z-10">
                  <span className="inline-block rounded-full bg-blue-900/80 border border-blue-700/50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-300 backdrop-blur-md">
                    {card.category}
                  </span>
                  <h3 className="mt-5 font-display text-lg lg:text-xl font-bold leading-snug text-slate-100 group-hover:text-[#4C9AED] transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-3.5 text-sm lg:text-[15px] leading-relaxed text-slate-300">
                    {card.description}
                  </p>

                  {/* Executive Benefit Highlight */}
                  <div className="mt-6 space-y-2 border-t border-blue-800/60 pt-4 text-xs lg:text-sm">
                    <div className="flex items-center gap-2.5 text-slate-200 font-medium">
                      <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-[#4C9AED] shrink-0" />
                      <span>{card.benefitHighlight}</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-8 pt-5 border-t border-blue-800/50">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-2 text-xs lg:text-sm font-bold text-[#4C9AED] group-hover:text-slate-100 transition-colors"
                  >
                    <span>Konsultasikan Kebutuhan Ini</span>
                    <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
