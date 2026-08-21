import "server-only";
import { cache } from "react";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

/**
 * Posts come from two places: markdown files committed to /content/blog, and the BlogPost
 * table behind the admin editor. Both are normalised to this shape so pages, the sitemap
 * and the feed never need to care which source a post came from.
 */
export type Post = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  updatedAt: Date;
  tags: string[];
  category: string;
  cover: string | null;
  /** Markdown body. Absent on listings, present when a single post is loaded. */
  body: string;
  source: "file" | "cms";
  featured: boolean;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const MARKDOWN = /\.mdx?$/;

function asDate(value: unknown, fallback: Date): Date {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.valueOf())) return parsed;
  }
  return fallback;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((v) => v.trim()).filter(Boolean);
  return [];
}

function parseFile(filename: string, raw: string): Post | null {
  const { data, content } = matter(raw);
  // `draft: true` keeps a work-in-progress file in the repo without publishing it.
  if (data.draft === true) return null;

  const slug = String(data.slug || filename.replace(MARKDOWN, "")).trim();
  const title = String(data.title || "").trim();
  if (!slug || !title) return null;

  const date = asDate(data.date, new Date());
  const tags = asStringArray(data.tags);

  return {
    slug,
    title,
    description: String(data.description || data.excerpt || "").trim(),
    date,
    updatedAt: asDate(data.updated, date),
    tags,
    category: String(data.category || tags[0] || "Article").trim(),
    cover: data.cover ? String(data.cover) : null,
    body: content,
    source: "file",
    featured: data.featured === true
  };
}

/**
 * Reads every markdown file in /content/blog. A missing directory is not an error — it
 * just means no file-authored posts yet, so the CMS posts stand alone.
 */
const getFilePosts = cache(async (): Promise<Post[]> => {
  let filenames: string[];
  try {
    filenames = (await readdir(CONTENT_DIR)).filter((name) => MARKDOWN.test(name));
  } catch {
    return [];
  }

  const posts = await Promise.all(
    filenames.map(async (filename) => {
      try {
        return parseFile(filename, await readFile(path.join(CONTENT_DIR, filename), "utf8"));
      } catch (error) {
        // One malformed file must not take down the whole blog.
        console.error(`[blog] skipping ${filename}:`, (error as Error).message);
        return null;
      }
    })
  );
  return posts.filter((post): post is Post => post !== null);
});

const getCmsPosts = cache(async (): Promise<Post[]> => {
  const rows = await safeQuery(
    "blog posts",
    () => prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
    []
  );
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.excerpt,
    date: row.publishedAt ?? row.createdAt,
    updatedAt: row.updatedAt,
    tags: [],
    category: row.category,
    cover: row.coverImage,
    body: row.content,
    source: "cms" as const,
    featured: row.featured
  }));
});

/** All published posts, newest first. A file and a CMS post sharing a slug: the file wins. */
export const getAllPosts = cache(async (): Promise<Post[]> => {
  const [filePosts, cmsPosts] = await Promise.all([getFilePosts(), getCmsPosts()]);
  const fileSlugs = new Set(filePosts.map((p) => p.slug));
  return [...filePosts, ...cmsPosts.filter((p) => !fileSlugs.has(p.slug))].sort(
    (a, b) => b.date.valueOf() - a.date.valueOf()
  );
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  return (await getAllPosts()).find((post) => post.slug === slug) ?? null;
});

/** Slugs for generateStaticParams. */
export async function getAllPostSlugs(): Promise<string[]> {
  return (await getAllPosts()).map((post) => post.slug);
}

/** Rough read time, shown on the index and post header. */
export function readingMinutes(body: string): number {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 220));
}
