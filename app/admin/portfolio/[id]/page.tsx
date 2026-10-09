import { notFound } from "next/navigation";
import PortfolioForm from "@/components/admin/PortfolioForm";
import { queryOne } from "@/lib/db";
import { savePortfolio } from "../actions";
import type { Portfolio } from "@/types/database";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await queryOne<Portfolio>(
    "SELECT * FROM portfolio WHERE id = $1 LIMIT 1",
    [id]
  );
  if (!data) notFound();
  return <PortfolioForm initial={data} action={savePortfolio} />;
}
