import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { query } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import { Badge } from "@/components/ui/badge";
import { publicMediaUrl } from "@/lib/storage";
import { deleteBlogPost } from "./actions";
import type { BlogPost } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await query<BlogPost>(
    "SELECT * FROM blog_posts ORDER BY created_at DESC"
  );

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Blog & Insight"
        subtitle="Artikel, studi kasus, dan update dari tim."
        newHref="/admin/blog/new"
      />
      <AdminTable
        columns={[
          { key: "i", label: "", className: "w-20" },
          { key: "t", label: "Judul" },
          { key: "d", label: "Tanggal", className: "w-32" },
          { key: "p", label: "Status", className: "w-24" },
          { key: "x", label: "", className: "w-24 text-right" },
        ]}
        rows={items.map((b) => [
          <div
            key="i"
            className="relative h-12 w-16 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-sm"
          >
            {b.cover_image && (
              <Image
                src={publicMediaUrl(b.cover_image)}
                alt={b.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            )}
          </div>,
          <div key="t">
            <Link
              href={`/admin/blog/${b.id}`}
              className="font-semibold text-slate-100 hover:text-blue-400 transition-colors"
            >
              {b.title}
            </Link>
            <div className="text-xs text-slate-400">/{b.slug}</div>
          </div>,
          <span key="d" className="text-xs font-mono text-slate-400">
            {b.published_at
              ? format(new Date(b.published_at), "dd MMM yyyy", { locale: id })
              : "-"}
          </span>,
          b.is_published ? (
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
            editHref={`/admin/blog/${b.id}`}
            onDelete={async () => {
              "use server";
              return await deleteBlogPost(b.id);
            }}
          />,
        ])}
      />
    </div>
  );
}
