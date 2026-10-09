"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { publicMediaUrl } from "@/lib/storage";
import { Button } from "@/components/ui/button";

export default function MultiImageUpload({
  name = "gallery",
  defaultValue = [],
  folder = "portfolio",
  label = "Galeri Gambar / Screenshot Project",
  hint = "Unggah beberapa screenshot aplikasi, dashboard, atau arsitektur sistem (JPG/PNG/WebP, maks ~5MB per file).",
}: {
  name?: string;
  defaultValue?: string[];
  folder?: string;
  label?: string;
  hint?: string;
}) {
  const [images, setImages] = useState<string[]>(defaultValue || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    let successCount = 0;
    const newPaths: string[] = [];

    for (const file of files) {
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
          throw new Error(json.error || `Gagal mengunggah ${file.name}`);
        }

        const path = json.path || json.url;
        if (path) {
          newPaths.push(path);
          successCount++;
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Gagal mengunggah ${file.name}`);
      }
    }

    if (newPaths.length > 0) {
      setImages((prev) => [...prev, ...newPaths]);
      toast.success(`${successCount} gambar berhasil ditambahkan ke galeri`);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(indexToRemove: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-blue-400" />
          <span>{label}</span>
        </label>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>

      {/* Hidden inputs to send each image URL via FormData */}
      {images.map((imgUrl, idx) => (
        <input key={`${imgUrl}-${idx}`} type="hidden" name={`${name}[]`} value={imgUrl} />
      ))}
      {/* Also a fallback JSON input for easy parsing */}
      <input type="hidden" name={`${name}_json`} value={JSON.stringify(images)} />

      {/* Gallery Grid Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((imgUrl, idx) => (
          <div
            key={`${imgUrl}-${idx}`}
            className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-md"
          >
            <Image
              src={publicMediaUrl(imgUrl)}
              alt={`Gallery screenshot ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              aria-label={`Hapus screenshot ${idx + 1}`}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/80 text-rose-400 hover:bg-rose-600 hover:text-white transition-all shadow"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute bottom-1.5 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              #{idx + 1}
            </div>
          </div>
        ))}

        {/* Upload Button Tile */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 text-slate-300 transition-colors hover:border-blue-500 hover:bg-slate-800/60 hover:text-blue-400 disabled:opacity-50"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              <span className="text-xs font-semibold text-slate-300">Mengunggah...</span>
            </div>
          ) : (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 shadow-sm border border-slate-700">
                <Plus className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-xs font-semibold">Tambah Screenshot</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}
