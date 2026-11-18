import { query } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { deleteTestimonial } from "./actions";
import type { Testimonial } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await query<Testimonial>(
    "SELECT * FROM testimonials ORDER BY order_index ASC"
  );

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Testimoni"
        subtitle="Review & pengakuan klien terhadap Byteshift Studio."
        newHref="/admin/testimonials/new"
      />
      <AdminTable
        columns={[
          { key: "n", label: "Nama & Klien" },
          { key: "q", label: "Kutipan" },
          { key: "r", label: "Rating", className: "w-20" },
          { key: "p", label: "Status", className: "w-20" },
          { key: "x", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((t) => [
          <div key="n">
            <div className="font-semibold text-slate-100">{t.name}</div>
            <div className="text-xs text-slate-400">
              {[t.role, t.company].filter(Boolean).join(" · ")}
            </div>
          </div>,
          <p key="q" className="line-clamp-2 max-w-md text-xs text-slate-300">
            &ldquo;{t.content}&rdquo;
          </p>,
          <span key="r" className="font-mono text-xs text-amber-400">
            ★ {t.rating}
          </span>,
          t.is_published ? (
            <Badge key="p" variant="success">
              Live
            </Badge>
          ) : (
            <Badge key="p" variant="muted">
              Draft
            </Badge>
          ),
          <RowActions
            key="x"
            editHref={`/admin/testimonials/${t.id}`}
            onDelete={async () => {
              "use server";
              return await deleteTestimonial(t.id);
            }}
          />,
        ])}
      />
    </div>
  );
}
