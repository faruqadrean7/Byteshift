"use client";

import {
  Building2,
  Shield,
  Landmark,
  Cpu,
  Stethoscope,
  Factory,
  Globe2,
  Database,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";

const solutions = [
  { icon: Landmark, label: "Keandalan Sistem Perbankan & Fintech", tag: "Bebas Downtime" },
  { icon: Building2, label: "Digitalisasi Sentral Multi-Entitas Bisnis", tag: "Efisiensi Operasional" },
  { icon: Factory, label: "Otomatisasi Mesin & Inventory Pabrik", tag: "Supply Chain Presisi" },
  { icon: Stethoscope, label: "Integrasi Rekam Medis & SIMRS Aman", tag: "Kepatuhan Regulasi" },
  { icon: Shield, label: "Proteksi Kerahasiaan & Keamanan Data Korporat", tag: "Standar OWASP" },
  { icon: Zap, label: "Akselerasi Kecepatan Sistem & Database 3x Lipat", tag: "Performa Tinggi" },
  { icon: Cpu, label: "Monitoring Telemetri IoT Real-Time", tag: "Kontrol Jarak Jauh" },
  { icon: Sparkles, label: "Automasi Dokumen & Asisten AI Cerdas", tag: "Hemat Waktu Tim" },
  { icon: Globe2, label: "Portal Transaksi Skala Jutaan Pengguna", tag: "Tahan Lonjakan Trafik" },
  { icon: Layers, label: "Sinkronisasi Antar Aplikasi yang Terpisah", tag: "Integrasi Mulus" },
];

export default function ClientsStrip() {
  return (
    <div className="border-y border-white/[0.08] bg-steel-surface py-6 sm:py-8 lg:py-10">
      <div className="container px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-steel-soft/80">
          Solusi Teruji untuk Mengatasi Masalah Kompleks di Berbagai Industri
        </p>

        {/* Continuous Auto-Scrolling Marquee */}
        <div className="relative mt-5 sm:mt-6 lg:mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-3.5 sm:gap-4 lg:gap-5 hover:[animation-play-state:paused]">
            {[...solutions, ...solutions].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.label}-${idx}`}
                  className="flex items-center gap-2.5 sm:gap-3 rounded-full border border-white/[0.08] bg-steel-surface2/80 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-xs sm:text-sm font-bold text-steel-muted backdrop-blur-md transition-all hover:border-steel-accent/40 hover:bg-steel-raise hover:text-steel-text cursor-default shrink-0 shadow-md"
                >
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-steel-accent2 shrink-0" />
                  <span className="text-xs sm:text-sm">{item.label}</span>
                  <span className="rounded-full bg-steel-accent/15 px-2.5 py-1 text-[10px] lg:text-xs font-bold uppercase text-steel-soft border border-steel-accent/25">
                    {item.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


