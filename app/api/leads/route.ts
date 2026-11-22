import { NextResponse } from "next/server";
import { Resend } from "resend";
import { queryOne } from "@/lib/db";
import { fastApiSubmitLead } from "@/lib/fastapi";
import { leadSchema, projectTypes, budgetRanges } from "@/lib/validations/lead";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { normalizePhoneWa } from "@/lib/utils";

export const runtime = "nodejs";

function findLabel(
  list: ReadonlyArray<{ value: string; label: string }>,
  v?: string | null
) {
  return list.find((x) => x.value === v)?.label ?? v ?? "-";
}

/** Escape user-provided text before interpolating into notification HTML. */
function escapeHtml(input: string | null | undefined): string {
  if (!input) return "-";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  // Throttle lead submissions per IP to curb spam.
  const ip = getClientIp(request);
  const rl = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60 * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak pengiriman. Mohon tunggu sebentar." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validasi gagal" },
      { status: 400 }
    );
  }

  // Honeypot — bot fills hidden "website" field
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true }); // pretend success
  }

  // Normalize the WhatsApp number to international `62…` format on store so
  // follow-up wa.me links are always valid regardless of how it was typed.
  const normalizedPhone = normalizePhoneWa(parsed.data.phone_wa) || parsed.data.phone_wa;

  let leadId = "lead-demo";
  try {
    const apiLead = await fastApiSubmitLead({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone_wa: normalizedPhone,
      project_type: parsed.data.project_type,
      budget_range: parsed.data.budget_range || null,
      message: parsed.data.message || null,
      source: parsed.data.source ?? "website",
    });

    if (apiLead?.id) {
      leadId = String(apiLead.id);
    } else {
      const row = await queryOne<{ id: string }>(
        `INSERT INTO leads (name, email, phone_wa, project_type, budget_range, message, source)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          parsed.data.name,
          parsed.data.email || null,
          normalizedPhone,
          parsed.data.project_type,
          parsed.data.budget_range || null,
          parsed.data.message || null,
          parsed.data.source ?? "website",
        ]
      );
      if (row?.id) {
        leadId = row.id;
      }
    }
  } catch (error) {
    console.error("Neon DB Lead insert error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data inkuiri ke database." },
      { status: 500 }
    );
  }

  // Fire-and-forget email: (1) internal notification, (2) auto-reply to the
  // customer. Neither must fail the request.
  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  const fromAddr = process.env.LEAD_FROM_EMAIL ?? "onboarding@resend.dev";
  if (resendKey) {
    const resend = new Resend(resendKey);
    const projectPlain = findLabel(projectTypes, parsed.data.project_type);
    const projectLabel = escapeHtml(projectPlain);
    const budgetLabel = escapeHtml(findLabel(budgetRanges, parsed.data.budget_range));

    // (1) Internal team notification
    if (notifyTo) {
      try {
        await resend.emails.send({
          from: `Byteshift Website <${fromAddr}>`,
          to: notifyTo,
          replyTo: parsed.data.email || undefined,
          subject: `🔥 Lead baru: ${parsed.data.name} — ${projectPlain}`,
          html: `
          <h2>Lead baru dari website</h2>
          <table style="border-collapse:collapse">
            <tr><td><b>Nama</b></td><td>${escapeHtml(parsed.data.name)}</td></tr>
            <tr><td><b>WhatsApp</b></td><td>${escapeHtml(normalizedPhone)}</td></tr>
            <tr><td><b>Email</b></td><td>${escapeHtml(parsed.data.email)}</td></tr>
            <tr><td><b>Jenis Project</b></td><td>${projectLabel}</td></tr>
            <tr><td><b>Budget</b></td><td>${budgetLabel}</td></tr>
          </table>
          <p style="margin-top:16px"><b>Pesan:</b><br/>${
            parsed.data.message ? escapeHtml(parsed.data.message).replace(/\n/g, "<br/>") : "-"
          }</p>
          <p style="margin-top:24px;font-size:12px;color:#666">
            Lead ID: ${escapeHtml(leadId)}<br/>
            Source: ${escapeHtml(parsed.data.source ?? "website")}
          </p>
        `,
        });
      } catch (e) {
        console.error("Resend (notify) error:", e);
      }
    }

    // (2) Auto-reply confirmation to the customer (only if they left an email)
    if (parsed.data.email) {
      try {
        await resend.emails.send({
          from: `Byteshift Consulting <${fromAddr}>`,
          to: parsed.data.email,
          replyTo: notifyTo || undefined,
          subject: "Inkuiri proyek Anda telah kami terima — Byteshift Consulting",
          html: `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.6">
            <h2 style="color:#2563eb">Terima kasih, ${escapeHtml(parsed.data.name)}!</h2>
            <p>Kami telah menerima inkuiri proyek Anda mengenai
               <b>${projectLabel}</b>. Tim technical consultant kami akan
               meninjau kebutuhan Anda dan menghubungi melalui WhatsApp atau
               email dalam <b>1×24 jam kerja</b>.</p>
            <p style="margin-top:16px"><b>Ringkasan inkuiri Anda:</b></p>
            <table style="border-collapse:collapse">
              <tr><td style="padding:2px 8px 2px 0"><b>Jenis Project</b></td><td>${projectLabel}</td></tr>
              <tr><td style="padding:2px 8px 2px 0"><b>Estimasi Budget</b></td><td>${budgetLabel}</td></tr>
            </table>
            <p style="margin-top:20px">Jika mendesak, Anda juga bisa langsung
               menghubungi kami. Informasi Anda dijaga kerahasiaannya sesuai NDA.</p>
            <p style="margin-top:24px;color:#475569">Salam hangat,<br/>Tim Byteshift Consulting</p>
            <p style="margin-top:16px;font-size:12px;color:#94a3b8">Ref: ${escapeHtml(leadId)}</p>
          </div>
        `,
        });
      } catch (e) {
        console.error("Resend (auto-reply) error:", e);
      }
    }
  }

  return NextResponse.json({ ok: true, id: leadId });
}
