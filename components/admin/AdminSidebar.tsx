"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Users,
  FileText,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import logoImg from "@/public/logo.png";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: "highlight";
};

type NavGroup = {
  title?: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/leads", label: "Leads", icon: Inbox, badge: "highlight" },
    ],
  },
  {
    title: "Konten Website",
    items: [
      { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
      { href: "/admin/services", label: "Services", icon: Sparkles },
      { href: "/admin/blog", label: "Blog", icon: FileText },
      { href: "/admin/testimonials", label: "Testimoni", icon: MessageSquare },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
    ],
  },
  {
    title: "Profil Studio",
    items: [
      { href: "/admin/team", label: "Tim", icon: Users },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar({ email }: { email: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const linkList = (
    <nav className="flex flex-1 flex-col gap-6 px-3 overflow-y-auto">
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-1">
          {group.title && (
            <div className="px-3 pb-1 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {group.title}
            </div>
          )}
          {group.items.map((it) => {
            const Icon = it.icon;
            const active = it.exact
              ? pathname === it.href
              : pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-slate-100 shadow-lg shadow-blue-600/25 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-slate-100"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    active ? "text-slate-100" : "text-slate-400 group-hover:text-blue-400"
                  )}
                />
                <span className="flex-1">{it.label}</span>
                {it.badge === "highlight" && !active && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
                {active && <ChevronRight className="h-3.5 w-3.5 opacity-80" />}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-[#091124] px-4 py-3 md:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 font-display font-extrabold text-slate-100"
        >
          <Image
            src={logoImg}
            alt="Byteshift Admin"
            width={28}
            height={28}
            className="h-7 w-7 object-contain drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]"
          />
          <span className="tracking-tight text-slate-100">BYTESHIFT ADMIN</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-200 hover:text-slate-100 hover:bg-slate-700"
          aria-label="Toggle sidebar"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 -translate-x-full bg-[#091124] transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 md:border-r md:border-slate-800/80",
          open && "translate-x-0 shadow-2xl shadow-black/80"
        )}
      >
        <div className="flex h-full flex-col py-6">
          <Link
            href="/admin"
            className="mb-6 flex items-center gap-2.5 px-6"
            onClick={() => setOpen(false)}
          >
            <Image
              src={logoImg}
              alt="Byteshift Admin"
              width={32}
              height={32}
              className="h-8 w-8 object-contain drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            />
            <span className="font-display text-sm font-extrabold tracking-wider text-slate-100">
              BYTESHIFT ADMIN
            </span>
          </Link>
          {linkList}
          <div className="mt-auto border-t border-slate-800/80 px-6 pt-4">
            <Link
              href="/"
              target="_blank"
              className="mb-3 flex w-full items-center justify-between rounded-xl border border-slate-700/70 bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all hover:border-blue-500/50 hover:bg-slate-800 hover:text-blue-400"
            >
              <span>Lihat website →</span>
            </Link>
            <div className="truncate text-xs text-slate-400 font-mono" title={email ?? ""}>
              {email}
            </div>
            <button
              onClick={logout}
              className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
