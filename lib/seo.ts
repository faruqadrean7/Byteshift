import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
}

export function buildMetadata(input: SeoInput): Metadata {
  const url = input.path ? new URL(input.path, siteUrl).toString() : siteUrl;
  const title = input.title ?? "Byteshift Studio";
  const description =
    input.description ??
    "Solusi digital profesional: website, aplikasi, dan sistem custom untuk bisnis dan UMKM.";
  const image =
    input.image ?? `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: input.type ?? "website",
      images: [{ url: image, width: 1200, height: 630 }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.tags ? { tags: input.tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function servicesJsonLd(
  services: Array<{ title: string; description?: string | null; slug: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.description ?? undefined,
        url: `${siteUrl}/#service-${s.slug}`,
        provider: { "@type": "Organization", name: "Byteshift Studio" },
        areaServed: "ID",
      },
    })),
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function organizationJsonLd(settings: {
  site_name: string;
  email?: string | null;
  whatsapp_number?: string | null;
  address?: string | null;
  social_links?: Record<string, string> | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name,
    url: siteUrl,
    email: settings.email ?? undefined,
    telephone: settings.whatsapp_number ?? undefined,
    address: settings.address
      ? { "@type": "PostalAddress", addressLocality: settings.address }
      : undefined,
    sameAs: settings.social_links
      ? Object.values(settings.social_links).filter(Boolean)
      : undefined,
  };
}
