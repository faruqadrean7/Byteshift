import { notFound } from "next/navigation";
import PortfolioForm from "@/components/admin/PortfolioForm";
import { queryOne } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetPortfolio } from "@/lib/fastapi";
import { savePortfolio } from "../actions";
import type { Portfolio } from "@/types/database";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAdminToken();
  let data: Portfolio | null = null;

  if (token) {
    const list = await fastApiAdminGetPortfolio(token);
    data = list.find((p) => p.id === id) || null;
  }

  if (!data) {
    data = await queryOne<Portfolio>(
      "SELECT * FROM portfolio WHERE id = $1 LIMIT 1",
      [id]
    );
  }

  if (!data) notFound();
  return <PortfolioForm initial={data} action={savePortfolio} />;
}
