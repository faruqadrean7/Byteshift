import { NextResponse } from "next/server";
import { Resend } from "resend";
import { queryOne } from "@/lib/db";
import { leadSchema, projectTypes, budgetRanges } from "@/lib/validations/lead";

export const runtime = "nodejs";

function findLabel(
  list: ReadonlyArray<{ value: string; label: string }>,
  v?: string | null
) {
  return list.find((x) => x.value === v)?.label ?? v ?? "-";
}

export async function POST(request: Request) {
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

  let leadId = "lead-demo";
  try {
    const row = await queryOne<{ id: string }>(
      `INSERT INTO leads (name, email, phone_wa, project_type, budget_range, message, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        parsed.data.name,
        parsed.data.email || null,
        parsed.data.phone_wa,
        parsed.data.project_type,
        parsed.data.budget_range || null,
        parsed.data.message || null,
        parsed.data.source ?? "website",
      ]
    );
    if (row?.id) {
      leadId = row.id;
    }
  } catch (error) {
    console.error("Neon DB Lead insert error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data inkuiri ke database." },
      { status: 500 }
    );
  }

  // Fire-and-forget email notification
  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.LEAD_NOTIFY_EMAIL;
  const fromAddr = process.env.LEAD_FROM_EMAIL ?? "onboarding@resend.dev";
  if (resendKey && notifyTo) {
    try {
      const resend = new Resend(resendKey);
      const projectLabel = findLabel(projectTypes, parsed.data.project_type);
      const budgetLabel = findLabel(budgetRanges, parsed.data.budget_range);
      await resend.emails.send({
        from: `Byteshift Website <${fromAddr}>`,
        to: notifyTo,
        replyTo: parsed.data.email || undefined,
        subject: `🔥 Lead baru: ${parsed.data.name} — ${projectLabel}`,
        html: `
          <h2>Lead baru dari website</h2>
          <table style="border-collapse:collapse">
            <tr><td><b>Nama</b></td><td>${parsed.data.name}</td></tr>
            <tr><td><b>WhatsApp</b></td><td>${parsed.data.phone_wa}</td></tr>
            <tr><td><b>Email</b></td><td>${parsed.data.email || "-"}</td></tr>
            <tr><td><b>Jenis Project</b></td><td>${projectLabel}</td></tr>
            <tr><td><b>Budget</b></td><td>${budgetLabel}</td></tr>
          </table>
          <p style="margin-top:16px"><b>Pesan:</b><br/>${
            parsed.data.message ? parsed.data.message.replace(/\n/g, "<br/>") : "-"
          }</p>
          <p style="margin-top:24px;font-size:12px;color:#666">
            Lead ID: ${leadId}<br/>
            Source: ${parsed.data.source ?? "website"}
          </p>
        `,
      });
    } catch (e) {
      // Don't fail the request if email fails — log only
      console.error("Resend error:", e);
    }
  }

  return NextResponse.json({ ok: true, id: leadId });
}
