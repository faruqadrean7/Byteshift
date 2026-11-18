import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const url = new URL(request.url);
  // Accept the secret only via header — query-string secrets leak into
  // server/proxy access logs and browser history.
  const secret = request.headers.get("x-secret");
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = url.searchParams.get("path");
  const tag = url.searchParams.get("tag");

  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);
  if (!path && !tag) {
    revalidatePath("/", "layout");
  }
  return NextResponse.json({ revalidated: true, path, tag });
}
