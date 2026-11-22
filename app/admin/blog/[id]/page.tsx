import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { queryOne } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetBlog } from "@/lib/fastapi";
import { saveBlogPost } from "../actions";
import type { BlogPost } from "@/types/database";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAdminToken();
  let data: BlogPost | null = null;

  if (token) {
    const list = await fastApiAdminGetBlog(token);
    data = list.find((b) => b.id === id) || null;
  }

  if (!data) {
    data = await queryOne<BlogPost>(
      "SELECT * FROM blog_posts WHERE id = $1 LIMIT 1",
      [id]
    );
  }

  if (!data) notFound();
  return <BlogForm initial={data} action={saveBlogPost} />;
}
