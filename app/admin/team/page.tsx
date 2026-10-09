import Image from "next/image";
import Link from "next/link";
import { query } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { publicMediaUrl } from "@/lib/storage";
import { deleteTeamMember } from "./actions";
import type { TeamMember } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await query<TeamMember>(
    "SELECT * FROM team_members ORDER BY order_index ASC"
  );

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Tim & Praktisi"
        subtitle="Daftar pimpinan dan principal engineer yang tampil di halaman Tentang."
        newHref="/admin/team/new"
      />
      <AdminTable
        columns={[
          { key: "i", label: "", className: "w-16" },
          { key: "n", label: "Nama & Jabatan" },
          { key: "o", label: "Urut", className: "w-16" },
          { key: "p", label: "Status", className: "w-20" },
          { key: "x", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((m) => [
          <div
            key="i"
            className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-700 bg-slate-800"
          >
            {m.photo_url ? (
              <Image
                src={publicMediaUrl(m.photo_url)}
                alt={m.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs font-bold text-blue-400">
                {m.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>,
          <div key="n">
            <Link
              href={`/admin/team/${m.id}`}
              className="font-semibold text-white hover:text-blue-400 transition-colors"
            >
              {m.name}
            </Link>
            <div className="text-xs text-slate-400">{m.role}</div>
          </div>,
          <span key="o" className="font-mono text-xs text-slate-300">{m.order_index}</span>,
          m.is_active ? (
            <Badge key="p" variant="success">
              Aktif
            </Badge>
          ) : (
            <Badge key="p" variant="muted">
              Nonaktif
            </Badge>
          ),
          <RowActions
            key="x"
            editHref={`/admin/team/${m.id}`}
            onDelete={async () => {
              "use server";
              return await deleteTeamMember(m.id);
            }}
          />,
        ])}
      />
    </div>
  );
}
