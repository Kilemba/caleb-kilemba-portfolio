import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MarkdownContent } from "@/components/public/MarkdownContent";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({ where: { slug, published: true } });
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt, alternates: { canonical: post.canonicalUrl || undefined }, openGraph: { title: post.title, description: post.excerpt, images: post.coverImage ? [post.coverImage] : undefined } };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({ where: { slug, published: true }, include: { tags: true } });
  if (!post) notFound();
  return <article className="section-space"><div className="container-site max-w-4xl"><span className="badge">{post.category}</span><h1 className="h1 mt-5">{post.title}</h1><p className="lead mt-6">{post.excerpt}</p><p className="muted mt-4 text-sm">{post.publishedAt ? formatDate(post.publishedAt) : ""}</p>{post.coverImage && <img src={post.coverImage} alt={`${post.title} article cover`} className="mt-10 w-full rounded-2xl border border-[#e1e7ec]" />}<div className="mt-10"><MarkdownContent content={post.content} /></div><div className="mt-10 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag.id} className="badge">{tag.name}</span>)}</div>{post.devToUrl && <p className="muted mt-8 text-sm">Also syndicated to <a className="font-bold text-[#0f766e]" href={post.devToUrl} target="_blank" rel="noreferrer">DEV.to</a>.</p>}</div></article>;
}
