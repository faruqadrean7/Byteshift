import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { query, queryOne } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import LeadStatusSelect from "@/components/admin/LeadStatusSelect";
import LeadNotes from "@/components/admin/LeadNotes";
import LeadsFilter from "@/components/admin/LeadsFilter";
import { buildWhatsAppLink } from "@/lib/utils";
import { projectTypes, budgetRanges } from "@/lib/validations/lead";
import { deleteLead } from "./actions";
import type { Lead } from "@/types/database";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function findLabel(
  list: ReadonlyArray<{ value: string; label: string }>,
  v?: string | null
) {
  if (!v) return "-";
  return list.find((x) => x.value === v)?.label ?? v;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  // Build a parameterized WHERE clause so filtering/search happen in SQL
  // (scales to large tables; avoids loading every row into memory).
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (status && status !== "all") {
    params.push(status);
    clauses.push(`status = $${params.length}`);
  }
  if (q && q.trim()) {
    params.push(`%${q.trim()}%`);
    const p = `$${params.length}`;
    clauses.push(
      `(name ILIKE ${p} OR email ILIKE ${p} OR project_type ILIKE ${p} OR message ILIKE ${p} OR phone_wa ILIKE ${p})`
    );
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const [totalRow, filteredRow] = await Promise.all([
    queryOne<{ count: number }>("SELECT COUNT(*)::int AS count FROM leads"),
    queryOne<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM leads ${where}`,
      params
    ),
  ]);
  const total = totalRow?.count ?? 0;
  const filtered = filteredRow?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(filtered / PAGE_SIZE));

  const limitIdx = params.length + 1;
  const offsetIdx = params.length + 2;
  const items = await query<Lead>(
    `SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    [...params, PAGE_SIZE, offset]
  );

  // Helper to build pagination links that preserve the active filters.
  function pageHref(targetPage: number) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status && status !== "all") sp.set("status", status);
    if (targetPage > 1) sp.set("page", String(targetPage));
    const qs = sp.toString();
    return qs ? `?${qs}` : "?";
  }

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Leads"
        subtitle="Calon klien yang mengisi form di website."
      />
      <AdminTable
        toolbar={<LeadsFilter total={total} filtered={filtered} />}
        empty={
          q || (status && status !== "all")
            ? "Tidak ada lead yang cocok dengan filter."
            : "Belum ada lead masuk."
        }
        footer={
          filtered > 0 ? (
            <div className="flex items-center justify-between">
              <span>
                Menampilkan {offset + 1}–{Math.min(offset + PAGE_SIZE, filtered)} dari {filtered}
                {filtered !== total ? ` (total ${total})` : ""} lead
              </span>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Link
                    href={pageHref(page - 1)}
                    className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-700 px-2 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-3 w-3" /> Sebelumnya
                  </Link>
                ) : (
                  <span className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-800 px-2 text-xs text-slate-600">
                    <ChevronLeft className="h-3 w-3" /> Sebelumnya
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  Hal. {page} / {totalPages}
                </span>
                {page < totalPages ? (
                  <Link
                    href={pageHref(page + 1)}
                    className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-700 px-2 text-xs text-slate-200 hover:bg-slate-800"
                  >
                    Berikutnya <ChevronRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <span className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-800 px-2 text-xs text-slate-600">
                    Berikutnya <ChevronRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>
          ) : null
        }
        columns={[
          { key: "n", label: "Nama" },
          { key: "p", label: "Project" },
          { key: "b", label: "Budget", className: "w-28" },
          { key: "s", label: "Status", className: "w-32" },
          { key: "d", label: "Tanggal", className: "w-40" },
          { key: "x", label: "", className: "w-32 text-right" },
        ]}
        rows={items.map((l) => [
          <div key="n">
            <div className="font-semibold text-slate-100">{l.name}</div>
            <div className="text-xs text-slate-400">
              {[l.email, l.phone_wa].filter(Boolean).join(" · ")}
            </div>
            {l.message && (
              <p className="mt-1 line-clamp-2 max-w-md text-xs text-slate-300">
                {l.message}
              </p>
            )}
            <LeadNotes id={l.id} notes={l.notes} />
          </div>,
          <span key="p" className="text-xs font-medium text-slate-200">
            {findLabel(projectTypes, l.project_type)}
          </span>,
          <span key="b" className="text-xs text-slate-400">
            {findLabel(budgetRanges, l.budget_range)}
          </span>,
          <LeadStatusSelect key="s" id={l.id} status={l.status} />,
          <span key="d" className="text-xs font-mono text-slate-400">
            {format(new Date(l.created_at), "dd MMM yyyy, HH:mm", {
              locale: idLocale,
            })}
          </span>,
          <div key="x" className="flex items-center justify-end gap-1.5">
            {l.phone_wa && (
              <a
                href={buildWhatsAppLink(
                  `Halo ${l.name}, kami dari Byteshift Consulting merespons inkuiri Anda mengenai proyek ${findLabel(projectTypes, l.project_type)}.`,
                  l.phone_wa
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-slate-100 transition-colors"
                title="Buka WhatsApp"
              >
                <span>WA</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <RowActions
              onDelete={async () => {
                "use server";
                return await deleteLead(l.id);
              }}
            />
          </div>,
        ])}
      />
    </div>
  );
}
