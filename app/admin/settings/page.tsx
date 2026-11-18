import { queryOne } from "@/lib/db";
import FormShell from "@/components/admin/FormShell";
import { Field } from "@/components/admin/Field";
import ImageUpload from "@/components/admin/ImageUpload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSettings } from "./actions";
import type { SiteSettings } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const s = await queryOne<SiteSettings>(
    "SELECT * FROM site_settings WHERE id = 1 LIMIT 1"
  );
  const social = (s?.social_links as Record<string, string> | null) ?? {};

  return (
    <FormShell
      title="Pengaturan Site"
      backHref="/admin"
      action={saveSettings}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Nama Site"
          name="site_name"
          required
          defaultValue={s?.site_name}
        />
        <Field label="Tagline" name="tagline" defaultValue={s?.tagline} />
      </div>
      <ImageUpload
        name="logo_url"
        defaultValue={s?.logo_url}
        label="Logo (opsional)"
        folder="brand"
        aspect="aspect-square"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="WhatsApp (format internasional, mis. 6281234567890)"
          name="whatsapp_number"
          defaultValue={s?.whatsapp_number}
        />
        <Field label="Email" name="email" defaultValue={s?.email} />
      </div>
      <Field label="Alamat" name="address" defaultValue={s?.address} />
      <h3 className="mt-4 font-display text-lg font-bold text-slate-100">Social Links &amp; Media</h3>
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
          label="YouTube URL"
          name="youtube"
          defaultValue={social.youtube}
        />
        <Field
          label="Twitter / X URL"
          name="twitter"
          defaultValue={social.twitter}
        />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-slate-100">Hero Highlights &amp; Stats</h3>
      <div>
        <Label htmlFor="hero_stats_json" className="text-sm font-semibold text-slate-200">
          JSON array statistik di Hero Section
        </Label>
        <div className="mt-1.5">
          <Textarea
            id="hero_stats_json"
            name="hero_stats_json"
            rows={6}
            className="font-mono text-xs"
            defaultValue={JSON.stringify(s?.hero_stats ?? [], null, 2)}
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          Format: <code className="text-blue-300">[{`{`}&quot;num&quot;:&quot;50+&quot;,&quot;label&quot;:&quot;Project Selesai&quot;{`}`}]</code>
        </p>
      </div>
    </FormShell>
  );
}
