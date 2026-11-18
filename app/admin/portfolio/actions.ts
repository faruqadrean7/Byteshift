"use server";

import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  getArray,
  getBool,
  getJson,
  getNumber,
  getOptionalNumber,
  getOptionalString,
  getString,
} from "@/lib/admin/parse";
import { revalidateForTable } from "@/lib/admin/revalidate";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import type { Json } from "@/types/database";

export async function savePortfolio(formData: FormData) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const id = getOptionalString(formData, "id");
  const title = getString(formData, "title");
  const slug = getString(formData, "slug") || slugify(title);
  const category = getString(formData, "category");
  const client_name = getOptionalString(formData, "client_name");
  const year = getOptionalNumber(formData, "year");
  const cover_image = getOptionalString(formData, "cover_image");
  const short_desc = getOptionalString(formData, "short_desc");
  const full_content = getJson(formData, "full_content");
  const tech_stack = getArray(formData, "tech_stack");
  const demo_url = getOptionalString(formData, "demo_url");
  const project_url = getOptionalString(formData, "project_url");
  const is_featured = getBool(formData, "is_featured");
  const is_published = getBool(formData, "is_published");
  const order_index = getNumber(formData, "order_index");

  // Parse gallery
  let gallery: string[] = [];
  const galleryJson = getOptionalString(formData, "gallery_json");
  if (galleryJson) {
    try {
      const parsed = JSON.parse(galleryJson);
      if (Array.isArray(parsed)) gallery = parsed.filter((x) => typeof x === "string" && x.length > 0);
    } catch {
      // fallback
    }
  }
  if (!gallery.length) {
    gallery = getArray(formData, "gallery");
  }

  const metricsRaw = getOptionalString(formData, "metrics_json");
  let metrics: Json = null;
  if (metricsRaw) {
    try {
      metrics = JSON.parse(metricsRaw);
    } catch {
      return { error: "Format JSON metrics tidak valid" };
    }
  }

  if (!title || !category) return { error: "Lengkapi field wajib" };

  try {
    if (id) {
      await query(
        `UPDATE portfolio
         SET slug = $1, title = $2, category = $3, client_name = $4, year = $5,
             cover_image = $6, gallery = $7, short_desc = $8, full_content = $9, tech_stack = $10,
             demo_url = $11, project_url = $12, metrics = $13, is_featured = $14,
             is_published = $15, order_index = $16, updated_at = NOW()
         WHERE id = $17`,
        [
          slug,
          title,
          category,
          client_name,
          year,
          cover_image,
          gallery,
          short_desc,
          full_content ? JSON.stringify(full_content) : null,
          tech_stack,
          demo_url,
          project_url,
          metrics ? JSON.stringify(metrics) : null,
          is_featured,
          is_published,
          order_index,
          id,
        ]
      );
    } else {
      await query(
        `INSERT INTO portfolio (
           slug, title, category, client_name, year,
           cover_image, gallery, short_desc, full_content, tech_stack,
           demo_url, project_url, metrics, is_featured,
           is_published, order_index
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          slug,
          title,
          category,
          client_name,
          year,
          cover_image,
          gallery,
          short_desc,
          full_content ? JSON.stringify(full_content) : null,
          tech_stack,
          demo_url,
          project_url,
          metrics ? JSON.stringify(metrics) : null,
          is_featured,
          is_published,
          order_index,
        ]
      );
    }
    revalidateForTable("portfolio");
    if (slug) revalidatePath(`/portfolio/${slug}`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan portfolio" };
  }
}

export async function deletePortfolio(id: string) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };
  try {
    await query("DELETE FROM portfolio WHERE id = $1", [id]);
    revalidateForTable("portfolio");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus portfolio" };
  }
}
