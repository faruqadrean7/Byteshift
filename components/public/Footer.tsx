import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, Youtube, Mail, MapPin, Phone, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/utils";
import type { SiteSettings } from "@/types/database";
import logoImg from "@/public/logo.png";

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const social = (settings?.social_links ?? {}) as Record<string, string>;
  const wa = buildWhatsAppLink(
    "Halo Tim Byteshift, kami ingin berdiskusi mengenai proyek rekayasa software dan transformasi sistem teknologi perusahaan kami.",
    settings?.whatsapp_number ?? undefined
  );

  return (
    <footer className="bg-steel-base text-steel-muted border-t border-white/[0.08] relative overflow-hidden">
      <div className="container py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        {/* Top Banner Callout matching reference */}
        <div className="border-b border-white/10 pb-12 sm:pb-16 lg:pb-20 mb-12 sm:mb-16 lg:mb-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
            <div className="max-w-2xl lg:max-w-3xl">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-steel-accent2">
                Mulai Kolaborasi
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-steel-text tracking-tight leading-tight">
                We could make something great together. <span className="text-steel-accent2">Get in touch.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-steel-muted leading-relaxed max-w-2xl">
                Konsultasikan kebutuhan arsitektur sistem, modernisasi teknologi, atau rekayasa platform digital perusahaan Anda bersama tim konsultan kami.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto shrink-0">
              <Button
                asChild
                className="h-13 sm:h-14 lg:h-16 rounded-full bg-steel-accent hover:bg-steel-accent2 font-bold text-[#0b1220] shadow-md shadow-black/20 px-7 sm:px-8 lg:px-10 text-sm sm:text-base lg:text-lg"
              >
                <a href={wa} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2.5">
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  <span>Jadwalkan Konsultasi</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-13 sm:h-14 lg:h-16 rounded-full border-white/20 bg-white/[0.04] text-steel-text hover:bg-white/10 hover:border-white/40 px-7 sm:px-8 lg:px-10 text-sm sm:text-base lg:text-lg font-semibold"
              >
                <Link href="/kontak" className="flex items-center justify-center gap-2.5">
                  <span>Hubungi Tim</span>
                  <ArrowRight className="h-5 w-5 text-steel-accent2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-10 sm:gap-12 lg:gap-16 lg:grid-cols-[2fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="mb-5 lg:mb-6 flex items-center gap-3 group">
              <div className="relative flex h-11 w-11 lg:h-12 lg:w-12 shrink-0 items-center justify-center">
                <Image
                  src={logoImg}
                  alt="Byteshift Consulting Logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg lg:text-xl font-extrabold text-steel-text tracking-tight group-hover:text-steel-accent2 transition-colors">
                  BYTESHIFT
                </span>
                <span className="text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] text-steel-soft/80">
                  Technology Consulting
                </span>
              </div>
            </Link>
            <p className="max-w-sm lg:max-w-md text-sm lg:text-[15px] leading-relaxed text-steel-faint">
              {settings?.tagline ??
                "Mitra rekayasa perangkat lunak dan konsultasi teknologi strategis. Membantu institusi dan korporasi membangun sistem cerdas, skalabel, dan berkinerja tinggi."}
            </p>
            <div className="mt-6 lg:mt-8 flex flex-col gap-3 text-xs sm:text-sm text-steel-muted">
              {settings?.email && (
                <span className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-steel-accent2 shrink-0" /> {settings.email}
                </span>
              )}
              {settings?.whatsapp_number && (
                <span className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-steel-accent2 shrink-0" /> +{settings.whatsapp_number}
                </span>
              )}
              {settings?.address && (
                <span className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-steel-accent2 shrink-0" /> {settings.address}
                </span>
              )}
            </div>
          </div>

          <FooterCol
            title="Kapabilitas & Solusi"
            items={[
              ["Platform Web & Portal", "/#layanan"],
              ["Sistem Informasi & ERP", "/#layanan"],
              ["Aplikasi Mobile", "/#layanan"],
              ["Industrial IoT & Edge", "/#layanan"],
              ["AI & Machine Learning", "/#layanan"],
              ["Integrasi API & Cloud", "/#layanan"],
            ]}
          />
          <FooterCol
            title="Institusi & Praktek"
            items={[
              ["Tentang Byteshift", "/tentang"],
              ["Fokus Sektor Industri", "/#sektor"],
              ["Metodologi Rekayasa", "/#proses"],
              ["Studi Kasus & Portfolio", "/portfolio"],
              ["Insight & Riset Teknis", "/blog"],
            ]}
          />
          <FooterCol
            title="Tata Kelola & Kontak"
            items={[
              ["Jadwalkan Konsultasi", "/kontak"],
              ["Pertanyaan Umum (FAQ)", "/#faq"],
              ["Kerahasiaan & Standar NDA", "/kontak"],
              ["Dukungan SLA 24/7", "/kontak"],
            ]}
          />
        </div>

        <div className="mt-16 lg:mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 lg:pt-10 md:flex-row">
          <p className="text-xs sm:text-sm text-steel-faint text-center md:text-left">
            © {new Date().getFullYear()} {settings?.site_name ?? "Byteshift Consulting"}. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex gap-3">
            {social.instagram && (
              <SocialBtn href={social.instagram} label="Instagram">
                <Instagram className="h-4 w-4 lg:h-5 lg:w-5" />
              </SocialBtn>
            )}
            {social.linkedin && (
              <SocialBtn href={social.linkedin} label="LinkedIn">
                <Linkedin className="h-4 w-4 lg:h-5 lg:w-5" />
              </SocialBtn>
            )}
            {social.youtube && (
              <SocialBtn href={social.youtube} label="YouTube">
                <Youtube className="h-4 w-4 lg:h-5 lg:w-5" />
              </SocialBtn>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <div>
      <h4 className="mb-4 lg:mb-5 font-display text-sm sm:text-base font-bold text-steel-text">
        {title}
      </h4>
      <ul className="space-y-2.5 lg:space-y-3">
        {items.map(([label, href]) => (
          <li key={href + label}>
            <Link
              href={href}
              className="text-sm lg:text-[15px] text-steel-muted transition-colors hover:text-steel-accent2"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialBtn({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-10 w-10 lg:h-11 lg:w-11 place-items-center rounded-full border border-white/[0.08] bg-steel-surface2 text-steel-muted transition-all hover:bg-steel-accent hover:border-steel-accent2 hover:text-[#0b1220]"
    >
      {children}
    </a>
  );
}

