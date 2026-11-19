"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Quote, ChevronLeft, ChevronRight, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicMediaUrl } from "@/lib/storage";
import type { Testimonial } from "@/types/database";

const sampleTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Hendro Wijaya",
    role: "Chief Operating Officer",
    company: "PT Logistik Nusantara",
    content: "Byteshift berhasil mengintegrasikan sistem ERP multi-cabang kami dalam waktu 3 bulan. Downtime yang dulu sering terjadi kini 100% teratasi dan operasional jauh lebih efisien.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    is_published: true,
    order_index: 0,
    created_at: new Date().toISOString(),
    project_id: null,
  },
  {
    id: "t2",
    name: "Dr. Amanda Santoso",
    role: "Direktur Pelayanan Medis",
    company: "RS Prima Medika",
    content: "Digitalisasi RME dan sistem antrean terpadu dari Byteshift sangat stabil dan patuh terhadap standar Kemenkes. Pasien tidak lagi menunggu lama dan audit rekam medis jadi sangat cepat.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    is_published: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    project_id: null,
  },
  {
    id: "t3",
    name: "Reza Pratama",
    role: "Head of Engineering",
    company: "FinTech Solusindo",
    content: "Kecepatan eksekusi tim Byteshift luar biasa. Arsitektur payment engine yang mereka bangun mampu menampung lonjakan transaksi jutaan request per hari dengan latensi sangat rendah.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    is_published: true,
    order_index: 2,
    created_at: new Date().toISOString(),
    project_id: null,
  },
];

export default function Testimonials({
  testimonials = [],
}: {
  testimonials?: Testimonial[];
}) {
  const items = testimonials.length > 0 ? testimonials : sampleTestimonials;
  const [startIndex, setStartIndex] = useState(0);

  const prev = () => {
    setStartIndex((prev) => (prev === 0 ? Math.max(0, items.length - 3) : prev - 1));
  };

  const next = () => {
    setStartIndex((prev) => (prev + 3 >= items.length ? 0 : prev + 1));
  };

  const visibleItems = items.slice(startIndex, startIndex + 3);
  // If fewer than 3, cycle around
  const displayItems =
    visibleItems.length < 3 && items.length >= 3
      ? [...visibleItems, ...items.slice(0, 3 - visibleItems.length)]
      : visibleItems;

  return (
    <section id="testimoni" className="relative bg-steel-base py-20 sm:py-28 lg:py-36 text-steel-text">
      <div className="container relative px-4 sm:px-6 lg:px-8">
        
        {/* Centered Classic Section Heading */}
        <div className="text-center max-w-2xl lg:max-w-3xl mx-auto">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-steel-accent2">
            Pengakuan Klien Kami
          </div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-steel-text">
            Client Testimonials
          </h2>
          <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-steel-muted leading-relaxed">
            Dengarkan langsung evaluasi para pimpinan perusahaan mengenai dampak nyata solusi teknologi bersama Byteshift.
          </p>
        </div>

        {/* Testimonials 3-Card Carousel with Side Arrow Controls */}
        <div className="relative mt-12 sm:mt-16 lg:mt-20">
          
          {/* Left Arrow Button */}
          <button
            onClick={prev}
            aria-label="Testimonial sebelumnya"
            className="absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-steel-accent hover:bg-steel-accent2 text-[#0b1220] shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={next}
            aria-label="Testimonial selanjutnya"
            className="absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-steel-accent hover:bg-steel-accent2 text-[#0b1220] shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <ChevronRight className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>

          {/* 3 Testimonial Cards */}
          <div className="grid gap-6 lg:gap-8 md:grid-cols-3 px-3 sm:px-6">
            {displayItems.map((t, idx) => (
              <div
                key={`${t.id || t.name}-${idx}`}
                className="flex flex-col justify-between rounded-2xl lg:rounded-3xl bg-steel-surface2 border border-white/[0.08] p-7 lg:p-8 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-steel-accent/40 relative"
              >
                <div>
                  {/* Quotation Mark Icon */}
                  <Quote className="h-10 w-10 lg:h-12 lg:w-12 text-steel-accent/30 mb-4 lg:mb-5" />

                  {/* Testimonial Quote */}
                  <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-steel-muted italic font-medium">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                {/* Client Avatar & Meta */}
                <div className="mt-8 lg:mt-10 flex items-center gap-4 border-t border-white/[0.08] pt-5 lg:pt-6">
                  <div className="relative h-12 w-12 lg:h-14 lg:w-14 shrink-0 overflow-hidden rounded-full border-2 border-steel-accent/50 bg-steel-raise">
                    {t.avatar_url ? (
                      <Image
                        src={publicMediaUrl(t.avatar_url)}
                        alt={t.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center font-bold text-sm lg:text-base text-steel-accent2 bg-steel-accent/15">
                        {t.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-display text-sm sm:text-base font-bold text-steel-text flex items-center gap-1.5">
                      <span>{t.name}</span>
                      <CheckCircle2 className="h-4 w-4 text-steel-accent2" />
                    </div>
                    <div className="text-xs sm:text-sm text-steel-faint font-medium">
                      {[t.role, t.company].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centered Action Button at Bottom */}
        <div className="mt-12 lg:mt-16 text-center">
          <Button
            asChild
            className="h-13 sm:h-14 lg:h-16 rounded-full bg-steel-accent hover:bg-steel-accent2 text-[#0b1220] font-bold px-8 sm:px-10 lg:px-12 text-sm sm:text-base lg:text-lg shadow-md shadow-black/20 transition-all hover:scale-105"
          >
            <Link href="/kontak" className="flex items-center gap-2.5">
              <span>Konsultasikan Kebutuhan Anda</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
