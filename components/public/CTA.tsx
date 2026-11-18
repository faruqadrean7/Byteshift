import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ArrowRight, ShieldCheck, FileText, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/utils";
import ClientsStrip from "./ClientsStrip";

export default function CTA({ waNumber }: { waNumber?: string | null }) {
  const wa = buildWhatsAppLink(
    "Halo Tim Konsultan Byteshift, kami ingin berkonsultasi mengenai kendala sistem dan solusi teknologi untuk perusahaan kami.",
    waNumber ?? undefined
  );

  return (
    <section className="relative overflow-hidden bg-[#13203A] text-slate-100">
      
      {/* Banner Container with Atmospheric Image Background */}
      <div className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80"
          alt="Konsultasi Teknologi Byteshift"
          fill
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#13203A] via-[#13203A]/90 to-[#13203A]" />

        <div className="container relative z-10 max-w-3xl lg:max-w-4xl text-center">
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100">
            Still Unsure?
          </h2>
          
          <p className="mx-auto mt-4 sm:mt-6 max-w-xl lg:max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-slate-300">
            Diskusikan langsung peta jalan sistem, kebutuhan integrasi, atau evaluasi anggaran Anda bersama tim principal consultant Byteshift tanpa komitmen di awal.
          </p>

          <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row justify-center gap-3.5 sm:gap-5">
            <Button
              asChild
              className="h-13 sm:h-14 lg:h-16 rounded-full bg-[#4C9AED] hover:bg-[#3E85D8] font-bold text-slate-100 shadow-xl shadow-blue-500/25 transition-all hover:scale-105 px-8 sm:px-10 text-sm sm:text-base lg:text-lg"
            >
              <a href={wa} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2.5">
                <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 shrink-0" />
                <span>Jadwalkan Diskusi via WhatsApp</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-13 sm:h-14 lg:h-16 rounded-full border-slate-500 bg-white/10 text-slate-100 backdrop-blur-md hover:bg-white/20 hover:border-white px-8 sm:px-10 text-sm sm:text-base lg:text-lg font-semibold"
            >
              <Link href="/kontak" className="flex items-center justify-center gap-2.5">
                <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-sky-300 shrink-0" />
                <span>Kirim Dokumen Brief / RFP</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Brand Logos Bar Underneath (Matching reference image) */}
      <ClientsStrip />
    </section>
  );
}
