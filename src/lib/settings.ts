import { cache } from "react";
import type { SiteSettings } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Rendered whenever the settings row has not been created yet, or when the database
 * is briefly unreachable. Keeping a complete fallback here means a dropped connection
 * degrades the page to default copy instead of returning a 500.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "default",
  name: "Caleb Kilemba",
  professionalTitle: "Data Engineer • Analytics Engineer • Consultant",
  heroHeading: "I build data solutions that solve real business problems.",
  homepageIntroduction:
    "I'm Caleb Kilemba. I help businesses turn fragmented, manual and difficult-to-use data into reliable pipelines, automated reporting systems, analytics platforms and decision-ready information.",
  aboutText:
    "I'm Caleb Kilemba, a Data Engineer focused on designing systems that make organisational data reliable, accessible and useful.",
  linkedinUrl: null,
  githubUrl: null,
  email: null,
  phone: null,
  location: null,
  resumeUrl: null,
  seoDescription:
    "Caleb Kilemba is a Data Engineer, Analytics Engineer and Consultant building practical data solutions.",
  bookingIntroduction:
    "Choose a service and an available time, then describe the data problem you want to solve.",
  createdAt: new Date(0),
  updatedAt: new Date(0)
};

/**
 * The layout, header, footer and page body all need settings, so this is wrapped in
 * `cache` to collapse them into a single query per render instead of one round-trip each.
 * This is a read: the row is seeded by `npm run db:seed` or the admin settings screen,
 * never written on a page view.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    return (await prisma.siteSettings.findUnique({ where: { id: "default" } })) ?? DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.error("[settings] falling back to defaults:", (error as Error).message);
    return DEFAULT_SITE_SETTINGS;
  }
});
