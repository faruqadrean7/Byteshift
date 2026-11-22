"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, TrendingUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/utils";
import type { Sector } from "@/types/database";

interface SectorItem {
  id: string;
  name: string;
  categoryTag: string;
  filterGroup: "finance" | "industry" | "health" | "public";
  image: string;
  executiveSummary: string;
  keyBenefits: [string, string];
  impactMetric: string;
  href: string;
}

const sectorsData: SectorItem[] = [
  {
    id: "fintech",
    name: "Perbankan & FinTech",
    categoryTag: "Financial Services",
    filterGroup: "finance",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    executiveSummary: "Payment engine throughput tinggi berlatensi rendah untuk meniadakan bottleneck transaksi dan memenuhi standar regulasi OJK & BI.",
    keyBenefits: [
      "Latensi pemrosesan transaksi <200ms dengan garansi 99.99% SLA",
      "Enkripsi bertingkat & otomatisasi rekonsiliasi data tanpa selisih",
    ],
    impactMetric: "99.99% SLA · <200ms",
    href: "/kontak",
  },
  {
    id: "manufacturing",
    name: "Manufaktur & Smart Factory",
    categoryTag: "Industrial IoT",
    filterGroup: "industry",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    executiveSummary: "Telemetri sensor mesin real-time untuk mencegah unplanned downtime serta menyinkronkan rantai pasok bahan baku pabrik.",
    keyBenefits: [
      "Deteksi dini anomali sensor mesin secara preventif 24/7",
      "Peningkatan efisiensi operasional pabrik dan logistik +35%",
    ],
    impactMetric: "Zero Downtime · +35% Efisiensi",
    href: "/kontak",
  },
  {
    id: "healthcare",
    name: "Kesehatan & Rumah Sakit",
    categoryTag: "Healthcare & SIMRS",
    filterGroup: "health",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    executiveSummary: "SIMRS satu pintu berstandar HL7/FHIR yang mengintegrasikan rekam medis elektronik (RME), antrean terpadu, dan klaim BPJS.",
    keyBenefits: [
      "Pemangkasan waktu antrean loket pasien rawat jalan hingga 80%",
      "Kepatuhan 100% regulasi SatuSehat Kementerian Kesehatan RI",
    ],
    impactMetric: "Waktu Tunggu -80% · 100% RME",
    href: "/kontak",
  },
  {
    id: "retail",
    name: "Enterprise & Retail Distribusi",
    categoryTag: "Commerce & ERP",
    filterGroup: "finance",
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
    executiveSummary: "Penyatuan operasional multi-cabang dan inventaris gudang dalam satu sistem ERP sentral terpadu tanpa selisih stok fisik.",
    keyBenefits: [
      "Sinkronisasi stok real-time ke seluruh channel penjualan & POS",
      "Otomatisasi laporan laba rugi konsolidasi multi-perusahaan",
    ],
    impactMetric: "0% Selisih Stok · Rekap Instan",
    href: "/kontak",
  },
  {
    id: "logistics",
    name: "Logistik & Fleet Management",
    categoryTag: "Smart Logistics",
    filterGroup: "industry",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    executiveSummary: "Optimasi rute armada cerdas dan telematika GPS live untuk menekan konsumsi BBM serta mempercepat manifest pengiriman.",
    keyBenefits: [
      "Penghematan biaya bahan bakar armada kendaraan hingga 25%",
      "Pelacakan pengiriman real-time & e-POD digital instan",
    ],
    impactMetric: "Hemat BBM 25% · Tracking Live",
    href: "/kontak",
  },
  {
    id: "education",
    name: "Pendidikan & Kampus Digital",
    categoryTag: "EdTech & Portal",
    filterGroup: "public",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    executiveSummary: "Portal akademik berbasis cloud auto-scaling yang stabil menampung lonjakan puluhan ribu mahasiswa serentak pada periode KRS.",
    keyBenefits: [
      "Daya tampung 50.000+ user online bersamaan tanpa server crash",
      "Portal satu pintu terintegrasi modul akademik, SPP, & e-learning",
    ],
    impactMetric: "50.000+ User · Zero Crash",
    href: "/kontak",
  },
  {
    id: "government",
    name: "Sektor Publik & GovTech",
    categoryTag: "Smart Government",
    filterGroup: "public",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    executiveSummary: "Modernisasi sistem perizinan dan layanan publik 24/7 berbasis arsitektur SPBE nasional dengan standar keamanan data BSSN.",
    keyBenefits: [
      "Pemangkasan birokrasi dan waktu pemrosesan dokumen hingga 70%",
      "Enkripsi data kependudukan dan integrasi tanda tangan digital resmi",
    ],
    impactMetric: "Layanan 24/7 · Alur -70%",
    href: "/kontak",
  },
  {
    id: "energy",
    name: "Energi, Tambang & Utilitas",
    categoryTag: "Industrial Remote",
    filterGroup: "industry",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    executiveSummary: "Monitoring telemetri IoT edge offline-first untuk lokasi operasional terpencil guna mencegah kerusakan aset bernilai tinggi.",
    keyBenefits: [
      "Sinkronisasi otomatis saat konektivitas pulih tanpa data loss",
      "Pemantauan parameter K3 dan peringatan dini kerusakan mesin",
    ],
    impactMetric: "Offline-First · Proteksi Aset",
    href: "/kontak",
  },
];

interface SectorsProps {
  initialSectors?: Sector[];
  waNumber?: string | null;
}

export default function Sectors({ initialSectors, waNumber }: SectorsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const headerWaMessage =
    "Halo Tim Konsultan Byteshift, kami ingin menjadwalkan sesi konsultasi teknologi untuk sektor industri perusahaan kami.";
  const headerWaLink = buildWhatsAppLink(headerWaMessage, waNumber ?? undefined);

  const sectors: SectorItem[] =
    initialSectors && initialSectors.length > 0
      ? initialSectors.map((s) => ({
          id: s.id,
          name: s.name,
          categoryTag: s.category_tag,
          filterGroup: s.filter_group as "finance" | "industry" | "health" | "public",
          image: s.image,
          executiveSummary: s.executive_summary,
          keyBenefits: [
            s.key_benefits[0] || "",
            s.key_benefits[1] || "",
          ] as [string, string],
          impactMetric: s.impact_metric,
          href: s.href || "/kontak",
        }))
      : sectorsData;

  const filteredSectors =
    activeFilter === "all"
      ? sectors
      : sectors.filter((s) => s.filterGroup === activeFilter);

  return (
    <section id="sektor" className="relative bg-steel-surface py-20 sm:py-28 lg:py-36 text-steel-text">
      <div className="container relative px-4 sm:px-6">

        {/* Executive Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-white/[0.08]">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-steel-text tracking-tight">
              Solusi Teruji di Berbagai Sektor
            </h2>
            <p className="mt-4 text-base sm:text-lg lg:text-xl text-steel-muted leading-relaxed">
              Arsitektur rekayasa software dan konsultasi teknologi yang dirancang khusus menjawab regulasi ketat, kompleksitas data, dan target efisiensi bisnis Anda.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="self-start lg:self-auto rounded-full bg-steel-accent hover:bg-steel-accent2 text-[#0b1220] font-bold h-13 lg:h-14 px-8 py-4 text-sm sm:text-base shadow-md transition-all hover:scale-105 shrink-0"
          >
            <a
              href={headerWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Jadwalkan Konsultasi Sektor</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Filter Category Pills */}
        <div className="mt-8 lg:mt-10 flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setActiveFilter("all")}
            className={`rounded-full px-5 lg:px-6 py-2.5 lg:py-3 text-xs sm:text-sm font-bold transition-all ${
              activeFilter === "all"
                ? "bg-steel-accent text-[#0b1220] shadow-md scale-105"
                : "bg-steel-surface2 border border-white/[0.08] text-steel-muted hover:bg-steel-raise hover:text-steel-text"
            }`}
          >
            Semua Sektor ({sectors.length})
          </button>
          <button
            onClick={() => setActiveFilter("finance")}
            className={`rounded-full px-5 lg:px-6 py-2.5 lg:py-3 text-xs sm:text-sm font-bold transition-all ${
              activeFilter === "finance"
                ? "bg-steel-accent text-[#0b1220] shadow-md scale-105"
                : "bg-steel-surface2 border border-white/[0.08] text-steel-muted hover:bg-steel-raise hover:text-steel-text"
            }`}
          >
            Perbankan &amp; Enterprise
          </button>
          <button
            onClick={() => setActiveFilter("industry")}
            className={`rounded-full px-5 lg:px-6 py-2.5 lg:py-3 text-xs sm:text-sm font-bold transition-all ${
              activeFilter === "industry"
                ? "bg-steel-accent text-[#0b1220] shadow-md scale-105"
                : "bg-steel-surface2 border border-white/[0.08] text-steel-muted hover:bg-steel-raise hover:text-steel-text"
            }`}
          >
            Manufaktur, IoT &amp; Logistik
          </button>
          <button
            onClick={() => setActiveFilter("health")}
            className={`rounded-full px-5 lg:px-6 py-2.5 lg:py-3 text-xs sm:text-sm font-bold transition-all ${
              activeFilter === "health"
                ? "bg-steel-accent text-[#0b1220] shadow-md scale-105"
                : "bg-steel-surface2 border border-white/[0.08] text-steel-muted hover:bg-steel-raise hover:text-steel-text"
            }`}
          >
            Kesehatan &amp; SIMRS
          </button>
          <button
            onClick={() => setActiveFilter("public")}
            className={`rounded-full px-5 lg:px-6 py-2.5 lg:py-3 text-xs sm:text-sm font-bold transition-all ${
              activeFilter === "public"
                ? "bg-steel-accent text-[#0b1220] shadow-md scale-105"
                : "bg-steel-surface2 border border-white/[0.08] text-steel-muted hover:bg-steel-raise hover:text-steel-text"
            }`}
          >
            Sektor Publik &amp; Edukasi
          </button>
        </div>

        {/* Sectors Cards Grid - Clean Corporate Architecture */}
        <div className="mt-9 lg:mt-12 grid gap-7 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredSectors.map((sector) => {
            const sectorWaMessage = `Halo Tim Konsultan Byteshift, kami tertarik berkonsultasi mengenai solusi arsitektur sistem pada sektor *${sector.name}* (${sector.categoryTag}). Mohon informasi ketersediaan jadwal diskusi awal.`;
            const targetHref =
              sector.href && sector.href !== "/kontak"
                ? sector.href
                : buildWhatsAppLink(sectorWaMessage, waNumber ?? undefined);
            const isExternal = targetHref.startsWith("http");

            return (
              <div
                key={sector.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-steel-surface2 border border-white/[0.08] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-steel-accent/40"
              >
                <div>
                  {/* Image Cover with Category & Impact Pill */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-steel-raise">
                    <Image
                      src={sector.image}
                      alt={sector.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1420]/85 via-transparent to-black/30" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-3 left-3 rounded-full bg-steel-base/80 border border-white/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-steel-text backdrop-blur-md">
                      {sector.categoryTag}
                    </div>

                    {/* Impact Metric Badge on Image Bottom */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-extrabold text-[#13203A] shadow-sm">
                        <TrendingUp className="h-3.5 w-3.5 text-steel-accentink" />
                        <span>{sector.impactMetric}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 lg:p-7">
                    <h3 className="font-display text-lg lg:text-xl font-bold leading-snug text-steel-text group-hover:text-steel-accent2 transition-colors">
                      {sector.name}
                    </h3>

                    <p className="mt-3 text-sm lg:text-[15px] leading-relaxed text-steel-muted">
                      {sector.executiveSummary}
                    </p>

                    {/* Clean Executive Bullet Highlights */}
                    <div className="mt-6 space-y-3 border-t border-white/[0.08] pt-5">
                      {sector.keyBenefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs lg:text-sm text-steel-muted">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-steel-accent/15 text-steel-accent2">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                          <span className="leading-snug">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="px-6 lg:px-7 pb-6 lg:pb-7 pt-2">
                  {isExternal ? (
                    <a
                      href={targetHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-xs sm:text-sm font-bold text-steel-text hover:bg-steel-accent hover:border-steel-accent hover:text-[#0b1220] transition-all group/btn"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-steel-accent2 group-hover/btn:text-[#0b1220] transition-colors" />
                        <span>Konsultasi Sektor Ini</span>
                      </div>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 text-steel-accent2 group-hover/btn:text-[#0b1220]" />
                    </a>
                  ) : (
                    <Link
                      href={targetHref}
                      className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-xs sm:text-sm font-bold text-steel-text hover:bg-steel-accent hover:border-steel-accent hover:text-[#0b1220] transition-all group/btn"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-steel-accent2 group-hover/btn:text-[#0b1220] transition-colors" />
                        <span>Konsultasi Sektor Ini</span>
                      </div>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 text-steel-accent2 group-hover/btn:text-[#0b1220]" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
