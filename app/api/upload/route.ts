import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getCurrentUser } from "@/lib/auth";
import { isS3Configured, uploadToS3 } from "@/lib/storage/s3";

export const runtime = "nodejs";

// Whitelist of allowed image types → safe file extension.
// SVG is intentionally excluded: it can carry inline scripts (stored XSS).
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  // 1. Require an authenticated admin/editor session.
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // 2. Validate MIME type — never trust the filename extension.
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan JPG, PNG, WebP, GIF, atau AVIF." },
        { status: 415 }
      );
    }

    // 3. Enforce a maximum file size.
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file melebihi batas 5 MB." },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize folder name (allow only a safe character set, no traversal).
    const sanitizedFolder =
      folder.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) || "uploads";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Prefer Neon Object Storage when configured (persists on serverless);
    // fall back to the local public/ directory for dev / persistent hosts.
    if (isS3Configured()) {
      const key = `${sanitizedFolder}/${filename}`;
      const publicUrl = await uploadToS3({
        key,
        body: buffer,
        contentType: file.type,
      });
      return NextResponse.json({ ok: true, url: publicUrl, path: key });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", sanitizedFolder);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const relativePath = `uploads/${sanitizedFolder}/${filename}`;
    return NextResponse.json({
      ok: true,
      url: `/${relativePath}`,
      path: relativePath,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file ke server" },
      { status: 500 }
    );
  }
}
