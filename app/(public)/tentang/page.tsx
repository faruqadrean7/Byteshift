import Image from "next/image";
import { Award, ShieldCheck, Sparkles, Users } from "lucide-react";
import { getSiteSettings, getTeamMembers } from "@/lib/queries";
import { publicMediaUrl } from "@/lib/storage";
import { buildMetadata } from "@/lib/seo";
import SectionHeader from "@/components/public/SectionHeader";

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: "Tentang Kami — Konsultasi & Rekayasa Teknologi",
  description:
    "Profil institusi, prinsip rekayasa, dan tata nilai Byteshift sebagai mitra teknologi strategis.",
  path: "/tentang",
});

const values = [
  {
    icon: ShieldCheck,
    title: "Integritas Arsitektur & Keamanan",
    desc: "Setiap kode, skema database, dan infrastruktur dibangun dengan standar kepatuhan tinggi serta jaminan kerahasiaan NDA.",
  },
  {
    icon: Sparkles,
    title: "Rekayasa Presisi & Zero-Debt",
    desc: "Menerapkan standar clean code, testing menyeluruh, dan arsitektur modular yang mudah di-maintain jangka panjang.",
  },
  {
    icon: Users,
    title: "Kolaborasi Transparan & Terstruktur",
    desc: "Pelaporan kemajuan berbasis sprint, demo berkala, dan komunikasi langsung bersama principal engineer.",
  },
  {
    icon: Award,
    title: "Akuntabilitas & Jaminan SLA",
    desc: "Komitmen penuh terhadap keandalan sistem pasca-peluncuran dengan dukungan pemeliharaan teknis 24/7.",
  },
];

export default async function TentangPage() {
  const [settings, team] = await Promise.all([
    getSiteSettings(),
    getTeamMembers(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-[#030718] pt-36 pb-24 text-white border-b border-blue-500/20">
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
        
        <div className="container max-w-4xl relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            Profil Perusahaan &amp; Tata Nilai
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            Mitra Rekayasa Teknologi &amp;{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Konsultasi Strategis
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300 md:text-xl">
            {settings?.tagline ??
              "Byteshift adalah konsultan teknologi dan rekayasa perangkat lunak modern. Kami mendampingi korporasi, institusi, dan perusahaan berkembang dalam memecahkan tantangan operasional melalui arsitektur perangkat lunak andal, cloud-native, dan otomatisasi cerdas."}
          </p>
        </div>
      </section>

      <section className="relative bg-[#040d28] py-24 text-white border-b border-blue-500/20">
        <div className="container relative">
          <SectionHeader
            invert
            tag="Prinsip &amp; Nilai Dasar"
            title="Standar Rekayasa yang Membimbing Setiap Langkah Kami"
            subtitle="Kami tidak sekadar membangun aplikasi; kami merancang fondasi teknologi yang mampu menopang pertumbuhan bisnis Anda secara berkelanjutan."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="group rounded-3xl border border-blue-500/20 bg-[#061233]/70 p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:bg-[#091e50] shadow-xl shadow-black/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/60 text-cyan-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="relative bg-[#030718] py-24 text-white">
          <div className="container relative">
            <SectionHeader
              invert
              tag="Tim Eksekutif &amp; Engineering"
              title="Para Praktisi di Balik Kesuksesan Solusi Anda"
              subtitle="Dipimpin oleh para engineer dan konsultan berpengalaman di bidang arsitektur perangkat lunak, infrastruktur cloud, dan embedded system."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => {
                const photo = publicMediaUrl(m.photo_url);
                return (
                  <article
                    key={m.id}
                    className="group rounded-3xl border border-blue-500/20 bg-[#061233]/80 p-7 text-center backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:bg-[#081844] shadow-xl shadow-black/40"
                  >
                    <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl border border-blue-500/30 bg-[#03091a]">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={m.name}
                          fill
                          sizes="96px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center font-display text-2xl font-extrabold text-cyan-400 bg-cyan-950/40">
                          {m.name
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="mt-5 font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {m.name}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      {m.role}
                    </div>
                    {m.bio && (
                      <p className="mt-3 text-xs leading-relaxed text-slate-300">
                        {m.bio}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

