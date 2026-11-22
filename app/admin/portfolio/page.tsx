import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { fastApiAdminGetPortfolio } from "@/lib/fastapi";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { publicMediaUrl } from "@/lib/storage";
import { deletePortfolio } from "./actions";
import type { Portfolio } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Page() {
  const token = await getAdminToken();
  let items: Portfolio[] = [];

  if (token) {
    items = await fastApiAdminGetPortfolio(token);
  }

  if (!items.length) {
    items = await query<Portfolio>(
      "SELECT * FROM portfolio ORDER BY order_index ASC"
    );
  }

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Portfolio"
        subtitle="Studi kasus & karya yang ditampilkan di website."
        newHref="/admin/portfolio/new"
      />
      <AdminTable
        columns={[
          { key: "i", label: "", className: "w-20" },
          { key: "t", label: "Judul" },
          { key: "c", label: "Kategori", className: "w-32" },
          { key: "f", label: "Featured", className: "w-24" },
          { key: "p", label: "Status", className: "w-24" },
          { key: "x", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((p) => [
          <div
            key="i"
            className="relative h-12 w-16 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-sm"
          >
            {p.cover_image && (
              <Image
                src={publicMediaUrl(p.cover_image)}
                alt={p.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            )}
          </div>,
          <div key="t">
            <Link
              href={`/admin/portfolio/${p.id}`}
              className="font-semibold text-slate-100 hover:text-blue-400 transition-colors"
            >
              {p.title}
            </Link>
            <div className="text-xs text-slate-400">
              {p.client_name ? `${p.client_name} · ` : ""}
              {p.slug}
            </div>
          </div>,
          <span key="c" className="text-xs text-slate-300">
            {p.category}
          </span>,
          p.is_featured ? (
            <Badge key="f" variant="warning">
              Featured
            </Badge>
          ) : (
            <span key="f" className="text-xs text-slate-500">
              —
            </span>
          ),
          p.is_published ? (
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
            editHref={`/admin/portfolio/${p.id}`}
            onDelete={deletePortfolio.bind(null, p.id)}
          />,
        ])}
      />
    </div>
  );
}
