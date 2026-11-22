"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { getCurrentUser, requireAdmin, getAdminToken } from "@/lib/auth";
import {
  getArray,
  getBool,
  getJson,
  getOptionalString,
  getString,
} from "@/lib/admin/parse";
import { revalidateForTable } from "@/lib/admin/revalidate";
import { slugify } from "@/lib/utils";
import { fastApiAdminSaveBlog, fastApiAdminDeleteBlog } from "@/lib/fastapi";

export async function saveBlogPost(formData: FormData) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const id = getOptionalString(formData, "id");
  const title = getString(formData, "title");
  const slug = getString(formData, "slug") || slugify(title);
  const isPublished = getBool(formData, "is_published");
  const excerpt = getOptionalString(formData, "excerpt");
  const cover_image = getOptionalString(formData, "cover_image");
  const content = getJson(formData, "content");
  const tags = getArray(formData, "tags");
  const meta_title = getOptionalString(formData, "meta_title");
  const meta_description = getOptionalString(formData, "meta_description");

  const user = await getCurrentUser();
  const author_id = user?.id ?? null;

  if (!title) return { error: "Judul wajib diisi" };

  const token = await getAdminToken();
  if (token) {
    try {
      const saved = await fastApiAdminSaveBlog(
        token,
        {
          slug,
          title,
          excerpt,
          cover_image,
          content,
          tags,
          is_published: isPublished,
          meta_title,
          meta_description,
          author_id: author_id && author_id !== "admin-root" ? author_id : undefined,
        },
        id || undefined
      );
      if (saved) {
        revalidateForTable("blog_posts");
        if (slug) revalidatePath(`/blog/${slug}`);
        return;
      }
    } catch {
      // fallback to DB if API unavailable
    }
  }

  try {
    if (id) {
      await query(
        `UPDATE blog_posts
         SET slug = $1, title = $2, excerpt = $3, cover_image = $4, content = $5,
             tags = $6, is_published = $7,
             published_at = CASE WHEN $7 = true AND published_at IS NULL THEN NOW() ELSE published_at END,
             meta_title = $8, meta_description = $9, updated_at = NOW()
         WHERE id = $10`,
        [
          slug,
          title,
          excerpt,
          cover_image,
          content ? JSON.stringify(content) : null,
          tags,
          isPublished,
          meta_title,
          meta_description,
          id,
        ]
      );
    } else {
      await query(
        `INSERT INTO blog_posts (
           slug, title, excerpt, cover_image, content,
           tags, is_published, published_at, meta_title, meta_description, author_id
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, CASE WHEN $7 = true THEN NOW() ELSE NULL END, $8, $9, $10)`,
        [
          slug,
          title,
          excerpt,
          cover_image,
          content ? JSON.stringify(content) : null,
          tags,
          isPublished,
          meta_title,
          meta_description,
          author_id,
        ]
      );
    }
    revalidateForTable("blog_posts");
    if (slug) revalidatePath(`/blog/${slug}`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menyimpan artikel blog" };
  }
}

export async function deleteBlogPost(id: string) {
  if (!(await requireAdmin())) return { error: "Tidak diizinkan. Silakan login ulang." };

  const token = await getAdminToken();
  if (token) {
    try {
      const ok = await fastApiAdminDeleteBlog(token, id);
      if (ok) {
        revalidateForTable("blog_posts");
        return;
      }
    } catch {
      // fallback to DB if API unavailable
    }
  }

  try {
    await query("DELETE FROM blog_posts WHERE id = $1", [id]);
    revalidateForTable("blog_posts");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal menghapus artikel blog" };
  }
}
