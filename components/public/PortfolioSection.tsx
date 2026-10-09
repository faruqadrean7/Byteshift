"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicMediaUrl } from "@/lib/storage";
import type { Portfolio } from "@/types/database";

const samplePortfolio: Portfolio[] = [
  {
    id: "p1",
    slug: "erp-distribusi-nusantara",
    title: "Sistem ERP Sentral & Sinkronisasi 42 Gudang",
    category: "ERP & Supply Chain",
    client_name: "PT Nusantara Prima",
    year: 2026,
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    short_desc: "Menghubungkan inventaris multi-cabang secara real-time, meniadakan selisih stok fisik, dan mempercepat pencatatan invoice sebesar 60%.",
    full_content: null,
    tech_stack: ["PostgreSQL", "Next.js", "Docker"],
    demo_url: null,
    project_url: null,
    metrics: null,
    is_featured: true,
    is_published: true,
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p2",
    slug: "simrs-rekam-medis-digital",
    title: "Rekam Medis Elektronik (RME) & Antrean Terpadu RS",
    category: "Healthcare System",
    client_name: "RS Medika Utama",
    year: 2026,
    cover_image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    short_desc: "Digitalisasi 100% rekam medis pasien terintegrasi SatuSehat & BPJS, memangkas waktu tunggu rawat jalan dari 45 menit menjadi 8 menit.",
    full_content: null,
    tech_stack: ["HL7 FHIR", "PostgreSQL", "Cloud"],
    demo_url: null,
    project_url: null,
    metrics: null,
    is_featured: true,
    is_published: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "p3",
    slug: "fintech-payment-engine",
    title: "High-Throughput Payment Engine & Verifikasi KYC",
    category: "Fintech Platform",
    client_name: "PayDigital Corp",
    year: 2026,
    cover_image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    gallery: [],
    short_desc: "Arsitektur pemrosesan transaksi berkapasitas 5.000 TPS dengan verifikasi identitas AI otomatis berstandar keamanan PCI-DSS.",
    full_content: null,
    tech_stack: ["Golang", "PostgreSQL", "Redis"],
    demo_url: null,
    project_url: null,
    metrics: null,
    is_featured: true,
    is_published: true,
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function PortfolioSection({ items = [] }: { items?: Portfolio[] }) {
  const displayItems = items.length > 0 ? items.slice(0, 3) : samplePortfolio;

  return (
    <section id="portfolio" className="relative bg-white py-20 sm:py-28 lg:py-36 text-slate-900 border-b border-slate-200">
      <div className="container relative px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 sm:pb-12 border-b border-slate-200">
          <div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-600">
              Rekam Jejak Implementasi
            </div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#06152D]">
              Our Case Study
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="self-start sm:self-auto h-11 lg:h-12 rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-blue-600 font-bold px-6 lg:px-8 shadow-sm transition-all text-xs sm:text-sm lg:text-base"
          >
            <Link href="/portfolio" className="flex items-center gap-2">
              <span>Lihat Semua Studi Kasus</span>
              <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
            </Link>
          </Button>
        </div>

        {/* 3 Column Case Study Cards */}
        <div className="mt-10 lg:mt-14 grid gap-8 lg:gap-10 md:grid-cols-3">
          {displayItems.map((p) => {
            const cover = publicMediaUrl(p.cover_image);
            return (
              <Link
                key={p.id || p.slug}
                href={`/portfolio/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl lg:rounded-3xl bg-white border border-slate-200 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-300"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-blue-50 font-bold text-blue-600 text-lg">
                      {p.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 lg:top-4 lg:left-4 rounded-full bg-slate-900/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    {p.category}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 lg:p-8 flex flex-1 flex-col justify-between">
                  <div>
                    {p.client_name && (
                      <div className="flex items-center gap-1.5 text-xs lg:text-sm text-slate-500 font-semibold mb-2.5">
                        <Building2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-blue-600" />
                        <span>{p.client_name}</span>
                      </div>
                    )}
                    <h3 className="font-display text-lg lg:text-xl xl:text-2xl font-bold leading-snug text-[#06152D] group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-3.5 line-clamp-3 text-sm sm:text-base leading-relaxed text-slate-600">
                      {p.short_desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs sm:text-sm lg:text-base font-bold text-blue-600 group-hover:text-blue-700">
                      Baca Studi Kasus
                    </span>
                    <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
