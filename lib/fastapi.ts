/**
 * FastAPI Client for ByteShift Studio
 * Decoupled Backend Integration (Next.js FE/CMS <-> FastAPI BE)
 */

import type {
  Service,
  Sector,
  Portfolio,
  Testimonial,
  Faq,
  Package,
  TeamMember,
  BlogPost,
  SiteSettings,
  Lead,
} from "@/types/database";

const FASTAPI_BASE_URL =
  process.env.FASTAPI_URL || process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

const API_V1 = `${FASTAPI_BASE_URL.replace(/\/$/, "")}/api/v1`;

interface ApiOptions extends RequestInit {
  token?: string;
  revalidate?: number | false;
}

export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T | null> {
  const { token, revalidate, ...rest } = options;
  const url = `${API_V1}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(rest.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    ...rest,
    headers,
  };

  if (typeof revalidate !== "undefined") {
    fetchOptions.next = { revalidate };
  }

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      if (res.status === 404) return null;
      const errorText = await res.text();
      if (process.env.DEBUG_FASTAPI === "true") {
        console.warn(`[FastAPI] ${options.method || "GET"} ${url} returned ${res.status}:`, errorText);
      }
      return null;
    }
    return (await res.json()) as T;
  } catch (error: any) {
    if (process.env.DEBUG_FASTAPI === "true") {
      console.warn(`[FastAPI] Connection failed to ${url}:`, error?.message || error);
    }
    return null;
  }
}

// ==========================================
// Auth Endpoints
// ==========================================

export interface LoginResult {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export async function fastApiAdminLogin(
  email: string,
  password: string
): Promise<LoginResult | null> {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
}

// ==========================================
// Public Endpoints
// ==========================================

export async function fastApiGetSiteSettings(): Promise<SiteSettings | null> {
  return apiFetch<SiteSettings>("/settings", { revalidate: 60 });
}

export async function fastApiGetServices(): Promise<Service[]> {
  return (await apiFetch<Service[]>("/services", { revalidate: 60 })) || [];
}

export async function fastApiGetSectors(): Promise<Sector[]> {
  return (await apiFetch<Sector[]>("/sectors", { revalidate: 60 })) || [];
}

export async function fastApiGetFeaturedPortfolio(limit = 6): Promise<Portfolio[]> {
  return (
    (await apiFetch<Portfolio[]>(`/portfolio?featured_only=true&limit=${limit}`, {
      revalidate: 60,
    })) || []
  );
}

export async function fastApiGetAllPortfolio(): Promise<Portfolio[]> {
  return (await apiFetch<Portfolio[]>("/portfolio", { revalidate: 60 })) || [];
}

export async function fastApiGetPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  return apiFetch<Portfolio>(`/portfolio/${encodeURIComponent(slug)}`, { revalidate: 60 });
}

export async function fastApiGetTestimonials(limit = 6): Promise<Testimonial[]> {
  return (await apiFetch<Testimonial[]>(`/testimonials?limit=${limit}`, { revalidate: 60 })) || [];
}

export async function fastApiGetFaqs(): Promise<Faq[]> {
  return (await apiFetch<Faq[]>("/faqs", { revalidate: 60 })) || [];
}

export async function fastApiGetPackages(): Promise<Package[]> {
  return (await apiFetch<Package[]>("/packages", { revalidate: 60 })) || [];
}

export async function fastApiGetTeamMembers(): Promise<TeamMember[]> {
  return (await apiFetch<TeamMember[]>("/team", { revalidate: 60 })) || [];
}

export async function fastApiGetPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
  const query = limit ? `?limit=${limit}` : "";
  return (await apiFetch<BlogPost[]>(`/blog${query}`, { revalidate: 60 })) || [];
}

export async function fastApiGetBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return apiFetch<BlogPost>(`/blog/${encodeURIComponent(slug)}`, { revalidate: 60 });
}

export async function fastApiSubmitLead(leadData: {
  name: string;
  email?: string | null;
  phone_wa?: string | null;
  project_type?: string | null;
  budget_range?: string | null;
  message?: string | null;
  source?: string | null;
}): Promise<Lead | null> {
  return apiFetch<Lead>("/leads", {
    method: "POST",
    body: JSON.stringify(leadData),
    cache: "no-store",
  });
}

// ==========================================
// Admin CMS Endpoints (Protected by Bearer JWT)
// ==========================================

// Services
export async function fastApiAdminGetServices(token: string): Promise<Service[]> {
  return (await apiFetch<Service[]>("/admin/services", { token, cache: "no-store" })) || [];
}

export async function fastApiAdminSaveService(
  token: string,
  data: Partial<Service>,
  id?: string
): Promise<Service | null> {
  const endpoint = id ? `/admin/services/${id}` : "/admin/services";
  const method = id ? "PUT" : "POST";
  return apiFetch<Service>(endpoint, {
    method,
    token,
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function fastApiAdminDeleteService(token: string, id: string): Promise<boolean> {
  const res = await apiFetch<{ ok: boolean }>(`/admin/services/${id}`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
  return !!res?.ok;
}

// Sectors
export async function fastApiAdminGetSectors(token: string): Promise<Sector[]> {
  return (await apiFetch<Sector[]>("/admin/sectors", { token, cache: "no-store" })) || [];
}

export async function fastApiAdminSaveSector(
  token: string,
  data: Partial<Sector>,
  id?: string
): Promise<Sector | null> {
  const endpoint = id ? `/admin/sectors/${id}` : "/admin/sectors";
  const method = id ? "PUT" : "POST";
  return apiFetch<Sector>(endpoint, {
    method,
    token,
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function fastApiAdminDeleteSector(token: string, id: string): Promise<boolean> {
  const res = await apiFetch<{ ok: boolean }>(`/admin/sectors/${id}`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
  return !!res?.ok;
}

// Portfolio
export async function fastApiAdminGetPortfolio(token: string): Promise<Portfolio[]> {
  return (await apiFetch<Portfolio[]>("/admin/portfolio", { token, cache: "no-store" })) || [];
}

export async function fastApiAdminSavePortfolio(
  token: string,
  data: Partial<Portfolio>,
  id?: string
): Promise<Portfolio | null> {
  const endpoint = id ? `/admin/portfolio/${id}` : "/admin/portfolio";
  const method = id ? "PUT" : "POST";
  return apiFetch<Portfolio>(endpoint, {
    method,
    token,
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function fastApiAdminDeletePortfolio(token: string, id: string): Promise<boolean> {
  const res = await apiFetch<{ ok: boolean }>(`/admin/portfolio/${id}`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
  return !!res?.ok;
}

// Blog
export async function fastApiAdminGetBlog(token: string): Promise<BlogPost[]> {
  return (await apiFetch<BlogPost[]>("/admin/blog", { token, cache: "no-store" })) || [];
}

export async function fastApiAdminSaveBlog(
  token: string,
  data: Partial<BlogPost>,
  id?: string
): Promise<BlogPost | null> {
  const endpoint = id ? `/admin/blog/${id}` : "/admin/blog";
  const method = id ? "PUT" : "POST";
  return apiFetch<BlogPost>(endpoint, {
    method,
    token,
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function fastApiAdminDeleteBlog(token: string, id: string): Promise<boolean> {
  const res = await apiFetch<{ ok: boolean }>(`/admin/blog/${id}`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
  return !!res?.ok;
}

// Leads (CRM)
export async function fastApiAdminGetLeads(token: string, statusFilter?: string): Promise<Lead[]> {
  const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
  return (await apiFetch<Lead[]>(`/admin/leads${query}`, { token, cache: "no-store" })) || [];
}

export async function fastApiAdminUpdateLead(
  token: string,
  id: string,
  data: { status?: string; notes?: string }
): Promise<Lead | null> {
  return apiFetch<Lead>(`/admin/leads/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function fastApiAdminDeleteLead(token: string, id: string): Promise<boolean> {
  const res = await apiFetch<{ ok: boolean }>(`/admin/leads/${id}`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
  return !!res?.ok;
}

// Testimonials
export async function fastApiAdminGetTestimonials(token: string): Promise<Testimonial[]> {
  return (await apiFetch<Testimonial[]>("/admin/testimonials", { token, cache: "no-store" })) || [];
}

export async function fastApiAdminSaveTestimonial(
  token: string,
  data: Partial<Testimonial>,
  id?: string
): Promise<Testimonial | null> {
  const endpoint = id ? `/admin/testimonials/${id}` : "/admin/testimonials";
  const method = id ? "PUT" : "POST";
  return apiFetch<Testimonial>(endpoint, {
    method,
    token,
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function fastApiAdminDeleteTestimonial(token: string, id: string): Promise<boolean> {
  const res = await apiFetch<{ ok: boolean }>(`/admin/testimonials/${id}`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
  return !!res?.ok;
}

// FAQs
export async function fastApiAdminGetFaqs(token: string): Promise<Faq[]> {
  return (await apiFetch<Faq[]>("/admin/faqs", { token, cache: "no-store" })) || [];
}

export async function fastApiAdminSaveFaq(
  token: string,
  data: Partial<Faq>,
  id?: string
): Promise<Faq | null> {
  const endpoint = id ? `/admin/faqs/${id}` : "/admin/faqs";
  const method = id ? "PUT" : "POST";
  return apiFetch<Faq>(endpoint, {
    method,
    token,
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function fastApiAdminDeleteFaq(token: string, id: string): Promise<boolean> {
  const res = await apiFetch<{ ok: boolean }>(`/admin/faqs/${id}`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
  return !!res?.ok;
}

// Team
export async function fastApiAdminGetTeam(token: string): Promise<TeamMember[]> {
  return (await apiFetch<TeamMember[]>("/admin/team", { token, cache: "no-store" })) || [];
}

export async function fastApiAdminSaveTeam(
  token: string,
  data: Partial<TeamMember>,
  id?: string
): Promise<TeamMember | null> {
  const endpoint = id ? `/admin/team/${id}` : "/admin/team";
  const method = id ? "PUT" : "POST";
  return apiFetch<TeamMember>(endpoint, {
    method,
    token,
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function fastApiAdminDeleteTeam(token: string, id: string): Promise<boolean> {
  const res = await apiFetch<{ ok: boolean }>(`/admin/team/${id}`, {
    method: "DELETE",
    token,
    cache: "no-store",
  });
  return !!res?.ok;
}

// Settings
export async function fastApiAdminUpdateSettings(
  token: string,
  data: Partial<SiteSettings>
): Promise<SiteSettings | null> {
  return apiFetch<SiteSettings>("/admin/settings", {
    method: "PUT",
    token,
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

// Upload File
export async function fastApiUpload(token: string, formData: FormData): Promise<{ url: string; key: string } | null> {
  return apiFetch<{ url: string; key: string }>("/upload", {
    method: "POST",
    token,
    body: formData,
    cache: "no-store",
  });
}
