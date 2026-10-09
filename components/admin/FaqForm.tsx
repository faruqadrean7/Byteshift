"use client";

import FormShell from "@/components/admin/FormShell";
import { CheckboxField, Field } from "@/components/admin/Field";
import type { Faq } from "@/types/database";

export default function FaqForm({
  initial,
  action,
}: {
  initial?: Faq | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  return (
    <FormShell
      title={initial ? "Edit FAQ" : "Tambah FAQ"}
      backHref="/admin/faq"
      action={action}
    >
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <Field
        label="Pertanyaan"
        name="question"
        required
        defaultValue={initial?.question}
      />
      <Field
        label="Jawaban"
        name="answer"
        required
        textarea
        rows={5}
        defaultValue={initial?.answer}
      />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Kategori"
          name="category"
          defaultValue={initial?.category}
          placeholder="general"
        />
        <Field
          label="Urutan"
          name="order_index"
          type="number"
          defaultValue={initial?.order_index ?? 0}
        />
        <CheckboxField
          label="Aktif"
          name="is_active"
          defaultChecked={initial?.is_active ?? true}
        />
      </div>
    </FormShell>
  );
}
