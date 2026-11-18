"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function updateLead(
  id: string,
  patch: { status?: string; notes?: string }
) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };
  try {
    if (patch.status !== undefined && patch.notes !== undefined) {
      await query(
        "UPDATE leads SET status = $1, notes = $2, updated_at = NOW() WHERE id = $3",
        [patch.status, patch.notes, id]
      );
    } else if (patch.status !== undefined) {
      await query(
        "UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2",
        [patch.status, id]
      );
    } else if (patch.notes !== undefined) {
      await query(
        "UPDATE leads SET notes = $1, updated_at = NOW() WHERE id = $2",
        [patch.notes, id]
      );
    }
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal memperbarui data lead" };
  }
}

export async function deleteLead(id: string) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };
  try {
    await query("DELETE FROM leads WHERE id = $1", [id]);
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus data lead" };
  }
}
