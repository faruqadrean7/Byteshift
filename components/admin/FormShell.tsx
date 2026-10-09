"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function FormShell({
  title,
  subtitle,
  backHref,
  action,
  children,
  submitLabel = "Simpan",
  warnOnLeave = true,
}: {
  title: string;
  subtitle?: string;
  backHref: string;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  children: React.ReactNode;
  submitLabel?: string;
  warnOnLeave?: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!warnOnLeave) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (dirty && !pending) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, pending, warnOnLeave]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await action(formData);
      if (res && "error" in res && res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Tersimpan");
      setDirty(false);
      router.push(backHref);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onChange={() => setDirty(true)}
      className="container max-w-3xl py-10 pb-24"
    >
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <div className="mt-3 mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          )}
          {dirty && !pending && (
            <p className="mt-2 text-xs font-semibold text-amber-400">
              ● Perubahan belum disimpan
            </p>
          )}
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {pending ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
      <div className="space-y-6 rounded-2xl border border-slate-800/90 bg-[#0B1530]/90 p-6 sm:p-8 shadow-xl shadow-black/20 text-slate-100">
        {children}
      </div>

      {/* Sticky save bar — appears when dirty */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-[#091124]/95 px-4 py-3 shadow-2xl backdrop-blur-md md:left-64">
          <div className="container flex max-w-3xl items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Tekan <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[11px] font-mono text-slate-300">⌘S</kbd> untuk simpan
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push(backHref)}
                disabled={pending}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {pending ? "Menyimpan..." : submitLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-800 pb-6 last:border-0 last:pb-0">
      <div className="mb-4">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
