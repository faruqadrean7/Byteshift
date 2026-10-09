"use client";

import FormShell from "@/components/admin/FormShell";
import { ArrayField, CheckboxField, Field } from "@/components/admin/Field";
import type { Service } from "@/types/database";

export default function ServiceForm({
  initial,
  action,
}: {
  initial?: Service | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  return (
    <FormShell
      title={initial ? "Edit Service" : "Tambah Service"}
      backHref="/admin/services"
      action={action}
    >
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Judul"
          name="title"
          required
          defaultValue={initial?.title}
          placeholder="Website Profesional"
        />
        <Field
          label="Slug"
          name="slug"
          defaultValue={initial?.slug}
          hint="Otomatis dari judul jika kosong"
        />
      </div>
      <Field
        label="Icon (emoji)"
        name="icon"
        defaultValue={initial?.icon}
        placeholder="🌐"
      />
      <Field
        label="Deskripsi"
        name="description"
        textarea
        required
        rows={3}
        defaultValue={initial?.description}
      />
      <ArrayField
        label="Tags"
        name="tags"
        defaultValue={initial?.tags}
        hint="Mis: Landing Page, E-Commerce, Blog"
      />
      <div className="grid gap-5 sm:grid-cols-2">
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
