import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/public/MarkdownContent";
import { getAllPosts, getPostBySlug, readingMinutes } from "@/lib/blog";
import { getSiteSettings } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { formatDate, siteUrl } from "@/lib/utils";

/** Prerenders every published post, from files and from the CMS alike. */
export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.cover,
    type: "article",
    publishedTime: post.date.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    tags: post.tags
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
  if (!post) notFound();

  const url = siteUrl(`/blog/${post.slug}`);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(post.cover && { image: [post.cover.startsWith("http") ? post.cover : siteUrl(post.cover)] }),
    ...(post.tags.length > 0 && { keywords: post.tags.join(", ") }),
    author: {
      "@type": "Person",
      name: settings.name,
      url: siteUrl("/about"),
      ...(settings.linkedinUrl && { sameAs: [settings.linkedinUrl] })
    },
    publisher: { "@type": "Person", name: settings.name, url: siteUrl() }
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // Escaping "<" stops post content from closing the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }}
      />

      {/* Title block on the shared wash, matching the landing hero and blog index. */}
      <header className="hero-wrap py-14 sm:py-16">
        <div className="blob blob-a" aria-hidden="true" />
        <div className="container-site relative max-w-4xl">
          <p className="muted text-sm">
            <Link href="/blog" className="font-bold text-[#12875a]">← All articles</Link>
          </p>

          <span className="badge mt-6 inline-flex">{post.category}</span>
          <h1 className="h1 mt-5">{post.title}</h1>
          {post.description && <p className="lead mt-6">{post.description}</p>}
          <p className="muted mt-5 text-sm">
            <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
            {" · "}
            {readingMinutes(post.body)} min read
          </p>
        </div>
      </header>

      <div className="container-site max-w-4xl py-14">
        {post.cover && (
          <img
            src={post.cover}
            alt={`${post.title} article cover`}
            className="mb-10 w-full rounded-2xl border border-[#e5e7eb]"
          />
        )}

        <div>
          <MarkdownContent content={post.body} />
        </div>

        {post.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => <li key={tag} className="badge">{tag}</li>)}
          </ul>
        )}

        {/* Every post ends in the same funnel as the rest of the site. */}
        <aside className="card mt-14 p-8 sm:p-10">
          <p className="eyebrow">Work with me</p>
          <h2 className="h2 mt-4 text-3xl">Facing something similar in your own data?</h2>
          <p className="lead mt-5">
            I help businesses build reliable pipelines, BigQuery warehouses and reporting they can
            trust. Book a free consultation and we will talk through your systems before you commit
            to anything.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">Book a consultation</Link>
            <Link href="/services" className="btn btn-secondary">See what I do</Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
