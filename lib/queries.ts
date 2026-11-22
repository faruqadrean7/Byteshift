import { query, queryOne } from "@/lib/db";
import * as fastApi from "@/lib/fastapi";
import type {
  Service,
  Sector,
  Portfolio,
  Testimonial,
  Faq,
  TeamMember,
  BlogPost,
  SiteSettings,
} from "@/types/database";

async function safeQuery<T>(fn: () => PromiseLike<T>, fallback: T, ms = 2500): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  try {
    const result = await Promise.race([fn(), timeoutPromise]);
    clearTimeout(timer!);
    return result ?? fallback;
  } catch {
    clearTimeout(timer!);
    return fallback;
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const fromApi = await fastApi.fastApiGetSiteSettings();
  if (fromApi) return fromApi;

  return safeQuery(async () => {
    return await queryOne<SiteSettings>(
      "SELECT * FROM site_settings WHERE id = 1 LIMIT 1"
    );
  }, null);
}

export async function getServices(): Promise<Service[]> {
  const fromApi = await fastApi.fastApiGetServices();
  if (fromApi && fromApi.length > 0) return fromApi;

  return safeQuery(async () => {
    return await query<Service>(
      "SELECT * FROM services WHERE is_active = true ORDER BY order_index ASC"
    );
  }, []);
}

export async function getSectors(): Promise<Sector[]> {
  const fromApi = await fastApi.fastApiGetSectors();
  if (fromApi && fromApi.length > 0) return fromApi;

  return safeQuery(async () => {
    return await query<Sector>(
      "SELECT * FROM sectors WHERE is_active = true ORDER BY order_index ASC"
    );
  }, []);
}

export async function getTestimonials(limit = 6): Promise<Testimonial[]> {
  const fromApi = await fastApi.fastApiGetTestimonials(limit);
  if (fromApi && fromApi.length > 0) return fromApi;

  return safeQuery(async () => {
    return await query<Testimonial>(
      "SELECT * FROM testimonials WHERE is_published = true ORDER BY order_index ASC LIMIT $1",
      [limit]
    );
  }, []);
}

export async function getFaqs(): Promise<Faq[]> {
  const fromApi = await fastApi.fastApiGetFaqs();
  if (fromApi && fromApi.length > 0) return fromApi;

  return safeQuery(async () => {
    return await query<Faq>(
      "SELECT * FROM faqs WHERE is_active = true ORDER BY order_index ASC"
    );
  }, []);
}

export async function getFeaturedPortfolio(limit = 6): Promise<Portfolio[]> {
  const fromApi = await fastApi.fastApiGetFeaturedPortfolio(limit);
  if (fromApi && fromApi.length > 0) return fromApi;

  return safeQuery(async () => {
    return await query<Portfolio>(
      "SELECT * FROM portfolio WHERE is_published = true ORDER BY is_featured DESC, order_index ASC LIMIT $1",
      [limit]
    );
  }, []);
}

export async function getAllPortfolio(): Promise<Portfolio[]> {
  const fromApi = await fastApi.fastApiGetAllPortfolio();
  if (fromApi && fromApi.length > 0) return fromApi;

  return safeQuery(async () => {
    return await query<Portfolio>(
      "SELECT * FROM portfolio WHERE is_published = true ORDER BY order_index ASC"
    );
  }, []);
}

export async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  const fromApi = await fastApi.fastApiGetPortfolioBySlug(slug);
  if (fromApi) return fromApi;

  return safeQuery(async () => {
    return await queryOne<Portfolio>(
      "SELECT * FROM portfolio WHERE slug = $1 AND is_published = true LIMIT 1",
      [slug]
    );
  }, null);
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const fromApi = await fastApi.fastApiGetTeamMembers();
  if (fromApi && fromApi.length > 0) return fromApi;

  return safeQuery(async () => {
    return await query<TeamMember>(
      "SELECT * FROM team_members WHERE is_active = true ORDER BY order_index ASC"
    );
  }, []);
}

export async function getPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
  const fromApi = await fastApi.fastApiGetPublishedBlogPosts(limit);
  if (fromApi && fromApi.length > 0) return fromApi;

  return safeQuery(async () => {
    if (limit) {
      return await query<BlogPost>(
        "SELECT * FROM blog_posts WHERE is_published = true ORDER BY published_at DESC LIMIT $1",
        [limit]
      );
    }
    return await query<BlogPost>(
      "SELECT * FROM blog_posts WHERE is_published = true ORDER BY published_at DESC"
    );
  }, []);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const fromApi = await fastApi.fastApiGetBlogPostBySlug(slug);
  if (fromApi) return fromApi;

  return safeQuery(async () => {
    return await queryOne<BlogPost>(
      "SELECT * FROM blog_posts WHERE slug = $1 AND is_published = true LIMIT 1",
      [slug]
    );
  }, null);
}
