"use server";

import { query } from "@/lib/db";
import { requireAdmin, getAdminToken } from "@/lib/auth";
import {
  getBool,
  getNumber,
  getOptionalString,
  getString,
} from "@/lib/admin/parse";
import { revalidateForTable } from "@/lib/admin/revalidate";
import { fastApiAdminSaveFaq, fastApiAdminDeleteFaq } from "@/lib/fastapi";

export async function saveFaq(formData: FormData) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const id = getOptionalString(formData, "id");
  const question = getString(formData, "question");
  const answer = getString(formData, "answer");
  const category = getOptionalString(formData, "category") || "general";
  const order_index = getNumber(formData, "order_index");
  const is_active = getBool(formData, "is_active");

  if (!question || !answer) return { error: "Lengkapi field wajib" };

  const token = await getAdminToken();
  if (token) {
    try {
      const saved = await fastApiAdminSaveFaq(
        token,
        {
          question,
          answer,
          category,
          order_index,
          is_active,
        },
        id || undefined
      );
      if (saved) {
        revalidateForTable("faqs");
        return;
      }
    } catch {
      // fallback
    }
  }

  try {
    if (id) {
      await query(
        `UPDATE faqs
         SET question = $1, answer = $2, category = $3, order_index = $4, is_active = $5
         WHERE id = $6`,
        [question, answer, category, order_index, is_active, id]
      );
    } else {
      await query(
        `INSERT INTO faqs (question, answer, category, order_index, is_active)
         VALUES ($1, $2, $3, $4, $5)`,
        [question, answer, category, order_index, is_active]
      );
    }
    revalidateForTable("faqs");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan FAQ" };
  }
}

export async function deleteFaq(id: string) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const token = await getAdminToken();
  if (token) {
    try {
      const ok = await fastApiAdminDeleteFaq(token, id);
      if (ok) {
        revalidateForTable("faqs");
        return;
      }
    } catch {
      // fallback
    }
  }

  try {
    await query("DELETE FROM faqs WHERE id = $1", [id]);
    revalidateForTable("faqs");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus FAQ" };
  }
}
