import { query } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { deleteFaq } from "./actions";
import type { Faq } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await query<Faq>(
    "SELECT * FROM faqs ORDER BY order_index ASC"
  );

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="FAQ"
        subtitle="Daftar pertanyaan yang sering diajukan calon klien."
        newHref="/admin/faq/new"
      />
      <AdminTable
        columns={[
          { key: "q", label: "Pertanyaan" },
          { key: "c", label: "Kategori", className: "w-32" },
          { key: "o", label: "Urut", className: "w-16" },
          { key: "p", label: "Status", className: "w-20" },
          { key: "x", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((f) => [
          <div key="q">
            <div className="font-semibold text-white">{f.question}</div>
            <p className="line-clamp-1 text-xs text-slate-400">{f.answer}</p>
          </div>,
          <Badge key="c" variant="secondary">
            {f.category ?? "general"}
          </Badge>,
          <span key="o" className="font-mono text-xs text-slate-300">{f.order_index}</span>,
          f.is_active ? (
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
            editHref={`/admin/faq/${f.id}`}
            onDelete={async () => {
              "use server";
              return await deleteFaq(f.id);
            }}
          />,
        ])}
      />
    </div>
  );
}
