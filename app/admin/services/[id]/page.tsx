import { notFound } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";
import { queryOne } from "@/lib/db";
import { saveService } from "../actions";
import type { Service } from "@/types/database";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await queryOne<Service>(
    "SELECT * FROM services WHERE id = $1 LIMIT 1",
    [id]
  );
  if (!data) notFound();
  return <ServiceForm initial={data} action={saveService} />;
}
