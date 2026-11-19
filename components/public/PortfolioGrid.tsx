"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Building2, ExternalLink, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicMediaUrl } from "@/lib/storage";
import type { Portfolio } from "@/types/database";
import { cn } from "@/lib/utils";

export default function PortfolioGrid({
  items,
  showFilter = true,
  limit,
}: {
  items: Portfolio[];
  showFilter?: boolean;
  limit?: number;
}) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.category));
    return ["Semua", ...Array.from(set)];
  }, [items]);

  const [active, setActive] = useState("Semua");
  const filtered =
    active === "Semua" ? items : items.filter((i) => i.category === active);
  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      {showFilter && categories.length > 2 && (
        <div className="mb-10 lg:mb-12 flex flex-wrap gap-2.5">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200",
                active === c
                  ? "border border-steel-accent/50 bg-steel-accent text-[#0b1220] shadow-lg shadow-black/25 scale-105"
                  : "border border-white/[0.08] bg-[#151D2D]/70 text-steel-muted hover:border-steel-accent/40 hover:bg-[#212D42] hover:text-steel-text"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((p) => {
          const cover = publicMediaUrl(p.cover_image);
          const screenshotCount = (p.gallery?.length || 0) + (p.cover_image ? 1 : 0);

          return (
            <Link
              key={p.id}
              href={`/portfolio/${p.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#151D2D]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-steel-accent/40 hover:bg-[#212D42] hover:shadow-2xl hover:shadow-black/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0E1420]">
                {cover ? (
                  <Image
                    src={cover}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#151D2D] to-[#283347] text-steel-text">
                    <span className="font-display text-4xl font-extrabold opacity-25">
                      {p.title.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1420]/80 via-transparent to-transparent" />
                
                {/* Top Right Arrow Trigger */}
                <div className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#151D2D]/90 border border-white/20 text-steel-text opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 shadow-lg">
                  <ArrowUpRight className="h-4 w-4" />
                </div>

                {/* Top Left Live Demo Indicator */}
                {p.demo_url && (
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-emerald-950/85 border border-emerald-500/40 px-3 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur-md shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Demo</span>
                  </div>
                )}

                {/* Bottom Left Category & Screenshot Count */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  {p.category && (
                    <div className="rounded-full border border-steel-accent/25 bg-steel-accent/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-steel-soft backdrop-blur-md">
                      {p.category}
                    </div>
                  )}
                  {screenshotCount > 1 && (
                    <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#1A2436]/85 px-2.5 py-1 text-[10px] font-bold text-steel-muted backdrop-blur-md">
                      <Layers className="h-3 w-3 text-steel-accent2" />
                      <span>{screenshotCount} Screenshot</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  {p.client_name && (
                    <div className="flex items-center gap-1.5 text-xs text-steel-muted mb-2">
                      <Building2 className="h-3.5 w-3.5 text-steel-accent2" />
                      <span>{p.client_name}</span>
                    </div>
                  )}
                  <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-steel-text transition-colors group-hover:text-steel-soft">
                    {p.title}
                  </h3>
                  {p.short_desc && (
                    <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-steel-muted">
                      {p.short_desc}
                    </p>
                  )}
                </div>

                {p.tech_stack && p.tech_stack.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.08] pt-4">
                    {p.tech_stack.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/[0.08] bg-[#0E1420] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-steel-muted"
                      >
                        {t}
                      </span>
                    ))}
                    {p.tech_stack.length > 4 && (
                      <span className="rounded-full border border-white/[0.08] bg-[#0E1420] px-2 py-0.5 text-[10px] font-medium text-steel-faint">
                        +{p.tech_stack.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {limit && items.length > limit && (
        <div className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/[0.08] bg-[#151D2D] text-steel-muted hover:bg-[#212D42] hover:text-steel-text px-8 py-6 text-sm sm:text-base font-semibold"
          >
            <Link href="/portfolio">Eksplorasi Seluruh Portfolio &amp; Studi Kasus →</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
