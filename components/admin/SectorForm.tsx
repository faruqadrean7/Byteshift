"use client";

import FormShell from "@/components/admin/FormShell";
import { ArrayField, CheckboxField, Field } from "@/components/admin/Field";
import ImageUpload from "@/components/admin/ImageUpload";
import { Label } from "@/components/ui/label";
import type { Sector } from "@/types/database";

const FILTER_GROUPS = [
  { value: "finance", label: "Perbankan & Enterprise" },
  { value: "industry", label: "Manufaktur, IoT & Logistik" },
  { value: "health", label: "Kesehatan & SIMRS" },
  { value: "public", label: "Sektor Publik & Edukasi" },
];

export default function SectorForm({
  initial,
  action,
}: {
  initial?: Sector | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  return (
    <FormShell
      title={initial ? "Edit Sektor Solusi" : "Tambah Sektor Solusi"}
      backHref="/admin/sectors"
      action={action}
    >
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nama Sektor"
          name="name"
          required
          defaultValue={initial?.name}
          placeholder="Perbankan & FinTech"
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={initial?.slug}
          hint="Otomatis dari nama jika kosong"
          placeholder="fintech"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Category Tag (Pill Atas)"
          name="category_tag"
          required
          defaultValue={initial?.category_tag}
          placeholder="Financial Services"
        />
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-200">
            Kategori Tab Filter
          </Label>
          <select
            name="filter_group"
            defaultValue={initial?.filter_group ?? "finance"}
            className="w-full rounded-xl border border-slate-700 bg-[#0F1A30] px-4 py-2.5 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            {FILTER_GROUPS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ImageUpload
        name="image"
        defaultValue={initial?.image}
        label="Gambar Cover Sektor"
        folder="sectors"
        aspect="aspect-[16/10]"
      />

      <Field
        label="Impact Metric (Pill Metrik pada Gambar)"
        name="impact_metric"
        required
        defaultValue={initial?.impact_metric}
        placeholder="99.99% SLA · <200ms"
      />

      <Field
        label="Executive Summary (Penjelasan Solusi)"
        name="executive_summary"
        textarea
        required
        rows={3}
        defaultValue={initial?.executive_summary}
        placeholder="Payment engine throughput tinggi berlatensi rendah untuk..."
      />

      <ArrayField
        label="Key Benefits (Poin Keunggulan)"
        name="key_benefits"
        defaultValue={initial?.key_benefits}
        hint="Tulis poin-poin keunggulan, pisahkan dengan koma"
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Link CTA (Tautan)"
          name="href"
          defaultValue={initial?.href ?? "/kontak"}
          placeholder="/kontak"
        />
        <Field
          label="Urutan"
          name="order_index"
          type="number"
          defaultValue={initial?.order_index ?? 0}
        />
        <CheckboxField
          label="Tampilkan di website"
          name="is_active"
          defaultChecked={initial?.is_active ?? true}
        />
      </div>
    </FormShell>
  );
}
