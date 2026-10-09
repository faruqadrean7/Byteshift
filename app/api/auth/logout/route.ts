import { NextResponse } from "next/server";
import { logoutAdmin } from "@/lib/auth";

export async function POST() {
  try {
    await logoutAdmin();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json({ error: "Gagal logout." }, { status: 500 });
  }
}
