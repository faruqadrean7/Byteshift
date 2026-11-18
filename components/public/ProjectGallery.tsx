"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Layers,
} from "lucide-react";
import { publicMediaUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function ProjectGallery({
  coverImage,
  gallery = [],
  title,
}: {
  coverImage?: string | null;
  gallery?: string[];
  title: string;
}) {
  // Combine cover image and gallery, deduplicating and filtering empty strings
  const allImages = Array.from(
    new Set([coverImage, ...gallery].filter(Boolean) as string[])
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = useCallback(() => {
    setActiveIndex((curr) => (curr === 0 ? allImages.length - 1 : curr - 1));
  }, [allImages.length]);

  const next = useCallback(() => {
    setActiveIndex((curr) => (curr === allImages.length - 1 ? 0 : curr + 1));
  }, [allImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, prev, next]);

  if (!allImages.length) return null;

  const currentImage = allImages[activeIndex];

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-blue-500/20 bg-[#0D1628] shadow-2xl">
        <Image
          src={publicMediaUrl(currentImage)}
          alt={`${title} - Screenshot ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1324]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Counter Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-blue-500/30 bg-[#152340]/85 px-3.5 py-1.5 text-xs font-bold text-sky-300 backdrop-blur-md shadow-lg">
          <Layers className="h-3.5 w-3.5" />
          <span>
            {activeIndex + 1} / {allImages.length} Screenshot
          </span>
        </div>

        {/* Fullscreen Lightbox Trigger Button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Lihat resolusi penuh"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/30 bg-[#152340]/85 text-slate-100 backdrop-blur-md transition-all hover:bg-blue-500 hover:scale-110 shadow-lg"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Side Navigation Arrows (if multiple images) */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Screenshot sebelumnya"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#152340]/80 text-slate-100 backdrop-blur-md transition-all hover:bg-blue-500 hover:scale-110 active:scale-95 shadow-xl opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Screenshot selanjutnya"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#152340]/80 text-slate-100 backdrop-blur-md transition-all hover:bg-blue-500 hover:scale-110 active:scale-95 shadow-xl opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip (if multiple images) */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent">
          {allImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative aspect-[16/10] w-24 sm:w-32 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200",
                  isSelected
                    ? "border-sky-400/60 ring-2 ring-sky-400/30 scale-105 shadow-md shadow-sky-500/15"
                    : "border-blue-900/60 opacity-60 hover:opacity-100 hover:border-blue-500"
                )}
              >
                <Image
                  src={publicMediaUrl(img)}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Tutup pratinjau penuh"
            className="absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-100 backdrop-blur-md transition-all hover:bg-red-600 hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Lightbox Counter */}
          <div className="absolute top-6 left-6 z-50 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-slate-100 backdrop-blur-md">
            {title} ({activeIndex + 1} / {allImages.length})
          </div>

          {/* Lightbox Main Image */}
          <div className="relative h-[85vh] w-[90vw] max-w-6xl">
            <Image
              src={publicMediaUrl(currentImage)}
              alt={`${title} - Fullscreen ${activeIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation Controls inside Lightbox */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Sebelumnya"
                className="absolute left-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-100 backdrop-blur-md transition-all hover:bg-blue-500 hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Selanjutnya"
                className="absolute right-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-100 backdrop-blur-md transition-all hover:bg-blue-500 hover:scale-110 active:scale-95"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
