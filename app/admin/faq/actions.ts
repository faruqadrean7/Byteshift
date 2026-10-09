"use server";

import { query } from "@/lib/db";
import {
  getBool,
  getNumber,
  getOptionalString,
  getString,
} from "@/lib/admin/parse";
import { revalidateForTable } from "@/lib/admin/revalidate";

export async function saveFaq(formData: FormData) {
  const id = getOptionalString(formData, "id");
  const question = getString(formData, "question");
  const answer = getString(formData, "answer");
  const category = getOptionalString(formData, "category") || "general";
  const order_index = getNumber(formData, "order_index");
  const is_active = getBool(formData, "is_active");

  if (!question || !answer) return { error: "Lengkapi field wajib" };

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
  try {
    await query("DELETE FROM faqs WHERE id = $1", [id]);
    revalidateForTable("faqs");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus FAQ" };
  }
}
