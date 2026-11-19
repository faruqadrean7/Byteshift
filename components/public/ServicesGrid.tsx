import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import type { Service } from "@/types/database";

export default function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section id="layanan" className="bg-steel-surface py-24">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            tag="Layanan Kami"
            title={
              <>
                Apa yang Bisa
                <br />
                Kami Bangun?
              </>
            }
          />
          <p className="max-w-md text-steel-muted">
            Dari landing page sederhana hingga sistem enterprise kompleks — kami
            punya solusinya.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              as="article"
              key={s.id}
              delay={i * 0.05}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-steel-surface2 p-7 transition-all hover:-translate-y-1 hover:border-steel-accent/40 hover:bg-steel-raise text-steel-text"
            >
              <div className="text-3xl">{s.icon}</div>
              <h3 className="mt-4 font-display text-lg font-bold transition-colors text-steel-text">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-muted transition-colors">
                {s.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-steel-soft transition-all"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
