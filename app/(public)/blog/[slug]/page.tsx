import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import TiptapRenderer from "@/components/public/TiptapRenderer";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/queries";
import { publicMediaUrl } from "@/lib/storage";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 1800;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Artikel tidak ditemukan" });
  return buildMetadata({
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    path: `/blog/${post.slug}`,
    image: post.cover_image ? publicMediaUrl(post.cover_image) : undefined,
    type: "article",
    publishedTime: post.published_at ?? undefined,
    tags: post.tags,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();
  const cover = publicMediaUrl(post.cover_image);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: cover || undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
  };

  return (
    <article className="relative overflow-hidden bg-[#030718] pt-36 pb-28 text-white min-h-screen">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute -top-40 right-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="container max-w-3xl relative">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Seluruh Publikasi
        </Link>
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-1 text-xs font-semibold text-cyan-300"
            >
              {t}
            </span>
          ))}
        </div>
        <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
          {post.title}
        </h1>
        {post.published_at && (
          <div className="mt-4 text-xs font-medium text-slate-300">
            Diterbitkan pada {format(new Date(post.published_at), "d MMMM yyyy", { locale: id })} · Byteshift Engineering Insights
          </div>
        )}
        {cover && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-blue-500/20 bg-[#03091a] shadow-2xl">
            <Image
              src={cover}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        )}
        <div className="mt-12 text-slate-300 text-base leading-relaxed [&_p]:my-5 [&_p]:leading-relaxed [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500 [&_blockquote]:pl-5 [&_blockquote]:text-slate-200 [&_blockquote]:italic [&_blockquote]:bg-[#061233]/70 [&_blockquote]:p-4 [&_blockquote]:rounded-r-2xl">
          {post.content ? (
            <TiptapRenderer content={post.content} />
          ) : post.excerpt ? (
            <p className="text-lg text-slate-300">{post.excerpt}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

