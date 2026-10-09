"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/utils";

export default function FloatingWhatsApp({
  phone,
  message = "Halo Byteshift, saya ingin konsultasi mengenai project digital saya.",
}: {
  phone?: string | null;
  message?: string;
}) {
  const number = phone ?? process.env.NEXT_PUBLIC_WA_NUMBER;
  if (!number) return null;
  const href = buildWhatsAppLink(message, number);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
      </span>
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Chat WhatsApp</span>
    </a>
  );
}
