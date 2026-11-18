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

export async function saveTeamMember(formData: FormData) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const id = getOptionalString(formData, "id");
  const name = getString(formData, "name");
  const role = getString(formData, "role");
  const bio = getOptionalString(formData, "bio");
  const photo_url = getOptionalString(formData, "photo_url");
  const order_index = getNumber(formData, "order_index");
  const is_active = getBool(formData, "is_active");
  const social = {
    instagram: getOptionalString(formData, "instagram"),
    linkedin: getOptionalString(formData, "linkedin"),
    twitter: getOptionalString(formData, "twitter"),
    github: getOptionalString(formData, "github"),
  };

  if (!name || !role) return { error: "Lengkapi field wajib" };

  try {
    if (id) {
      await query(
        `UPDATE team_members
         SET name = $1, role = $2, bio = $3, photo_url = $4, social_links = $5,
             order_index = $6, is_active = $7
         WHERE id = $8`,
        [name, role, bio, photo_url, JSON.stringify(social), order_index, is_active, id]
      );
    } else {
      await query(
        `INSERT INTO team_members (name, role, bio, photo_url, social_links, order_index, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, role, bio, photo_url, JSON.stringify(social), order_index, is_active]
      );
    }
    revalidateForTable("team_members");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan data anggota tim" };
  }
}

export async function deleteTeamMember(id: string) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };
  try {
    await query("DELETE FROM team_members WHERE id = $1", [id]);
    revalidateForTable("team_members");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus data tim" };
  }
}
