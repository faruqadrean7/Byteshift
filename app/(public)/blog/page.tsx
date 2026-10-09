import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getPublishedBlogPosts } from "@/lib/queries";
import { publicMediaUrl } from "@/lib/storage";
import { buildMetadata } from "@/lib/seo";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

export const revalidate = 1800;
export const metadata = buildMetadata({
  title: "Insight & Riset Teknologi — Byteshift Consulting",
  description:
    "Analisis tren arsitektur software, implementasi AI, IoT industri, dan panduan transformasi digital untuk eksekutif dan engineer.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  return (
    <section className="relative overflow-hidden bg-[#030718] pt-36 pb-28 text-white min-h-screen">
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
      
      <div className="container max-w-6xl relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300 backdrop-blur-md">
          <BookOpen className="h-3.5 w-3.5" />
          Publikasi &amp; Riset Teknis
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
          Insight, Arsitektur &amp;{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Strategi Digital
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
          Panduan komprehensif seputar arsitektur cloud, rekayasa perangkat lunak skala besar, kecerdasan buatan, dan efisiensi operasional industri.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {posts.length === 0 && (
            <div className="col-span-2 rounded-3xl border border-blue-500/20 bg-[#061233]/40 p-12 text-center text-slate-400">
              Belum ada artikel publikasi yang diterbitkan.
            </div>
          )}
          {posts.map((p) => {
            const cover = publicMediaUrl(p.cover_image);
            return (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-blue-500/20 bg-[#061233]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:bg-[#081844] hover:shadow-2xl hover:shadow-black/50"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#03091a]">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#061233] to-[#0c2466] font-display text-4xl font-extrabold text-cyan-400/25">
                      {p.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030718]/80 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-7">
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-0.5 text-[11px] font-medium text-cyan-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-4 font-display text-xl font-bold leading-tight text-white group-hover:text-cyan-300 transition-colors">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-300">
                        {p.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-blue-500/20 pt-4 text-xs text-slate-300">
                    {p.published_at && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                        <span>
                          {format(new Date(p.published_at), "d MMMM yyyy", {
                            locale: id,
                          })}
                        </span>
                      </div>
                    )}
                    <span className="flex items-center gap-1 font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                      Baca Publikasi →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

