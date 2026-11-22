import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetTeam } from "@/lib/fastapi";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { publicMediaUrl } from "@/lib/storage";
import { deleteTeamMember } from "./actions";
import type { TeamMember } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Page() {
  const token = await getAdminToken();
  let items: TeamMember[] = [];

  if (token) {
    items = await fastApiAdminGetTeam(token);
  }

  if (!items.length) {
    items = await query<TeamMember>(
      "SELECT * FROM team_members ORDER BY order_index ASC"
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Tim & Profil"
        subtitle="Daftar engineer, konsultan, dan leadership."
        newHref="/admin/team/new"
      />
      <AdminTable
        columns={[
          { key: "i", label: "", className: "w-16" },
          { key: "n", label: "Nama & Role" },
          { key: "o", label: "Urut", className: "w-16" },
          { key: "a", label: "Status", className: "w-24" },
          { key: "x", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((m) => [
          <div
            key="i"
            className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-700 bg-slate-800"
          >
            {m.photo_url && (
              <Image
                src={publicMediaUrl(m.photo_url)}
                alt={m.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            )}
          </div>,
          <div key="n">
            <Link
              href={`/admin/team/${m.id}`}
              className="font-semibold text-slate-100 hover:text-blue-400 transition-colors"
            >
              {m.name}
            </Link>
            <div className="text-xs text-slate-400">{m.role}</div>
          </div>,
          <span key="o" className="font-mono text-xs text-slate-300">
            {m.order_index}
          </span>,
          m.is_active ? (
            <Badge key="a" variant="success">
              Aktif
            </Badge>
          ) : (
            <Badge key="a" variant="muted">
              Nonaktif
            </Badge>
          ),
          <RowActions
            key="x"
            editHref={`/admin/team/${m.id}`}
            onDelete={deleteTeamMember.bind(null, m.id)}
          />,
        ])}
      />
    </div>
  );
}
