import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { getSiteSettings } from "@/lib/settings";
import { SERVICE_KEYWORDS } from "@/lib/landing-content";
import { siteUrl } from "@/lib/utils";

/**
 * Public pages are cached and served without hitting the database on every request.
 * Admin edits call revalidatePath for an immediate refresh; this interval is the backstop
 * that also picks up changes made straight in the database (seeds, manual SQL).
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const base = siteUrl();
  const title = `${settings.name} | Data Engineer & BigQuery Consultant`;

  return {
    metadataBase: new URL(base),
    title: { default: title, template: `%s | ${settings.name}` },
    description: settings.seoDescription,
    keywords: SERVICE_KEYWORDS,
    authors: [{ name: settings.name, ...(settings.linkedinUrl && { url: settings.linkedinUrl }) }],
    creator: settings.name,
    publisher: settings.name,
    category: "Data Engineering",
    // No `alternates.canonical` and no `openGraph.url` here on purpose: values set on a
    // layout are inherited by every child page, which made each page claim to be the
    // homepage. Each page supplies its own via pageMetadata() in src/lib/seo.ts.
    openGraph: {
      type: "website",
      siteName: settings.name,
      locale: "en_GB"
    },
    twitter: { card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    }
  };
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:shadow-lg"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
