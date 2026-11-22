import { notFound } from "next/navigation";
import FaqForm from "@/components/admin/FaqForm";
import { queryOne } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetFaqs } from "@/lib/fastapi";
import { saveFaq } from "../actions";
import type { Faq } from "@/types/database";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAdminToken();
  let data: Faq | null = null;

  if (token) {
    const list = await fastApiAdminGetFaqs(token);
    data = list.find((f) => f.id === id) || null;
  }

  if (!data) {
    data = await queryOne<Faq>("SELECT * FROM faqs WHERE id = $1 LIMIT 1", [
      id,
    ]);
  }

  if (!data) notFound();
  return <FaqForm initial={data} action={saveFaq} />;
}
