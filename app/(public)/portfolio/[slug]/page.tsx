import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProjectGallery from "@/components/public/ProjectGallery";
import TiptapRenderer from "@/components/public/TiptapRenderer";
import { getAllPortfolio, getPortfolioBySlug, getSiteSettings } from "@/lib/queries";
import { publicMediaUrl } from "@/lib/storage";
import { buildMetadata } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await getAllPortfolio();
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (!item) return buildMetadata({ title: "Portfolio tidak ditemukan" });
  return buildMetadata({
    title: `${item.title} — Studi Kasus & Karya`,
    description: item.short_desc ?? undefined,
    path: `/portfolio/${item.slug}`,
    image: item.cover_image ? publicMediaUrl(item.cover_image) : undefined,
  });
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, settings] = await Promise.all([
    getPortfolioBySlug(slug),
    getSiteSettings(),
  ]);

  if (!item) notFound();

  const cover = item.cover_image ? publicMediaUrl(item.cover_image) : null;
  const gallery = Array.isArray(item.gallery) ? item.gallery : [];
  const metrics =
    item.metrics && typeof item.metrics === "object"
      ? (item.metrics as Record<string, string>)
      : null;

  const wa = buildWhatsAppLink(
    `Halo Tim Konsultan Byteshift, kami tertarik dengan studi kasus "${item.title}" dan ingin berkonsultasi mengenai solusi sistem serupa untuk institusi kami.`,
    settings?.whatsapp_number ?? undefined
  );

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    headline: item.title,
    description: item.short_desc ?? undefined,
    image: cover || undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/portfolio/${item.slug}`,
    dateCreated: item.year ? String(item.year) : undefined,
    creator: { "@type": "Organization", name: "Byteshift Consulting" },
    about: item.category,
    keywords: item.tech_stack.join(", "),
  };

  return (
    <article className="relative overflow-hidden bg-[#0E1420] pt-36 pb-32 text-steel-text min-h-screen">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute -top-40 right-1/3 h-[500px] w-[500px] rounded-full bg-steel-accent/12 blur-[140px] pointer-events-none" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />

      <div className="container max-w-5xl relative px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-steel-muted transition-colors hover:text-steel-accent2 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Seluruh Studi Kasus</span>
          </Link>
        </div>

        {/* Metadata Badges Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Badge className="rounded-full border-steel-accent/25 bg-steel-accent/15 text-steel-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            {item.category}
          </Badge>

          {item.client_name && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#1A2436]/80 px-4 py-1.5 text-xs font-semibold text-steel-muted backdrop-blur-md">
              <Building2 className="h-3.5 w-3.5 text-steel-accent2" />
              <span>{item.client_name}</span>
            </div>
          )}

          {item.year && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#1A2436]/80 px-4 py-1.5 text-xs font-semibold text-steel-muted backdrop-blur-md">
              <Calendar className="h-3.5 w-3.5 text-steel-accent2" />
              <span>Tahun {item.year}</span>
            </div>
          )}

          {item.demo_url && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Platform Active</span>
            </div>
          )}
        </div>

        {/* Project Title & Summary */}
        <h1 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-steel-text">
          {item.title}
        </h1>

        {item.short_desc && (
          <p className="mt-5 text-base sm:text-lg lg:text-xl leading-relaxed text-steel-muted max-w-4xl">
            {item.short_desc}
          </p>
        )}

        {/* Main Action Bar (Demo Link + Consultation) */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {item.demo_url && (
            <Button
              asChild
              className="h-12 lg:h-13 rounded-full bg-steel-accent hover:bg-steel-accent2 text-[#0b1220] font-bold px-7 shadow-lg shadow-black/25 transition-all hover:scale-105 text-sm sm:text-base"
            >
              <a
                href={item.demo_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5"
              >
                <ExternalLink className="h-4 w-4 lg:h-5 lg:w-5" />
                <span>Uji Coba Live Demo / Platform</span>
              </a>
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            className="h-12 lg:h-13 rounded-full border-white/[0.08] bg-[#1A2436]/70 text-steel-muted hover:bg-[#212D42] hover:text-steel-text px-7 text-sm sm:text-base font-semibold backdrop-blur-md"
          >
            <a href={wa} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-steel-accent2" />
              <span>Konsultasikan Proyek Serupa</span>
            </a>
          </Button>
        </div>

        {/* Interactive Multi-Image Gallery */}
        <div className="mt-12">
          <ProjectGallery
            coverImage={item.cover_image}
            gallery={gallery}
            title={item.title}
          />
        </div>

        {/* Impact Metrics Grid */}
        {metrics && Object.keys(metrics).length > 0 && (
          <div className="mt-14 rounded-3xl border border-white/[0.08] bg-[#1A2436]/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-steel-soft mb-6">
              <TrendingUp className="h-4 w-4" />
              <span>Hasil Nyata &amp; Dampak Implementasi</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(metrics).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-2xl border border-white/[0.08] bg-[#212D42]/80 p-6 text-center backdrop-blur-md transition-all hover:border-steel-accent/40"
                >
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-steel-soft">
                    {v}
                  </div>
                  <div className="mt-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-steel-muted">
                    {k.replace(/_/g, " ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack & Architecture Badges */}
        {item.tech_stack.length > 0 && (
          <div className="mt-10 rounded-3xl border border-white/[0.08] bg-[#1A2436]/60 p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-steel-soft">
              <Layers className="h-4 w-4" />
              <span>Arsitektur &amp; Teknologi yang Digunakan</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {item.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/[0.08] bg-[#0E1420] px-4 py-1.5 text-xs sm:text-sm font-semibold text-steel-muted shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full Case Study Story Narrative */}
        {item.full_content ? (
          <div className="mt-14 rounded-3xl border border-white/[0.08] bg-[#1A2436]/40 p-6 sm:p-10 backdrop-blur-xl">
            <div className="text-xs font-bold uppercase tracking-widest text-steel-accent2 mb-6">
              Studi Kasus &amp; Rekayasa Teknis Mendalam
            </div>
            <div className="text-steel-muted text-base sm:text-lg leading-relaxed [&_p]:my-5 [&_p]:leading-relaxed [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-steel-text [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-steel-text [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2.5 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2.5 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-steel-accent/50 [&_blockquote]:pl-5 [&_blockquote]:text-steel-muted [&_blockquote]:italic [&_blockquote]:bg-[#212D42]/80 [&_blockquote]:p-5 [&_blockquote]:rounded-r-2xl">
              <TiptapRenderer content={item.full_content} />
            </div>
          </div>
        ) : null}

        {/* Bottom Call to Action Card */}
        <div className="mt-16 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#283347] via-[#151D2D] to-[#0E1420] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-steel-accent/12 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-steel-soft">
              Transformasi Sistem Perusahaan Anda
            </span>
            <h3 className="mt-3 font-display text-2xl sm:text-4xl font-extrabold text-steel-text">
              Ingin Membangun Solusi Seperti Ini?
            </h3>
            <p className="mt-4 text-sm sm:text-base text-steel-muted leading-relaxed">
              Diskusikan arsitektur sistem, integrasi API, atau kebutuhan portal web khusus perusahaan Anda bersama principal engineer Byteshift.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                asChild
                className="h-13 rounded-full bg-steel-accent hover:bg-steel-accent2 font-bold text-[#0b1220] shadow-xl shadow-black/25 px-8 text-base"
              >
                <a href={wa} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2.5">
                  <MessageCircle className="h-5 w-5" />
                  <span>Jadwalkan Diskusi via WhatsApp</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-13 rounded-full border-white/20 bg-white/[0.04] text-steel-text hover:bg-white/10 hover:border-white px-8 text-base font-semibold"
              >
                <Link href="/kontak">Kirim Permintaan Penawaran (RFP)</Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}
