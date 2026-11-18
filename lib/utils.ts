import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Normalize an Indonesian phone number to international `62…` digits
 * (no `+`, no spaces/dashes) so wa.me links are always valid.
 *   "081234567890"  → "6281234567890"
 *   "+62 812-3456"  → "628123456"
 *   "812345"        → "62812345"
 */
export function normalizePhoneWa(input: string | null | undefined): string {
  if (!input) return "";
  let digits = input.replace(/\D/g, ""); // strip everything but digits
  if (!digits) return "";
  if (digits.startsWith("620")) digits = "62" + digits.slice(3); // 620xxx → 62xxx
  else if (digits.startsWith("62")) {
    /* already international */
  } else if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  else if (digits.startsWith("8")) digits = "62" + digits;
  return digits;
}

export function buildWhatsAppLink(message: string, phone?: string) {
  const raw = phone ?? process.env.NEXT_PUBLIC_WA_NUMBER ?? "";
  const number = normalizePhoneWa(raw) || raw.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}
