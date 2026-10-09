import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import { getSiteSettings } from "@/lib/queries";
import { organizationJsonLd } from "@/lib/seo";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const jsonLd = organizationJsonLd({
    site_name: settings?.site_name ?? "Byteshift Studio",
    email: settings?.email,
    whatsapp_number: settings?.whatsapp_number,
    address: settings?.address,
    social_links: (settings?.social_links as Record<string, string>) ?? null,
  });
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav waNumber={settings?.whatsapp_number} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp phone={settings?.whatsapp_number} />
    </>
  );
}
