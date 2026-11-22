import Link from "next/link";
import { query } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetFaqs } from "@/lib/fastapi";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { deleteFaq } from "./actions";
import type { Faq } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Page() {
  const token = await getAdminToken();
  let items: Faq[] = [];

  if (token) {
    items = await fastApiAdminGetFaqs(token);
  }

  if (!items.length) {
    items = await query<Faq>("SELECT * FROM faqs ORDER BY order_index ASC");
  }

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="FAQ"
        subtitle="Pertanyaan umum yang sering ditanyakan klien."
        newHref="/admin/faq/new"
      />
      <AdminTable
        columns={[
          { key: "q", label: "Pertanyaan" },
          { key: "c", label: "Kategori", className: "w-32" },
          { key: "o", label: "Urut", className: "w-16" },
          { key: "a", label: "Status", className: "w-24" },
          { key: "x", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((f) => [
          <div key="q">
            <Link
              href={`/admin/faq/${f.id}`}
              className="font-semibold text-slate-100 hover:text-blue-400 transition-colors"
            >
              {f.question}
            </Link>
          </div>,
          <span key="c" className="text-xs text-slate-300 capitalize">
            {f.category}
          </span>,
          <span key="o" className="font-mono text-xs text-slate-300">
            {f.order_index}
          </span>,
          f.is_active ? (
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
            editHref={`/admin/faq/${f.id}`}
            onDelete={deleteFaq.bind(null, f.id)}
          />,
        ])}
      />
    </div>
  );
}
