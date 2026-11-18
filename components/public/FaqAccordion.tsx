"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { Faq } from "@/types/database";
import { cn } from "@/lib/utils";

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  if (!faqs.length) return null;
  return (
    <section id="faq" className="relative bg-[#13203A] py-20 sm:py-28 lg:py-36 text-slate-100 border-b border-slate-800">
      <div className="container max-w-4xl lg:max-w-5xl relative px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl lg:max-w-3xl mx-auto">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#4C9AED]">
            Pertanyaan Umum (FAQ)
          </div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-100">
            Frequently Asked Questions
          </h2>
          <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
            Informasi transparan mengenai model keterlibatan konsultasi, kepemilikan kode sumber, kerahasiaan NDA, hingga garansi pemeliharaan sistem.
          </p>
        </div>
        <div className="mt-10 sm:mt-14 lg:mt-16 space-y-3.5 sm:space-y-4 lg:space-y-5">
          {faqs.map((f) => {
            const open = openId === f.id;
            return (
              <div
                key={f.id}
                className={cn(
                  "rounded-2xl lg:rounded-3xl border px-5 py-4 sm:px-7 sm:py-5 lg:px-8 lg:py-6 backdrop-blur-md transition-all duration-300",
                  open
                    ? "border-[#4C9AED]/60 bg-[#1D3258] shadow-xl shadow-blue-500/10"
                    : "border-slate-800 bg-[#152340] hover:border-slate-700 hover:bg-[#1B3056]"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : f.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 text-left group"
                >
                  <span className="font-display text-base sm:text-lg lg:text-xl font-bold text-slate-100 group-hover:text-[#4C9AED] transition-colors">
                    {f.question}
                  </span>
                  <span
                    className={cn(
                      "grid h-8 w-8 lg:h-10 lg:w-10 shrink-0 place-items-center rounded-full transition-colors",
                      open
                        ? "bg-[#4C9AED] text-slate-100 font-bold"
                        : "bg-white/10 border border-white/10 text-slate-300"
                    )}
                  >
                    {open ? (
                      <Minus className="h-4 w-4 lg:h-5 lg:w-5" />
                    ) : (
                      <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                    )}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    open
                      ? "mt-4 lg:mt-5 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-slate-700/60 pt-4 lg:pt-5 text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-300">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

