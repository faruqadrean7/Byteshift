import Hero from "@/components/public/Hero";
import HeroMetrics from "@/components/public/HeroMetrics";
import About from "@/components/public/About";
import Packages from "@/components/public/Packages";
import Sectors from "@/components/public/Sectors";
import Process from "@/components/public/Process";
import PortfolioSection from "@/components/public/PortfolioSection";
import Testimonials from "@/components/public/Testimonials";
import FaqAccordion from "@/components/public/FaqAccordion";
import CTA from "@/components/public/CTA";
import {
  getSiteSettings,
  getServices,
  getTestimonials,
  getFaqs,
  getFeaturedPortfolio,
} from "@/lib/queries";
import { servicesJsonLd, faqJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export default async function HomePage() {
  const [settings, services, testimonials, faqs, portfolio] =
    await Promise.all([
      getSiteSettings(),
      getServices(),
      getTestimonials(),
      getFaqs(),
      getFeaturedPortfolio(6),
    ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesJsonLd(services)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(faqs)),
        }}
      />

      {/* 1. Hero — First impression, video background & solution proposition */}
      <Hero settings={settings} />

      {/* 2. About Us — Value & identity with signature yellow graphic accent */}
      <About />

      {/* 3. Sektor Industri & Solusi — 4 thumbnail cards with central play badges */}
      <Sectors />

      {/* 4. Testimonials — 3-card clean carousel */}
      <Testimonials testimonials={testimonials} />

      {/* 5. What We Do — Deep navy section with highlighted sky-blue card */}
      <Packages waNumber={settings?.whatsapp_number} />

      {/* 6. Case Studies — 3-column project showcase */}
      <PortfolioSection items={portfolio} />

      {/* 7. Still Unsure CTA + Integrated Client Logo Strip */}
      <CTA waNumber={settings?.whatsapp_number} />

      {/* 8. Things You Didn't Know (Process) — yellow graphic accent + enterprise guarantees */}
      <Process />

      {/* 9. FAQ Accordion — Transparent answers to common questions */}
      <FaqAccordion faqs={faqs} />

      {/* 10. Trust Pillar Cards — 4 feature boxes right above footer */}
      <HeroMetrics />
    </>
  );
}
