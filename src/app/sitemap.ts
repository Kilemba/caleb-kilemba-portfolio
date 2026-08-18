import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    prisma.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
  ]);
  const staticRoutes = ["", "/about", "/services", "/projects", "/blog", "/contact", "/book"];
  return [
    ...staticRoutes.map((route) => ({ url: siteUrl(route), lastModified: new Date() })),
    ...projects.map((p) => ({ url: siteUrl(`/projects/${p.slug}`), lastModified: p.updatedAt })),
    ...posts.map((p) => ({ url: siteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt }))
  ];
}
