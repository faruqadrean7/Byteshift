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
    <article className="relative overflow-hidden bg-[#0E1420] pt-36 pb-28 text-steel-text min-h-screen">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute -top-40 right-1/3 h-[500px] w-[500px] rounded-full bg-steel-accent/12 blur-[140px] pointer-events-none" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="container max-w-3xl relative">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-steel-muted transition-colors hover:text-steel-accent2"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Seluruh Publikasi
        </Link>
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-steel-accent/25 bg-steel-accent/15 px-3 py-1 text-xs font-semibold text-steel-soft"
            >
              {t}
            </span>
          ))}
        </div>
        <h1 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight text-steel-text md:text-5xl">
          {post.title}
        </h1>
        {post.published_at && (
          <div className="mt-4 text-xs font-medium text-steel-muted">
            Diterbitkan pada {format(new Date(post.published_at), "d MMMM yyyy", { locale: id })} · Byteshift Engineering Insights
          </div>
        )}
        {cover && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0E1420] shadow-2xl">
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
        <div className="mt-12 text-steel-muted text-base leading-relaxed [&_p]:my-5 [&_p]:leading-relaxed [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-steel-text [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-steel-text [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-steel-accent/40 [&_blockquote]:pl-5 [&_blockquote]:text-steel-muted [&_blockquote]:italic [&_blockquote]:bg-[#151D2D]/70 [&_blockquote]:p-4 [&_blockquote]:rounded-r-2xl">
          {post.content ? (
            <TiptapRenderer content={post.content} />
          ) : post.excerpt ? (
            <p className="text-lg text-steel-muted">{post.excerpt}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

