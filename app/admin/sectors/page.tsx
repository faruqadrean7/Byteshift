import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetSectors } from "@/lib/fastapi";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { publicMediaUrl } from "@/lib/storage";
import { deleteSector } from "./actions";
import type { Sector } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminSectorsPage() {
  const token = await getAdminToken();
  let items: Sector[] = [];

  if (token) {
    items = await fastApiAdminGetSectors(token);
  }

  if (!items.length) {
    items = await query<Sector>(
      "SELECT * FROM sectors ORDER BY order_index ASC"
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Sektor Solusi"
        subtitle="Kelola kartu sektor industri dan solusi teruji yang tampil di homepage."
        newHref="/admin/sectors/new"
      />
      <AdminTable
        columns={[
          { key: "i", label: "", className: "w-20" },
          { key: "n", label: "Sektor & Tag" },
          { key: "f", label: "Tab Filter", className: "w-36" },
          { key: "m", label: "Metrik Dampak", className: "w-44" },
          { key: "o", label: "Urut", className: "w-16" },
          { key: "a", label: "Status", className: "w-20" },
          { key: "x", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((s) => [
          <div
            key="i"
            className="relative h-12 w-16 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-sm"
          >
            {s.image && (
              <Image
                src={publicMediaUrl(s.image)}
                alt={s.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            )}
          </div>,
          <div key="n">
            <Link
              href={`/admin/sectors/${s.id}`}
              className="font-semibold text-slate-100 hover:text-blue-400 transition-colors"
            >
              {s.name}
            </Link>
            <div className="text-xs text-slate-400">
              <span className="text-blue-400 font-medium">{s.category_tag}</span> · {s.slug}
            </div>
          </div>,
          <Badge key="f" variant="secondary" className="capitalize">
            {s.filter_group}
          </Badge>,
          <span key="m" className="text-xs font-mono font-medium text-emerald-400">
            {s.impact_metric}
          </span>,
          <span key="o" className="font-mono text-xs text-slate-300">
            {s.order_index}
          </span>,
          s.is_active ? (
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
            editHref={`/admin/sectors/${s.id}`}
            onDelete={deleteSector.bind(null, s.id)}
          />,
        ])}
      />
    </div>
  );
}
