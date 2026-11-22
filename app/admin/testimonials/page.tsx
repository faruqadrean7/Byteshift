import Link from "next/link";
import { query } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetTestimonials } from "@/lib/fastapi";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { deleteTestimonial } from "./actions";
import type { Testimonial } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Page() {
  const token = await getAdminToken();
  let items: Testimonial[] = [];

  if (token) {
    items = await fastApiAdminGetTestimonials(token);
  }

  if (!items.length) {
    items = await query<Testimonial>(
      "SELECT * FROM testimonials ORDER BY order_index ASC"
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Testimoni"
        subtitle="Ulasan dari klien yang tampil di website."
        newHref="/admin/testimonials/new"
      />
      <AdminTable
        columns={[
          { key: "n", label: "Nama & Perusahaan" },
          { key: "r", label: "Rating", className: "w-24" },
          { key: "o", label: "Urut", className: "w-16" },
          { key: "p", label: "Status", className: "w-24" },
          { key: "x", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((t) => [
          <div key="n">
            <Link
              href={`/admin/testimonials/${t.id}`}
              className="font-semibold text-slate-100 hover:text-blue-400 transition-colors"
            >
              {t.name}
            </Link>
            <div className="text-xs text-slate-400">
              {t.role ? `${t.role}` : ""}
              {t.company ? ` · ${t.company}` : ""}
            </div>
          </div>,
          <span key="r" className="text-xs text-amber-400">
            {"★".repeat(t.rating)}
          </span>,
          <span key="o" className="font-mono text-xs text-slate-300">
            {t.order_index}
          </span>,
          t.is_published ? (
            <Badge key="p" variant="success">
              Publish
            </Badge>
          ) : (
            <Badge key="p" variant="muted">
              Draft
            </Badge>
          ),
          <RowActions
            key="x"
            editHref={`/admin/testimonials/${t.id}`}
            onDelete={deleteTestimonial.bind(null, t.id)}
          />,
        ])}
      />
    </div>
  );
}
