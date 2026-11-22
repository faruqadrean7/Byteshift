"use server";

import { query } from "@/lib/db";
import { requireAdmin, getAdminToken } from "@/lib/auth";
import {
  getArray,
  getBool,
  getNumber,
  getOptionalString,
  getString,
} from "@/lib/admin/parse";
import { revalidateForTable } from "@/lib/admin/revalidate";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { fastApiAdminSaveSector, fastApiAdminDeleteSector } from "@/lib/fastapi";

export async function saveSector(formData: FormData) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const id = getOptionalString(formData, "id");
  const name = getString(formData, "name");
  const slug = getString(formData, "slug") || slugify(name);
  const category_tag = getString(formData, "category_tag");
  const filter_group = getString(formData, "filter_group") || "finance";
  const image = getString(formData, "image");
  const executive_summary = getString(formData, "executive_summary");
  const key_benefits = getArray(formData, "key_benefits");
  const impact_metric = getString(formData, "impact_metric");
  const href = getOptionalString(formData, "href") || "/kontak";
  const order_index = getNumber(formData, "order_index");
  const is_active = getBool(formData, "is_active");

  if (!name || !category_tag || !executive_summary) {
    return { error: "Lengkapi field wajib (Nama, Category Tag, Executive Summary)" };
  }

  const token = await getAdminToken();
  if (token) {
    try {
      const saved = await fastApiAdminSaveSector(
        token,
        {
          slug,
          name,
          category_tag,
          filter_group,
          image,
          executive_summary,
          key_benefits,
          impact_metric,
          href,
          order_index,
          is_active,
        },
        id || undefined
      );
      if (saved) {
        revalidateForTable("sectors");
        revalidatePath("/");
        return;
      }
    } catch {
      // fallback
    }
  }

  try {
    if (id) {
      await query(
        `UPDATE sectors
         SET slug = $1, name = $2, category_tag = $3, filter_group = $4, image = $5,
             executive_summary = $6, key_benefits = $7, impact_metric = $8, href = $9,
             order_index = $10, is_active = $11, updated_at = NOW()
         WHERE id = $12`,
        [
          slug,
          name,
          category_tag,
          filter_group,
          image,
          executive_summary,
          key_benefits,
          impact_metric,
          href,
          order_index,
          is_active,
          id,
        ]
      );
    } else {
      await query(
        `INSERT INTO sectors (
           slug, name, category_tag, filter_group, image,
           executive_summary, key_benefits, impact_metric, href, order_index, is_active
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          slug,
          name,
          category_tag,
          filter_group,
          image,
          executive_summary,
          key_benefits,
          impact_metric,
          href,
          order_index,
          is_active,
        ]
      );
    }
    revalidateForTable("sectors");
    revalidatePath("/");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan sektor" };
  }
}

export async function deleteSector(id: string) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const token = await getAdminToken();
  if (token) {
    try {
      const ok = await fastApiAdminDeleteSector(token, id);
      if (ok) {
        revalidateForTable("sectors");
        revalidatePath("/");
        return;
      }
    } catch {
      // fallback
    }
  }

  try {
    await query("DELETE FROM sectors WHERE id = $1", [id]);
    revalidateForTable("sectors");
    revalidatePath("/");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus sektor" };
  }
}
