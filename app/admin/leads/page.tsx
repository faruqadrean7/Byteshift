import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
import { query } from "@/lib/db";
import PageHeader from "@/components/admin/PageHeader";
import AdminTable from "@/components/admin/AdminTable";
import RowActions from "@/components/admin/RowActions";
import LeadStatusSelect from "@/components/admin/LeadStatusSelect";
import LeadsFilter from "@/components/admin/LeadsFilter";
import { buildWhatsAppLink } from "@/lib/utils";
import { deleteLead } from "./actions";
import type { Lead } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const all = await query<Lead>(
    "SELECT * FROM leads ORDER BY created_at DESC"
  );

  const items = all.filter((l) => {
    if (status && status !== "all" && l.status !== status) return false;
    if (q) {
      const needle = q.toLowerCase();
      const hay = [l.name, l.email, l.project_type, l.message, l.phone_wa]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });

  return (
    <div className="container max-w-6xl py-10">
      <PageHeader
        title="Leads"
        subtitle="Calon klien yang mengisi form di website."
      />
      <AdminTable
        toolbar={<LeadsFilter total={all.length} filtered={items.length} />}
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
            <div className="font-semibold text-white">{l.name}</div>
            <div className="text-xs text-slate-400">
              {[l.email, l.phone_wa].filter(Boolean).join(" · ")}
            </div>
            {l.message && (
              <p className="mt-1 line-clamp-2 max-w-md text-xs text-slate-300">
                {l.message}
              </p>
            )}
          </div>,
          <span key="p" className="text-xs font-medium text-slate-200">
            {l.project_type ?? "-"}
          </span>,
          <span key="b" className="text-xs text-slate-400">
            {l.budget_range ?? "-"}
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
                  `Halo ${l.name}, kami dari Byteshift Consulting merespons inkuiri Anda mengenai proyek ${l.project_type ?? ""}.`,
                  l.phone_wa
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
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
