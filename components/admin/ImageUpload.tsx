"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { publicMediaUrl } from "@/lib/storage";
import { cn } from "@/lib/utils";

export default function ImageUpload({
  name,
  defaultValue,
  folder = "uploads",
  label = "Gambar",
  hint,
  aspect = "aspect-[16/9]",
}: {
  name: string;
  defaultValue?: string | null;
  folder?: string;
  label?: string;
  hint?: string;
  aspect?: string;
}) {
  const [path, setPath] = useState<string>(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Gagal mengunggah file");
      }

      setPath(json.path || json.url);
      toast.success("Berhasil diunggah");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal upload");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clearImage() {
    setPath("");
  }

  return (
    <div>
      <div className="text-sm font-semibold text-slate-200">{label}</div>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      <input type="hidden" name={name} value={path} />
      <div className="mt-2.5 flex items-start gap-3.5">
        <div
          className={cn(
            "relative w-44 overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-900/80 shadow-sm",
            aspect
          )}
        >
          {path ? (
            <>
              <Image
                src={publicMediaUrl(path)}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                aria-label="Hapus gambar"
                className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-slate-950/80 text-rose-400 hover:bg-rose-600 hover:text-white shadow transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-500">
              <UploadCloud className="h-6 w-6" />
            </div>
          )}
        </div>
        <div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onChange}
              disabled={busy}
            />
            <UploadCloud className="h-4 w-4 text-blue-400" />
            {busy ? "Mengunggah..." : "Pilih file"}
          </label>
          <p className="mt-2 text-xs text-slate-400">
            JPG/PNG/WebP, maks ~5MB.
          </p>
        </div>
      </div>
    </div>
  );
}
