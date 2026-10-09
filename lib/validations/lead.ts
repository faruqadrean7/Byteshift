import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(120),
  email: z
    .string()
    .email("Email tidak valid")
    .optional()
    .or(z.literal("")),
  phone_wa: z
    .string()
    .min(8, "Nomor WhatsApp tidak valid")
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Hanya angka, +, -, spasi"),
  project_type: z.string().min(1, "Pilih jenis project"),
  budget_range: z.string().optional(),
  message: z.string().max(2000).optional().or(z.literal("")),
  source: z.string().optional(),
  // honeypot
  website: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const projectTypes = [
  { value: "web-platform", label: "Platform Web & Enterprise Portal" },
  { value: "erp-system", label: "Sistem Informasi, ERP & Core Modernization" },
  { value: "mobile-app", label: "Aplikasi Mobile Multi-Platform" },
  { value: "iot-embedded", label: "Industrial IoT & Smart System" },
  { value: "ai-automation", label: "AI, NLP & Applied Machine Learning" },
  { value: "api-integration", label: "Integrasi API & Cloud Architecture" },
  { value: "it-consulting", label: "Konsultasi Strategis / Audit Arsitektur" },
  { value: "other", label: "Kebutuhan Kustom Lainnya" },
] as const;

export const budgetRanges = [
  { value: "10-25jt", label: "Rp 10 – 25 Juta" },
  { value: "25-50jt", label: "Rp 25 – 50 Juta" },
  { value: "50-100jt", label: "Rp 50 – 100 Juta" },
  { value: ">100jt", label: "> Rp 100 Juta (Enterprise Scale)" },
  { value: "discovery", label: "Discovery Sprint / Diskusi Scope Terlebih Dahulu" },
] as const;
