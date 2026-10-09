"use client";

import FormShell from "@/components/admin/FormShell";
import { ArrayField, CheckboxField, Field } from "@/components/admin/Field";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Label } from "@/components/ui/label";
import type { BlogPost } from "@/types/database";

export default function BlogForm({
  initial,
  action,
}: {
  initial?: BlogPost | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  return (
    <FormShell
      title={initial ? "Edit Artikel" : "Tulis Artikel"}
      backHref="/admin/blog"
      action={action}
    >
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
        <Field
          label="Judul"
          name="title"
          required
          defaultValue={initial?.title}
        />
        <Field
          label="Slug URL"
          name="slug"
          defaultValue={initial?.slug}
          hint="Otomatis dari judul"
        />
      </div>
      <Field
        label="Excerpt (ringkasan untuk list)"
        name="excerpt"
        textarea
        rows={2}
        defaultValue={initial?.excerpt}
      />
      <ImageUpload
        name="cover_image"
        defaultValue={initial?.cover_image}
        label="Cover image"
        folder="blog"
      />
      <ArrayField label="Tags" name="tags" defaultValue={initial?.tags} />
      <div>
        <Label className="text-sm font-semibold text-slate-200">Isi Artikel</Label>
        <p className="mb-2 text-xs text-slate-400">
          Format kaya — heading, list, link, gambar. Disarankan tulis intro
          pendek (1–2 paragraf) lalu pakai H2 untuk sub-bagian.
        </p>
        <RichTextEditor
          name="content"
          defaultValue={initial?.content as unknown}
          placeholder="Tulis artikel di sini..."
          storageFolder="blog"
        />
      </div>
      <h3 className="font-display text-lg font-bold text-white">SEO &amp; Metadata</h3>
      <Field
        label="Meta Title"
        name="meta_title"
        defaultValue={initial?.meta_title}
        hint="Default: judul artikel"
      />
      <Field
        label="Meta Description"
        name="meta_description"
        textarea
        rows={2}
        defaultValue={initial?.meta_description}
        hint="Default: excerpt. Ideal 140–160 karakter"
      />
      <CheckboxField
        label="Publikasikan"
        name="is_published"
        defaultChecked={initial?.is_published ?? false}
        hint="Centang untuk membuat artikel terlihat publik."
      />
    </FormShell>
  );
}
