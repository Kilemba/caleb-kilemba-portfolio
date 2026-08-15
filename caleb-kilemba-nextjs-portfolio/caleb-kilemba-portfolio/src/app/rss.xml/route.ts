import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/utils";

const xml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] || char);

export async function GET() {
  const [settings, posts] = await Promise.all([
    getSiteSettings(),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 50 })
  ]);
  const items = posts.map((post) => `
    <item>
      <title>${xml(post.title)}</title>
      <link>${siteUrl(`/blog/${post.slug}`)}</link>
      <guid>${siteUrl(`/blog/${post.slug}`)}</guid>
      <description>${xml(post.excerpt)}</description>
      <pubDate>${(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      <category>${xml(post.category)}</category>
    </item>`).join("");
  const body = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0"><channel>
    <title>${xml(settings.name)} - Technical Blog</title>
    <link>${siteUrl("/blog")}</link>
    <description>${xml(settings.seoDescription)}</description>
    ${items}
  </channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
