import { notFound } from "next/navigation";
import SectorForm from "@/components/admin/SectorForm";
import { queryOne } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetSectors } from "@/lib/fastapi";
import { saveSector } from "../actions";
import type { Sector } from "@/types/database";

export default async function EditSectorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAdminToken();
  let data: Sector | null = null;

  if (token) {
    const list = await fastApiAdminGetSectors(token);
    data = list.find((s) => s.id === id) || null;
  }

  if (!data) {
    data = await queryOne<Sector>(
      "SELECT * FROM sectors WHERE id = $1 LIMIT 1",
      [id]
    );
  }

  if (!data) notFound();
  return <SectorForm initial={data} action={saveSector} />;
}
