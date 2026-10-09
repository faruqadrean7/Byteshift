"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "Semua status" },
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "converted", label: "Closed" },
  { value: "dropped", label: "Drop" },
];

export default function LeadsFilter({
  total,
  filtered,
}: {
  total: number;
  filtered: number;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(sp.get("q") ?? "");
  const status = sp.get("status") ?? "all";

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(Array.from(sp.entries()));
      if (search) params.set("q", search);
      else params.delete("q");
      startTransition(() => {
        router.replace(`?${params.toString()}`);
      });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function onStatus(v: string) {
    const params = new URLSearchParams(Array.from(sp.entries()));
    if (v === "all") params.delete("status");
    else params.set("status", v);
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, email, project..."
          className="w-full rounded-xl border border-slate-700 bg-[#080E21] py-2 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-colors"
        />
      </div>
      <div className="relative">
        <Filter className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="appearance-none rounded-xl border border-slate-700 bg-[#080E21] py-2 pl-9 pr-8 text-sm text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-colors cursor-pointer"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-slate-900 text-slate-200">
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="ml-auto text-xs font-medium text-slate-400">
        {filtered === total ? (
          <span>{total} lead</span>
        ) : (
          <span>
            {filtered} dari {total} lead
          </span>
        )}
      </div>
    </div>
  );
}
