import { Mail, MessageCircle, MapPin, Clock, ShieldCheck, FileCheck } from "lucide-react";
import { getSiteSettings } from "@/lib/queries";
import LeadForm from "@/components/public/LeadForm";
import { buildMetadata } from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/utils";

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: "Konsultasi & Pengajuan Proyek (RFP) — Byteshift Consulting",
  description:
    "Diskusikan kebutuhan arsitektur sistem, aplikasi enterprise, IoT, dan transformasi digital Anda bersama principal consultant Byteshift.",
  path: "/kontak",
});

export default async function KontakPage() {
  const settings = await getSiteSettings();
  const wa = buildWhatsAppLink(
    "Halo Tim Konsultan Byteshift, kami ingin menjadwalkan sesi konsultasi arsitektur dan kebutuhan proyek teknologi kami.",
    settings?.whatsapp_number ?? undefined
  );

  return (
    <section className="relative overflow-hidden bg-[#0E1420] pt-36 pb-28 text-steel-text min-h-screen">
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-steel-accent/12 blur-[140px] pointer-events-none" />
      
      <div className="container relative grid gap-14 lg:grid-cols-[1fr_1.3fr] items-start">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-steel-accent/25 bg-steel-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-steel-soft backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            Strategic Advisory &amp; Project Inquiry
          </div>
          
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-steel-text md:text-5xl lg:text-6xl">
            Inisiasi Proyek &amp;{" "}
            <span className="bg-gradient-to-r from-steel-accent2 via-steel-soft to-steel-accent2 bg-clip-text text-transparent">
              Konsultasi Solusi
            </span>
          </h1>
          
          <p className="mt-5 text-base leading-relaxed text-steel-muted md:text-lg">
            Sampaikan visi, tantangan sistem, atau dokumen RFP Anda. Tim konsultan kami siap menyusun estimasi teknis, peta arsitektur, dan rekomendasi langkah implementasi terbaik.
          </p>

          <div className="mt-10 space-y-4">
            <ContactItem
              icon={<MessageCircle className="h-5 w-5 text-steel-accent2" />}
              label="Kanal Diskusi Cepat (WhatsApp)"
              value={settings?.whatsapp_number ? `+${settings.whatsapp_number}` : "WhatsApp Terhubung"}
              href={wa}
            />
            {settings?.email && (
              <ContactItem
                icon={<Mail className="h-5 w-5 text-steel-accent2" />}
                label="Email Korespondensi Resmi / RFP"
                value={settings.email}
                href={`mailto:${settings.email}`}
              />
            )}
            {settings?.address && (
              <ContactItem
                icon={<MapPin className="h-5 w-5 text-steel-accent2" />}
                label="Kantor Operasional"
                value={settings.address}
              />
            )}
            <ContactItem
              icon={<Clock className="h-5 w-5 text-steel-accent2" />}
              label="Waktu Konsultasi Teknis"
              value="Senin – Jumat, 09:00 – 18:00 WIB (SLA Darurat 24/7)"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-[#151D2D]/85 p-8 md:p-10 backdrop-blur-xl shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
            <div>
              <h2 className="font-display text-2xl font-bold text-steel-text">Formulir Inkuiri Proyek</h2>
              <p className="mt-1 text-xs text-steel-muted">
                Lengkapi rincian awal agar kami dapat menyiapkan proposal yang presisi.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#0E1420] px-3.5 py-1 text-xs text-steel-soft">
              <FileCheck className="h-3.5 w-3.5 text-steel-accent2" />
              <span>NDA Protected</span>
            </div>
          </div>
          <div className="mt-8">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-[#151D2D]/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-steel-accent/40 hover:bg-[#212D42] shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-steel-accent/25 bg-steel-accent/15 shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-steel-faint">
          {label}
        </div>
        <div className="mt-1 font-display text-sm font-bold text-steel-text">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block transition-transform hover:-translate-y-0.5"
    >
      {content}
    </a>
  ) : (
    <div>{content}</div>
  );
}

