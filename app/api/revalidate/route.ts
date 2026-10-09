import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret") ?? request.headers.get("x-secret");
  if (
    !process.env.REVALIDATE_SECRET ||
    secret !== process.env.REVALIDATE_SECRET
  ) {
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
