"use client";

import FormShell from "@/components/admin/FormShell";
import { ArrayField, CheckboxField, Field } from "@/components/admin/Field";
import ImageUpload from "@/components/admin/ImageUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Portfolio } from "@/types/database";

export default function PortfolioForm({
  initial,
  action,
}: {
  initial?: Portfolio | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  return (
    <FormShell
      title={initial ? "Edit Portfolio / Studi Kasus" : "Tambah Portfolio / Studi Kasus"}
      backHref="/admin/portfolio"
      action={action}
    >
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Judul Project"
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="Sistem ERP Sentral & Sinkronisasi 42 Gudang"
        />
        <Field
          label="Slug URL"
          name="slug"
          defaultValue={initial?.slug}
          hint="Otomatis dari judul jika kosong (misal: erp-sentral-42-gudang)"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Kategori Industri"
          name="category"
          required
          defaultValue={initial?.category}
          placeholder="ERP & Supply Chain"
        />
        <Field
          label="Nama Klien / Institusi"
          name="client_name"
          defaultValue={initial?.client_name}
          placeholder="PT Nusantara Prima"
        />
        <Field
          label="Tahun Implementasi"
          name="year"
          type="number"
          defaultValue={initial?.year ?? new Date().getFullYear()}
        />
      </div>
      <Field
        label="Ringkasan Eksekutif (Short Desc)"
        name="short_desc"
        textarea
        rows={3}
        defaultValue={initial?.short_desc}
        hint="Muncul di kartu katalog homepage dan pengantar halaman detail."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <ImageUpload
          name="cover_image"
          defaultValue={initial?.cover_image}
          label="Foto Sampul Utama (Cover Image)"
          hint="Gambar utama berukuran 16:9 yang mewakili proyek."
          folder="portfolio"
        />
        <div className="space-y-4">
          <Field
            label="Live Demo / Public URL"
            name="demo_url"
            defaultValue={initial?.demo_url}
            placeholder="https://app.klien.com atau https://demo.byteshift.id"
            hint="Tautan live demo yang bisa diuji coba oleh calon klien."
          />
          <Field
            label="Internal Project Repository / Case Link (Opsional)"
            name="project_url"
            defaultValue={initial?.project_url}
            placeholder="https://github.com/... atau internal link"
          />
        </div>
      </div>

      {/* Multi-image gallery screenshots */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-5">
        <MultiImageUpload
          name="gallery"
          defaultValue={initial?.gallery ?? []}
          folder="portfolio"
          label="Galeri Screenshot Aplikasi / Arsitektur"
          hint="Unggah beberapa screenshot antarmuka (dashboard, report, mobile app) atau diagram sistem. Pengunjung dapat mengklik dan melihat galeri gambar ini."
        />
      </div>

      <ArrayField
        label="Teknologi & Tech Stack"
        name="tech_stack"
        defaultValue={initial?.tech_stack}
      />

      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-5">
        <Label htmlFor="metrics_json" className="text-sm font-semibold text-slate-200">
          Metrik Hasil &amp; Dampak Implementasi (JSON Object)
        </Label>
        <p className="mt-1 mb-2 text-xs text-slate-400">
          Format key-value untuk menonjolkan dampak nyata implementasi (misal efisiensi waktu, omzet, throughput).
        </p>
        <Textarea
          id="metrics_json"
          name="metrics_json"
          rows={4}
          className="font-mono text-xs"
          defaultValue={JSON.stringify(
            initial?.metrics && Object.keys(initial.metrics).length > 0
              ? initial.metrics
              : {
                  "efisiensi_operasional": "+40%",
                  "selisih_stok": "0%",
                  "waktu_rekap": "2 Menit"
                },
            null,
            2
          )}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Contoh: <code className="text-blue-300">{`{"efisiensi_operasional": "+40%", "selisih_stok": "0%", "waktu_rekap": "2 Menit"}`}</code>
        </p>
      </div>

      <div>
        <Label className="text-sm font-semibold text-slate-200">
          Studi Kasus Lengkap (Story &amp; Rekayasa Teknis)
        </Label>
        <p className="mb-2 text-xs text-slate-400">
          Jelaskan latar belakang kendala klien, arsitektur yang dirancang Byteshift, tantangan teknis, dan kesuksesan implementasi. Mendukung heading, format teks tebal, poin-poin, dan kutipan.
        </p>
        <RichTextEditor
          name="full_content"
          defaultValue={initial?.full_content as unknown}
          placeholder="Tuliskan cerita proyek: 1. Masalah Klien, 2. Arsitektur Solusi, 3. Hasil Nyata..."
          storageFolder="portfolio"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field
          label="Urutan"
          name="order_index"
          type="number"
          defaultValue={initial?.order_index ?? 0}
        />
        <CheckboxField
          label="Featured"
          name="is_featured"
          defaultChecked={initial?.is_featured ?? false}
          hint="Tampil di homepage"
        />
        <CheckboxField
          label="Publikasikan"
          name="is_published"
          defaultChecked={initial?.is_published ?? true}
        />
      </div>
    </FormShell>
  );
}
