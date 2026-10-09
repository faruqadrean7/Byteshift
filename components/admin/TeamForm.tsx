"use client";

import FormShell from "@/components/admin/FormShell";
import { CheckboxField, Field } from "@/components/admin/Field";
import ImageUpload from "@/components/admin/ImageUpload";
import type { TeamMember } from "@/types/database";

export default function TeamForm({
  initial,
  action,
}: {
  initial?: TeamMember | null;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}) {
  const social = (initial?.social_links as Record<string, string> | null) ?? {};
  return (
    <FormShell
      title={initial ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
      backHref="/admin/team"
      action={action}
    >
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama" name="name" required defaultValue={initial?.name} />
        <Field
          label="Role"
          name="role"
          required
          defaultValue={initial?.role}
          placeholder="UI/UX Designer"
        />
      </div>
      <Field
        label="Bio singkat"
        name="bio"
        textarea
        rows={3}
        defaultValue={initial?.bio}
      />
      <ImageUpload
        name="photo_url"
        defaultValue={initial?.photo_url}
        label="Foto"
        folder="team"
        aspect="aspect-square"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Instagram URL"
          name="instagram"
          defaultValue={social.instagram}
        />
        <Field
          label="LinkedIn URL"
          name="linkedin"
          defaultValue={social.linkedin}
        />
        <Field
          label="Twitter URL"
          name="twitter"
          defaultValue={social.twitter}
        />
        <Field label="GitHub URL" name="github" defaultValue={social.github} />
      </div>
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
