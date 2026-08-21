import { getAllPosts } from "@/lib/blog";
import { getSiteSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/utils";

const xml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] || char);

export async function GET() {
  const [settings, posts] = await Promise.all([getSiteSettings(), getAllPosts()]);

  const items = posts
    .slice(0, 50)
    .map((post) => {
      const url = siteUrl(`/blog/${post.slug}`);
      return `
    <item>
      <title>${xml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xml(post.description)}</description>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <category>${xml(post.category)}</category>
    </item>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(settings.name)} - Technical Blog</title>
    <link>${siteUrl("/blog")}</link>
    <atom:link href="${siteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
    <description>${xml(settings.seoDescription)}</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate"
    }
  });
}
