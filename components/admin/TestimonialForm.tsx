"use client";

import FormShell from "@/components/admin/FormShell";
import { CheckboxField, Field } from "@/components/admin/Field";
import type { Testimonial } from "@/types/database";

export default function TestimonialForm({
  initial,
  action,
}: {
  initial?: Testimonial | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  return (
    <FormShell
      title={initial ? "Edit Testimoni" : "Tambah Testimoni"}
      backHref="/admin/testimonials"
      action={action}
    >
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nama"
          name="name"
          required
          defaultValue={initial?.name}
        />
        <Field
          label="Role / Jabatan"
          name="role"
          defaultValue={initial?.role}
          placeholder="Pemilik Toko Batik"
        />
      </div>
      <Field
        label="Perusahaan / Lokasi"
        name="company"
        defaultValue={initial?.company}
        placeholder="Jombang"
      />
      <Field
        label="Isi Testimoni"
        name="content"
        textarea
        required
        rows={4}
        defaultValue={initial?.content}
      />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Rating (1–5)"
          name="rating"
          type="number"
          defaultValue={initial?.rating ?? 5}
        />
        <Field
          label="URL Avatar"
          name="avatar_url"
          defaultValue={initial?.avatar_url}
          hint="Opsional"
        />
        <Field
          label="Urutan"
          name="order_index"
          type="number"
          defaultValue={initial?.order_index ?? 0}
        />
      </div>
      <CheckboxField
        label="Tampilkan di website"
        name="is_published"
        defaultChecked={initial?.is_published ?? true}
      />
    </FormShell>
  );
}
