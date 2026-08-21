import type { Metadata } from "next";
import { siteUrl } from "@/lib/utils";

/**
 * Builds per-page metadata.
 *
 * The base URL comes from `siteUrl()`, which reads NEXT_PUBLIC_SITE_URL — the single
 * place to change when moving to a custom domain.
 *
 * Every page must call this. Setting `canonical` or `openGraph.url` in a layout makes
 * Next inherit that value into every child page, which is how each page ended up
 * claiming to be the homepage.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags
}: {
  title: string;
  description: string;
  /** Route path beginning with "/", e.g. "/blog" or "/blog/my-post". */
  path: string;
  /** Absolute URL or a path under /public. Falls back to the site-wide OG image. */
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}): Metadata {
  const url = siteUrl(path);
  // No cover supplied: fall back to the generated card, titled with this page.
  const ogImage = image
    ? (image.startsWith("http") ? image : siteUrl(image))
    : siteUrl(`/og?title=${encodeURIComponent(title)}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      images: [{ url: ogImage }],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: [siteUrl("/about")],
        tags
      })
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    }
  };
}
