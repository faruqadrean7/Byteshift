"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoImg from "@/public/logo.png";

const links = [
  { href: "/#layanan", label: "Layanan & Solusi" },
  { href: "/portfolio", label: "Studi Kasus" },
  { href: "/#sektor", label: "Sektor Industri" },
  { href: "/#proses", label: "Metodologi" },
  { href: "/blog", label: "Insight" },
  { href: "/tentang", label: "Tentang Kami" },
];

export default function Nav({ waNumber }: { waNumber?: string | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-steel-base/90 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/40 py-3.5 lg:py-4 text-steel-text"
          : "bg-transparent backdrop-blur-sm border-b border-white/[0.08] py-4 lg:py-5 text-steel-text"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Brandmark & Logo */}
        <Link href="/" className="group flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 lg:h-12 lg:w-12 shrink-0 items-center justify-center">
            <Image
              src={logoImg}
              alt="Byteshift Consulting Logo"
              width={48}
              height={48}
              className="h-full w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg lg:text-xl font-extrabold tracking-tight text-steel-text group-hover:text-steel-accent2 transition-colors leading-tight">
              BYTESHIFT
            </span>
            <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.22em] text-steel-soft/80">
              Technology Consulting
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-7 lg:gap-9 xl:gap-11 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm lg:text-[15px] xl:text-base font-semibold text-steel-muted hover:text-steel-text transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Primary CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#C4424E] hover:bg-[#B23946] h-11 lg:h-12 px-6 lg:px-8 text-sm lg:text-[15px] font-bold text-steel-text shadow-md shadow-black/20 hover:scale-[1.02] transition-all"
          >
            <Link href="/kontak" className="flex items-center gap-2">
              <span>Konsultasi Proyek</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          aria-label="Toggle menu"
          className="lg:hidden rounded-xl border border-white/[0.08] bg-steel-surface2/80 p-2 text-steel-text hover:bg-steel-raise transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-t border-white/[0.08] bg-steel-base/98 backdrop-blur-2xl lg:hidden animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <ul className="container flex flex-col py-5 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-lg px-3.5 py-2.5 text-sm font-semibold text-steel-muted hover:bg-steel-surface2 hover:text-steel-accent2 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Button asChild className="w-full rounded-full bg-[#C4424E] hover:bg-[#B23946] font-bold text-steel-text shadow-md">
                <Link href="/kontak" onClick={() => setOpen(false)}>
                  Konsultasi Proyek →
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

