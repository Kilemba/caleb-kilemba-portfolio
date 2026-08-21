import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";
import { safeQuery } from "@/lib/safe-query";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    safeQuery(
      "sitemap projects",
      () => prisma.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      []
    ),
    // Covers markdown files and CMS posts alike.
    getAllPosts()
  ]);

  const staticRoutes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/projects", priority: 0.8 },
    { path: "/blog", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/book", priority: 0.9 },
    { path: "/contact", priority: 0.6 }
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: siteUrl(path),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority
    })),
    ...projects.map((p) => ({
      url: siteUrl(`/projects/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    ...posts.map((p) => ({
      url: siteUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
