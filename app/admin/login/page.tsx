"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoImg from "@/public/logo.png";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const error = params.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok || !data.ok) {
        const msg = data?.error || "Email atau password salah.";
        setFormError(msg);
        toast.error(msg);
        return;
      }
      toast.success("Berhasil masuk");
      router.push(next);
      router.refresh();
    } catch {
      setLoading(false);
      const msg = "Terjadi kesalahan jaringan.";
      setFormError(msg);
      toast.error(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
      {(formError || error === "no-access") && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3.5 text-sm text-rose-300"
        >
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <span>
            {formError ??
              "Akun ini tidak memiliki akses admin. Hubungi pemilik website."}
          </span>
        </div>
      )}

      <div>
        <Label htmlFor="email" className="text-slate-200 font-bold mb-1.5 block">
          Email
        </Label>
        <div className="relative mt-1">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@byteshift.id"
            className="pl-10 h-12 bg-[#080E21] border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 font-medium text-sm"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="text-slate-200 font-bold mb-1.5 block">
          Password
        </Label>
        <div className="relative mt-1">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 pr-10 h-12 bg-[#080E21] border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 font-medium text-sm"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-white"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </Button>

      <p className="pt-2 text-center text-xs text-slate-400">
        Kredensial default: <code className="text-blue-300">admin@byteshift.id</code> / <code className="text-blue-300">admin123</code>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel (desktop only) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#060C22] via-[#0B1536] to-[#0E1C4E] p-12 lg:flex lg:flex-col lg:justify-between border-r border-slate-800">
        <div
          aria-hidden
          className="absolute inset-0 grid-pattern opacity-30"
        />
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl"
        />

        <Link
          href="/"
          className="relative z-10 flex items-center gap-2.5 text-white"
        >
          <Image
            src={logoImg}
            alt="Byteshift Consulting Logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain drop-shadow-[0_0_10px_rgba(37,99,235,0.6)]"
            priority
          />
          <span className="font-display text-base font-extrabold tracking-tight">
            BYTESHIFT CONSULTING
          </span>
        </Link>

        <div className="relative z-10 max-w-md text-white">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-300 backdrop-blur">
            <Sparkles className="h-3 w-3" /> Admin Panel
          </div>
          <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
            Kelola konten website
            <br />
            dengan mudah &amp; cepat.
          </h2>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Update portfolio, tulis artikel blog, kelola leads dari calon klien,
            dan pantau performa — semua dalam satu dashboard.
          </p>

          <ul className="mt-6 space-y-2.5 text-sm text-slate-200">
            <li className="flex items-center gap-2.5">
              <span className="text-emerald-400 font-bold">✓</span> Manajemen portfolio &amp; multi-gambar
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-emerald-400 font-bold">✓</span> Inbox leads dengan filter &amp; WhatsApp link
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-emerald-400 font-bold">✓</span> Editor artikel blog dengan rich text
            </li>
          </ul>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} ByteShift Consulting. All rights reserved.
        </div>
      </aside>

      {/* Right: login form */}
      <main className="flex min-h-screen flex-col bg-[#060B18] p-6 sm:p-12">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke website
        </Link>

        <div className="my-auto flex justify-center py-12">
          <div className="w-full max-w-md">
            {/* Mobile-only branding */}
            <Link
              href="/"
              className="mb-6 flex items-center gap-2.5 lg:hidden"
            >
              <Image
                src={logoImg}
                alt="Byteshift Consulting Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
                priority
              />
              <span className="font-display text-base font-extrabold tracking-tight text-white">
                BYTESHIFT CONSULTING
              </span>
            </Link>

            <div className="rounded-2xl border border-slate-800/90 bg-[#0B1530]/90 p-8 sm:p-10 shadow-2xl shadow-black/40 text-slate-100">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Selamat datang kembali 👋
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Masuk dengan akun admin Anda untuk mengelola website.
              </p>

              <Suspense
                fallback={
                  <div className="mt-8 flex justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  </div>
                }
              >
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 lg:hidden">
          © {new Date().getFullYear()} ByteShift Consulting
        </p>
      </main>
    </div>
  );
}
