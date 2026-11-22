import { notFound } from "next/navigation";
import TeamForm from "@/components/admin/TeamForm";
import { queryOne } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetTeam } from "@/lib/fastapi";
import { saveTeamMember } from "../actions";
import type { TeamMember } from "@/types/database";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAdminToken();
  let data: TeamMember | null = null;

  if (token) {
    const list = await fastApiAdminGetTeam(token);
    data = list.find((m) => m.id === id) || null;
  }

  if (!data) {
    data = await queryOne<TeamMember>(
      "SELECT * FROM team_members WHERE id = $1 LIMIT 1",
      [id]
    );
  }

  if (!data) notFound();
  return <TeamForm initial={data} action={saveTeamMember} />;
}
