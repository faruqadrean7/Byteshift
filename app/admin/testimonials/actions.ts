"use server";

import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  getBool,
  getNumber,
  getOptionalString,
  getString,
} from "@/lib/admin/parse";
import { revalidateForTable } from "@/lib/admin/revalidate";

export async function saveTestimonial(formData: FormData) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const id = getOptionalString(formData, "id");
  const name = getString(formData, "name");
  const role = getOptionalString(formData, "role");
  const company = getOptionalString(formData, "company");
  const content = getString(formData, "content");
  const rating = Math.min(Math.max(getNumber(formData, "rating", 5), 1), 5);
  const avatar_url = getOptionalString(formData, "avatar_url");
  const is_published = getBool(formData, "is_published");
  const order_index = getNumber(formData, "order_index");

  if (!name || !content) return { error: "Lengkapi field wajib" };

  try {
    if (id) {
      await query(
        `UPDATE testimonials
         SET name = $1, role = $2, company = $3, content = $4, rating = $5,
             avatar_url = $6, is_published = $7, order_index = $8
         WHERE id = $9`,
        [name, role, company, content, rating, avatar_url, is_published, order_index, id]
      );
    } else {
      await query(
        `INSERT INTO testimonials (name, role, company, content, rating, avatar_url, is_published, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [name, role, company, content, rating, avatar_url, is_published, order_index]
      );
    }
    revalidateForTable("testimonials");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan testimoni" };
  }
}

export async function deleteTestimonial(id: string) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };
  try {
    await query("DELETE FROM testimonials WHERE id = $1", [id]);
    revalidateForTable("testimonials");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus testimoni" };
  }
}
