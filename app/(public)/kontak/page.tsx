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
    <section className="relative overflow-hidden bg-[#0B1324] pt-36 pb-28 text-slate-100 min-h-screen">
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/15 blur-[140px] pointer-events-none" />
      
      <div className="container relative grid gap-14 lg:grid-cols-[1fr_1.3fr] items-start">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-300 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            Strategic Advisory &amp; Project Inquiry
          </div>
          
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-slate-100 md:text-5xl lg:text-6xl">
            Inisiasi Proyek &amp;{" "}
            <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Konsultasi Solusi
            </span>
          </h1>
          
          <p className="mt-5 text-base leading-relaxed text-slate-300 md:text-lg">
            Sampaikan visi, tantangan sistem, atau dokumen RFP Anda. Tim konsultan kami siap menyusun estimasi teknis, peta arsitektur, dan rekomendasi langkah implementasi terbaik.
          </p>

          <div className="mt-10 space-y-4">
            <ContactItem
              icon={<MessageCircle className="h-5 w-5 text-sky-400" />}
              label="Kanal Diskusi Cepat (WhatsApp)"
              value={settings?.whatsapp_number ? `+${settings.whatsapp_number}` : "WhatsApp Terhubung"}
              href={wa}
            />
            {settings?.email && (
              <ContactItem
                icon={<Mail className="h-5 w-5 text-sky-400" />}
                label="Email Korespondensi Resmi / RFP"
                value={settings.email}
                href={`mailto:${settings.email}`}
              />
            )}
            {settings?.address && (
              <ContactItem
                icon={<MapPin className="h-5 w-5 text-sky-400" />}
                label="Kantor Operasional"
                value={settings.address}
              />
            )}
            <ContactItem
              icon={<Clock className="h-5 w-5 text-sky-400" />}
              label="Waktu Konsultasi Teknis"
              value="Senin – Jumat, 09:00 – 18:00 WIB (SLA Darurat 24/7)"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-blue-500/20 bg-[#131F38]/85 p-8 md:p-10 backdrop-blur-xl shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between pb-6 border-b border-blue-500/20">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-100">Formulir Inkuiri Proyek</h2>
              <p className="mt-1 text-xs text-slate-300">
                Lengkapi rincian awal agar kami dapat menyiapkan proposal yang presisi.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-[#0B1324] px-3.5 py-1 text-xs text-sky-300">
              <FileCheck className="h-3.5 w-3.5 text-sky-400" />
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
    <div className="flex items-start gap-4 rounded-2xl border border-blue-500/20 bg-[#131F38]/70 p-5 backdrop-blur-md transition-all duration-300 hover:border-sky-400/40 hover:bg-[#172748] shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-500/25 bg-sky-950/40 shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </div>
        <div className="mt-1 font-display text-sm font-bold text-slate-100">{value}</div>
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

