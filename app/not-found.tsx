import Link from "next/link";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50/50 px-4 py-32 text-center text-slate-900">
      <div className="mx-auto max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 shadow-md">
          <FileQuestion className="h-8 w-8" />
        </div>

        <span className="mt-6 inline-block font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
          Error 404
        </span>

        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
          Halaman Tidak Ditemukan
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Halaman yang Anda tuju mungkin telah dipindahkan, diubah jalurnya, atau tidak tersedia sementara waktu.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-slate-100 font-bold shadow-md shadow-blue-600/20">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50">
            <Link href="/kontak">Hubungi Dukungan</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
