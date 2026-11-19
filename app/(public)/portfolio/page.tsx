import { getAllPortfolio } from "@/lib/queries";
import PortfolioGrid from "@/components/public/PortfolioGrid";
import { buildMetadata } from "@/lib/seo";
import { ShieldCheck } from "lucide-react";

export const revalidate = 3600;
export const metadata = buildMetadata({
  title: "Studi Kasus & Rekam Jejak Solusi — Byteshift Consulting",
  description:
    "Eksplorasi implementasi sistem enterprise, aplikasi IoT, platform web, dan transformasi digital yang telah kami kembangkan.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const items = await getAllPortfolio();
  return (
    <section className="relative overflow-hidden bg-[#0E1420] pt-36 pb-28 text-steel-text min-h-screen">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-steel-accent/12 blur-[140px] pointer-events-none" />
      
      <div className="container relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-steel-accent/25 bg-steel-accent/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-steel-soft backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5" />
          Rekam Jejak &amp; Studi Kasus
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-steel-text md:text-6xl">
          Implementasi Nyata,{" "}
          <span className="bg-gradient-to-r from-steel-accent2 via-steel-soft to-steel-accent2 bg-clip-text text-transparent">
            Dampak Terukur
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-steel-muted md:text-lg">
          Jelajahi portofolio solusi perangkat lunak, sistem IoT industri, arsitektur ERP, dan platform digital yang kami bangun dengan standar keandalan tinggi.
        </p>
        <div className="mt-14">
          <PortfolioGrid items={items} />
        </div>
      </div>
    </section>
  );
}

