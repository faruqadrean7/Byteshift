"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  leadSchema,
  type LeadInput,
  projectTypes,
  budgetRanges,
} from "@/lib/validations/lead";

export default function LeadForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      project_type: "",
      budget_range: "",
      source: "kontak-page",
    },
  });

  const projectType = watch("project_type");
  const budget = watch("budget_range");

  async function onSubmit(values: LeadInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Gagal mengirim");
      toast.success("Brief terkirim! Kami akan menghubungi Anda secepatnya.");
      reset();
      setDone(true);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Gagal mengirim, coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-steel-surface2 p-8 text-center backdrop-blur-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-steel-accent text-[#0b1220] shadow-lg shadow-black/25">
          ✓
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-steel-text">
          Inkuiri Proyek Berhasil Terkirim!
        </h3>
        <p className="mt-2 text-sm text-steel-muted max-w-md mx-auto leading-relaxed">
          Tim technical consultant kami akan menganalisis kebutuhan Anda dan menghubungi via WhatsApp/Email dalam 1×24 jam kerja.
        </p>
        <Button
          className="mt-6 border-white/[0.08] bg-steel-surface2 text-steel-muted hover:bg-steel-raise hover:text-steel-text"
          variant="outline"
          onClick={() => setDone(false)}
        >
          Kirim Inkuiri Lain
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* honeypot — hidden from users */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        {...register("website")}
      />

      <div>
        <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-steel-muted">
          Nama Lengkap / Instansi *
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Misal: Bambang Hermawan (PT Solusi Maju)"
          className="mt-1.5 border-white/[0.08] bg-steel-surface2 text-steel-text placeholder:text-steel-faint focus:border-steel-accent"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-300">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone_wa" className="text-xs font-semibold uppercase tracking-wider text-steel-muted">
            Nomor WhatsApp Aktif *
          </Label>
          <Input
            id="phone_wa"
            {...register("phone_wa")}
            placeholder="081234567890"
            inputMode="tel"
            className="mt-1.5 border-white/[0.08] bg-steel-surface2 text-steel-text placeholder:text-steel-faint focus:border-steel-accent"
          />
          {errors.phone_wa && (
            <p className="mt-1 text-xs text-rose-300">
              {errors.phone_wa.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-steel-muted">
            Email Korporat / Pribadi
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="nama@perusahaan.com"
            className="mt-1.5 border-white/[0.08] bg-steel-surface2 text-steel-text placeholder:text-steel-faint focus:border-steel-accent"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-steel-muted">
            Domain &amp; Bidang Solusi *
          </Label>
          <div className="mt-1.5">
            <Select
              value={projectType}
              onValueChange={(v) => setValue("project_type", v)}
            >
              <SelectTrigger className="border-white/[0.08] bg-steel-surface2 text-steel-text">
                <SelectValue placeholder="Pilih domain solusi" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-steel-base text-steel-text">
                {projectTypes.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.project_type && (
            <p className="mt-1 text-xs text-rose-300">
              {errors.project_type.message}
            </p>
          )}
        </div>
        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-steel-muted">
            Estimasi Budget Investasi
          </Label>
          <div className="mt-1.5">
            <Select
              value={budget}
              onValueChange={(v) => setValue("budget_range", v)}
            >
              <SelectTrigger className="border-white/[0.08] bg-steel-surface2 text-steel-text">
                <SelectValue placeholder="Pilih estimasi investasi" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-steel-base text-steel-text">
                {budgetRanges.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-steel-muted">
          Uraian Kebutuhan &amp; Spesifikasi Awal
        </Label>
        <Textarea
          id="message"
          {...register("message")}
          rows={5}
          placeholder="Jelaskan gambaran sistem yang ingin dibangun, target pengguna, integrasi hardware/API yang dibutuhkan, atau kendala sistem saat ini..."
          className="mt-1.5 border-white/[0.08] bg-steel-surface2 text-steel-text placeholder:text-steel-faint focus:border-steel-accent"
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="w-full bg-steel-accent font-semibold text-[#0b1220] shadow-xl shadow-black/25 hover:bg-steel-accent2 py-6"
      >
        <Send className="h-4 w-4" />
        {submitting ? "Mengirim Inkuiri..." : "Kirim Dokumen Inkuiri Proyek"}
      </Button>

      <div className="flex items-center gap-2 text-xs text-steel-faint">
        <span className="h-1.5 w-1.5 rounded-full bg-steel-accent2 shrink-0" />
        <span>Informasi Anda dilindungi jaminan kerahasiaan &amp; Non-Disclosure Agreement (NDA).</span>
      </div>
    </form>
  );
}
