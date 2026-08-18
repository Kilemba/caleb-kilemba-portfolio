import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog", description: "Technical writing by Caleb Kilemba on data engineering, databases, streaming, orchestration and analytics engineering." };

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { publishedAt: "desc" }] });
  return <section className="section-space"><div className="container-site"><p className="eyebrow">Blog</p><h1 className="h1 mt-5 max-w-5xl">Technical notes from building data systems.</h1><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.id} className="card overflow-hidden">{post.coverImage && <img src={post.coverImage} alt={`${post.title} cover`} className="h-52 w-full object-cover" />}<div className="p-6"><span className="badge">{post.category}</span><h2 className="mt-4 text-2xl font-extrabold">{post.title}</h2><p className="muted mt-3 leading-7">{post.excerpt}</p><p className="muted mt-4 text-xs">{post.publishedAt ? formatDate(post.publishedAt) : ""}</p><Link href={`/blog/${post.slug}`} className="mt-5 inline-flex font-bold text-[#0f766e]">Read article →</Link></div></article>)}</div>{posts.length === 0 && <p className="lead mt-10">Published articles will appear here.</p>}</div></section>;
}
