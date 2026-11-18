import type { MetadataRoute } from "next";
import { query } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

/** Run a query but never let a DB error break sitemap/static generation. */
async function safe<T>(fn: () => Promise<T[]>): Promise<T[]> {
  try {
    return await fn();
  } catch (e) {
    console.error("Sitemap query failed, falling back to static paths:", e);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [portfolio, blog] = await Promise.all([
    safe(() =>
      query<{ slug: string; updated_at: string }>(
        "SELECT slug, updated_at FROM portfolio WHERE is_published = true"
      )
    ),
    safe(() =>
      query<{ slug: string; updated_at: string; published_at: string }>(
        "SELECT slug, updated_at, published_at FROM blog_posts WHERE is_published = true"
      )
    ),
  ]);

  const staticPaths: MetadataRoute.Sitemap = [
    "",
    "/portfolio",
    "/blog",
    "/tentang",
    "/kontak",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const portfolioPaths: MetadataRoute.Sitemap = (portfolio ?? []).map((p) => ({
    url: `${siteUrl}/portfolio/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogPaths: MetadataRoute.Sitemap = (blog ?? []).map((b) => ({
    url: `${siteUrl}/blog/${b.slug}`,
    lastModified: b.updated_at
      ? new Date(b.updated_at)
      : b.published_at
        ? new Date(b.published_at)
        : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPaths, ...portfolioPaths, ...blogPaths];
}
