"use server";

import { query, queryOne } from "@/lib/db";
import {
  getArray,
  getBool,
  getNumber,
  getOptionalString,
  getString,
} from "@/lib/admin/parse";
import { revalidateForTable } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/utils";

export async function saveService(formData: FormData) {
  const id = getOptionalString(formData, "id");
  const title = getString(formData, "title");
  const slug = getString(formData, "slug") || slugify(title);
  const icon = getOptionalString(formData, "icon");
  const description = getString(formData, "description");
  const tags = getArray(formData, "tags");
  const order_index = getNumber(formData, "order_index");
  const is_active = getBool(formData, "is_active");

  if (!title || !description) return { error: "Lengkapi field wajib" };

  try {
    if (id) {
      await query(
        `UPDATE services
         SET slug = $1, icon = $2, title = $3, description = $4, tags = $5, order_index = $6, is_active = $7, updated_at = NOW()
         WHERE id = $8`,
        [slug, icon, title, description, tags, order_index, is_active, id]
      );
    } else {
      await query(
        `INSERT INTO services (slug, icon, title, description, tags, order_index, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [slug, icon, title, description, tags, order_index, is_active]
      );
    }
    revalidateForTable("services");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan service" };
  }
}

export async function deleteService(id: string) {
  try {
    await query("DELETE FROM services WHERE id = $1", [id]);
    revalidateForTable("services");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus service" };
  }
}
