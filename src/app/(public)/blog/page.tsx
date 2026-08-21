import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, readingMinutes } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Technical writing by Caleb Kilemba on data engineering, BigQuery, databases, streaming, orchestration and analytics engineering.",
  path: "/blog"
});

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="section-space">
      <div className="container-site">
        <p className="eyebrow">Blog</p>
        <h1 className="h1 mt-5 max-w-5xl">Technical notes from building data systems.</h1>
        <p className="lead mt-7 max-w-2xl">
          Problems I have hit building pipelines and warehouses, what did not work, and what I would
          do again.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="card flex flex-col overflow-hidden">
              {post.cover && (
                <img src={post.cover} alt={`${post.title} cover`} className="h-52 w-full object-cover" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <span className="badge w-fit">{post.category}</span>
                <h2 className="mt-4 text-2xl font-extrabold">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#0f766e]">{post.title}</Link>
                </h2>
                <p className="muted mt-3 flex-1 leading-7">{post.description}</p>
                {post.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <li key={tag} className="badge">{tag}</li>
                    ))}
                  </ul>
                )}
                <p className="muted mt-4 text-xs">
                  <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
                  {" · "}
                  {readingMinutes(post.body)} min read
                </p>
                <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex font-bold text-[#0f766e]">
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="card mt-12 max-w-2xl p-8">
            <h2 className="text-xl font-extrabold">No articles published yet</h2>
            <p className="muted mt-3 leading-7">
              Posts are markdown files in <code>content/blog</code>. Copy{" "}
              <code>example-post-template.md</code>, write the post, set <code>draft: false</code> and
              it appears here, in the sitemap and in the RSS feed automatically.
            </p>
            <Link href="/book" className="btn btn-primary mt-6">Book a consultation</Link>
          </div>
        )}
      </div>
    </section>
  );
}
