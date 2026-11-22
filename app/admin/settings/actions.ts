"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { requireAdmin, getAdminToken } from "@/lib/auth";
import { getOptionalString, getString } from "@/lib/admin/parse";
import { fastApiAdminUpdateSettings } from "@/lib/fastapi";
import type { Json } from "@/types/database";

export async function saveSettings(formData: FormData) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const heroStatsRaw = (formData.get("hero_stats_json") as string) ?? "[]";
  let hero_stats: Json = [];
  try {
    hero_stats = JSON.parse(heroStatsRaw);
  } catch {
    return { error: "Format Hero Stats JSON tidak valid" };
  }

  const social_links = {
    instagram: getOptionalString(formData, "instagram"),
    linkedin: getOptionalString(formData, "linkedin"),
    youtube: getOptionalString(formData, "youtube"),
    twitter: getOptionalString(formData, "twitter"),
  };

  const site_name = getString(formData, "site_name") || "Byteshift Consulting";
  const tagline = getOptionalString(formData, "tagline");
  const logo_url = getOptionalString(formData, "logo_url");
  const whatsapp_number = getOptionalString(formData, "whatsapp_number");
  const email = getOptionalString(formData, "email");
  const address = getOptionalString(formData, "address");

  const token = await getAdminToken();
  if (token) {
    try {
      const updated = await fastApiAdminUpdateSettings(token, {
        site_name,
        tagline,
        logo_url,
        whatsapp_number,
        email,
        address,
        social_links,
        hero_stats,
      });
      if (updated) {
        revalidatePath("/admin/settings");
        revalidatePath("/", "layout");
        return;
      }
    } catch {
      // fallback
    }
  }

  try {
    await query(
      `INSERT INTO site_settings (
         id, site_name, tagline, logo_url, whatsapp_number, email, address,
         social_links, hero_stats, updated_at
       )
       VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (id) DO UPDATE SET
         site_name = $1,
         tagline = $2,
         logo_url = $3,
         whatsapp_number = $4,
         email = $5,
         address = $6,
         social_links = $7,
         hero_stats = $8,
         updated_at = NOW()`,
      [
        site_name,
        tagline,
        logo_url,
        whatsapp_number,
        email,
        address,
        JSON.stringify(social_links),
        JSON.stringify(hero_stats),
      ]
    );

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan pengaturan" };
  }
}
