import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { getSiteSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: { default: `${settings.name} | Data Engineer & Consultant`, template: `%s | ${settings.name}` },
    description: settings.seoDescription,
    openGraph: {
      type: "website",
      title: `${settings.name} | ${settings.professionalTitle}`,
      description: settings.seoDescription,
      url: base
    }
  };
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <><SiteHeader /><main>{children}</main><SiteFooter /></>;
}
