import type { Json } from "@/types/database";

/**
 * Helpers untuk parsing FormData di server actions admin.
 */

export function getString(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function getOptionalString(fd: FormData, key: string): string | null {
  const v = getString(fd, key);
  return v.length ? v : null;
}

export function getNumber(fd: FormData, key: string, fallback = 0): number {
  const v = getString(fd, key);
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function getOptionalNumber(fd: FormData, key: string): number | null {
  const v = getString(fd, key);
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function getBool(fd: FormData, key: string): boolean {
  return fd.get(key) === "true";
}

export function getArray(fd: FormData, key: string): string[] {
  return getString(fd, key)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getJson<T = Json>(
  fd: FormData,
  key: string
): T | null {
  const v = getString(fd, key);
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}
