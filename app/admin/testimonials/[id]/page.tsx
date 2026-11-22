import { notFound } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { queryOne } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetTestimonials } from "@/lib/fastapi";
import { saveTestimonial } from "../actions";
import type { Testimonial } from "@/types/database";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAdminToken();
  let data: Testimonial | null = null;

  if (token) {
    const list = await fastApiAdminGetTestimonials(token);
    data = list.find((t) => t.id === id) || null;
  }

  if (!data) {
    data = await queryOne<Testimonial>(
      "SELECT * FROM testimonials WHERE id = $1 LIMIT 1",
      [id]
    );
  }

  if (!data) notFound();
  return <TestimonialForm initial={data} action={saveTestimonial} />;
}
