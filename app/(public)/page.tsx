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

      {/* 1. Hero — dark; its own curved wave bridges into the next dark section */}
      <Hero settings={settings} />

      {/* 2. About Us — dark */}
      <About />

      <div className="seam" aria-hidden />
      {/* 3. Sektor Industri & Solusi — dark */}
      <Sectors />

      <div className="seam" aria-hidden />
      {/* 4. Testimonials — dark */}
      <Testimonials testimonials={testimonials} />

      <div className="seam" aria-hidden />
      {/* 5. What We Do — dark */}
      <Packages waNumber={settings?.whatsapp_number} />

      {/* 6. Case Studies — LIGHT interlude (smooth gradient seams on both sides) */}
      <div className="seam-to-light" aria-hidden />
      <PortfolioSection items={portfolio} />
      <div className="seam-to-dark" aria-hidden />

      {/* 7. Still Unsure CTA — dark */}
      <CTA waNumber={settings?.whatsapp_number} />

      {/* 8. Things You Didn't Know (Process) — LIGHT interlude */}
      <div className="seam-to-light" aria-hidden />
      <Process />
      <div className="seam-to-dark" aria-hidden />

      {/* 9. FAQ Accordion — dark */}
      <FaqAccordion faqs={faqs} />

      <div className="seam" aria-hidden />
      {/* 10. Trust Pillar Cards — dark, right above footer */}
      <HeroMetrics />
    </>
  );
}
