import { notFound } from "next/navigation";
import FaqForm from "@/components/admin/FaqForm";
import { queryOne } from "@/lib/db";
import { saveFaq } from "../actions";
import type { Faq } from "@/types/database";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await queryOne<Faq>(
    "SELECT * FROM faqs WHERE id = $1 LIMIT 1",
    [id]
  );
  if (!data) notFound();
  return <FaqForm initial={data} action={saveFaq} />;
}
