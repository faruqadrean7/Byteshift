import Link from "next/link";
import { format, subDays } from "date-fns";
import { id } from "date-fns/locale";
import {
  Briefcase,
  Inbox,
  MessageSquare,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { query, queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const [
      portfolioRes,
      blogRes,
      leadRes,
      newLeadRes,
      convertedRes,
      leads7dRes,
      recentLeads,
    ] = await Promise.all([
      queryOne<{ count: string }>("SELECT COUNT(*) as count FROM portfolio"),
      queryOne<{ count: string }>("SELECT COUNT(*) as count FROM blog_posts"),
      queryOne<{ count: string }>("SELECT COUNT(*) as count FROM leads"),
      queryOne<{ count: string }>(
        "SELECT COUNT(*) as count FROM leads WHERE status = 'new'"
      ),
      queryOne<{ count: string }>(
        "SELECT COUNT(*) as count FROM leads WHERE status = 'converted'"
      ),
      queryOne<{ count: string }>(
        "SELECT COUNT(*) as count FROM leads WHERE created_at >= NOW() - INTERVAL '7 days'"
      ),
      query<{
        id: string;
        name: string;
        project_type: string | null;
        status: string;
        created_at: string;
        phone_wa: string | null;
      }>(
        "SELECT id, name, project_type, status, created_at, phone_wa FROM leads ORDER BY created_at DESC LIMIT 6"
      ),
    ]);

    const total = Number(leadRes?.count ?? 0);
    const converted = Number(convertedRes?.count ?? 0);
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

    return {
      stats: {
        portfolio: Number(portfolioRes?.count ?? 0),
        blog: Number(blogRes?.count ?? 0),
        leads: total,
        newLeads: Number(newLeadRes?.count ?? 0),
        converted,
        leadsLast7d: Number(leads7dRes?.count ?? 0),
        conversionRate,
      },
      recentLeads: recentLeads ?? [],
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return {
      stats: {
        portfolio: 0,
        blog: 0,
        leads: 0,
        newLeads: 0,
        converted: 0,
        leadsLast7d: 0,
        conversionRate: 0,
      },
      recentLeads: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const { stats, recentLeads } = await getDashboardData();
  return (
    <div className="container max-w-6xl py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Ringkasan aktivitas website Byteshift Consulting &amp; Studio.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button asChild variant="outline" size="sm">
            <Link href="/" target="_blank">
              <ExternalLink className="mr-2 h-3.5 w-3.5 text-blue-400" />
              Buka Website
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/portfolio/new">
              <Plus className="mr-2 h-3.5 w-3.5" />
              Portfolio Baru
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Inbox className="h-5 w-5" />}
          label="Leads Baru"
          value={stats.newLeads}
          hint="Belum dihubungi"
          theme="cyan"
          accent
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Leads 7 Hari"
          value={stats.leadsLast7d}
          hint={`Total ${stats.leads} leads terdaftar`}
          theme="indigo"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Conversion Rate"
          value={stats.conversionRate}
          suffix="%"
          hint={`${stats.converted} leads berhasil closed`}
          theme="emerald"
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Portfolio Live"
          value={stats.portfolio}
          hint={`${stats.blog} artikel blog live`}
          theme="amber"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-100">
                  Leads Terbaru
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Follow up dalam 1×24 jam untuk konversi klien maksimal
                </p>
              </div>
              <Link
                href="/admin/leads"
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Lihat semua →
              </Link>
            </div>
            <div className="mt-5 divide-y divide-slate-800/60">
              {recentLeads.length === 0 && (
                <div className="py-12 text-center">
                  <Inbox className="mx-auto h-10 w-10 text-slate-600" />
                  <p className="mt-3 text-sm text-slate-400">
                    Belum ada lead masuk.
                  </p>
                </div>
              )}
              {recentLeads.map((l) => (
                <Link
                  key={l.id}
                  href={`/admin/leads`}
                  className="-mx-2 flex flex-wrap items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-800/50"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-100">
                      {l.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {l.project_type ?? "-"} · {l.phone_wa ?? "-"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={l.status} />
                    <span className="font-mono text-xs text-slate-400">
                      {format(new Date(l.created_at), "d MMM, HH:mm", {
                        locale: id,
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h2 className="font-display text-base font-bold text-slate-100">
                  Quick Actions
                </h2>
              </div>
              <div className="mt-4 grid gap-2">
                <QuickLink href="/admin/portfolio/new" label="+ Portfolio baru" />
                <QuickLink href="/admin/blog/new" label="+ Tulis artikel blog" />
                <QuickLink
                  href="/admin/testimonials/new"
                  label="+ Testimoni klien"
                />
                <QuickLink href="/admin/services/new" label="+ Service baru" />
                <QuickLink href="/admin/faq/new" label="+ FAQ baru" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                <h2 className="font-display text-base font-bold text-slate-100">
                  Tips Praktis Studio
                </h2>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>
                    Update <strong className="text-slate-100">portfolio</strong> secara rutin dengan multi-screenshot bukti implementasi nyata.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>
                    Tulis <strong className="text-slate-100">1 artikel insight/minggu</strong> untuk menaikkan SEO &amp; kredibilitas teknis.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>
                    Cantumkan <strong className="text-slate-100">metrik hasil riil</strong> pada studi kasus untuk meyakinkan calon klien enterprise.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/60 px-3.5 py-2.5 text-sm font-medium text-slate-200 transition-all hover:border-blue-500/50 hover:bg-slate-800 hover:text-blue-400"
    >
      <span>{label}</span>
      <span className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-400">
        →
      </span>
    </Link>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  hint,
  theme = "cyan",
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
  theme?: "cyan" | "indigo" | "emerald" | "amber";
  accent?: boolean;
}) {
  const themeMap = {
    cyan: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    indigo: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  };

  return (
    <Card className="hover:border-slate-700 transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div
            className={`grid h-10 w-10 place-items-center rounded-xl border ${themeMap[theme]}`}
          >
            {icon}
          </div>
          {accent && value > 0 && (
            <Badge variant="default" className="text-[10px] bg-blue-500">
              Action!
            </Badge>
          )}
        </div>
        <div className="mt-4 font-display text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight">
          {value}
          {suffix}
        </div>
        <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </div>
        {hint && (
          <div className="mt-1.5 text-xs text-slate-400">{hint}</div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; variant: "default" | "secondary" | "success" | "muted" | "warning" }
  > = {
    new: { label: "Baru", variant: "default" },
    contacted: { label: "Dihubungi", variant: "warning" },
    converted: { label: "Closed", variant: "success" },
    dropped: { label: "Drop", variant: "muted" },
  };
  const m = map[status] ?? { label: status, variant: "muted" as const };
  return <Badge variant={m.variant}>{m.label}</Badge>;
}

