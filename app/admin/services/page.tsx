import Link from "next/link";
import { query } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetServices } from "@/lib/fastapi";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { deleteService } from "./actions";
import type { Service } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const token = await getAdminToken();
  let items: Service[] = [];

  if (token) {
    items = await fastApiAdminGetServices(token);
  }

  if (!items.length) {
    items = await query<Service>(
      "SELECT * FROM services ORDER BY order_index ASC"
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Services"
        subtitle="Kelola daftar layanan yang tampil di homepage."
        newHref="/admin/services/new"
      />
      <AdminTable
        columns={[
          { key: "title", label: "Judul" },
          { key: "tags", label: "Tags" },
          { key: "order", label: "Urut", className: "w-16" },
          { key: "active", label: "Aktif", className: "w-20" },
          { key: "actions", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((s) => [
          <div key="t">
            <Link href={`/admin/services/${s.id}`} className="font-semibold text-slate-100 hover:text-blue-400 transition-colors">
              {s.icon} {s.title}
            </Link>
            <div className="text-xs text-slate-400">{s.slug}</div>
          </div>,
          <div key="tags" className="flex flex-wrap gap-1">
            {s.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>,
          <span key="o" className="font-mono text-xs text-slate-300">{s.order_index}</span>,
          s.is_active ? (
            <Badge key="a" variant="success">Aktif</Badge>
          ) : (
            <Badge key="a" variant="muted">Nonaktif</Badge>
          ),
          <RowActions key="x" editHref={`/admin/services/${s.id}`} onDelete={deleteService.bind(null, s.id)} />,
        ])}
      />
    </div>
  );
}
