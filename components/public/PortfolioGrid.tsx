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
                  ? "border border-cyan-400 bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105"
                  : "border border-blue-500/20 bg-[#061233]/70 text-slate-300 hover:border-cyan-400/50 hover:bg-[#081844] hover:text-white"
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
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-blue-500/20 bg-[#061233]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:bg-[#081844] hover:shadow-2xl hover:shadow-black/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#03091a]">
                {cover ? (
                  <Image
                    src={cover}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#061233] to-[#0c2466] text-white">
                    <span className="font-display text-4xl font-extrabold opacity-25">
                      {p.title.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030718]/80 via-transparent to-transparent" />
                
                {/* Top Right Arrow Trigger */}
                <div className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#061233]/90 border border-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 shadow-lg">
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
                    <div className="rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                      {p.category}
                    </div>
                  )}
                  {screenshotCount > 1 && (
                    <div className="flex items-center gap-1 rounded-full border border-blue-500/30 bg-[#06143c]/85 px-2.5 py-1 text-[10px] font-bold text-slate-200 backdrop-blur-md">
                      <Layers className="h-3 w-3 text-cyan-400" />
                      <span>{screenshotCount} Screenshot</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  {p.client_name && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-2">
                      <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{p.client_name}</span>
                    </div>
                  )}
                  <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-white transition-colors group-hover:text-cyan-300">
                    {p.title}
                  </h3>
                  {p.short_desc && (
                    <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                      {p.short_desc}
                    </p>
                  )}
                </div>

                {p.tech_stack && p.tech_stack.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-blue-500/20 pt-4">
                    {p.tech_stack.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-blue-500/20 bg-[#03091a] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                    {p.tech_stack.length > 4 && (
                      <span className="rounded-full border border-blue-500/20 bg-[#03091a] px-2 py-0.5 text-[10px] font-medium text-slate-400">
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
            className="rounded-full border-slate-700 bg-[#061233] text-slate-200 hover:bg-[#0c1f54] hover:text-white px-8 py-6 text-sm sm:text-base font-semibold"
          >
            <Link href="/portfolio">Eksplorasi Seluruh Portfolio &amp; Studi Kasus →</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
