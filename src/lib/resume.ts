import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { getSiteSettings } from "@/lib/settings";

export type ResumeMeta = {
  available: boolean;
  filename: string | null;
  size: number | null;
  updatedAt: Date | null;
};

/**
 * Whether a CV can be downloaded, and its details when one was uploaded.
 *
 * The footer link and the landing page section both need this, so it is cached per render
 * to keep it to one query. Metadata only — selecting the file bytes here would load the
 * whole document on every page view.
 */
export const getResumeMeta = cache(async (): Promise<ResumeMeta> => {
  const [settings, file] = await Promise.all([
    getSiteSettings(),
    safeQuery(
      "resume",
      () =>
        prisma.resumeFile.findUnique({
          where: { id: "default" },
          select: { filename: true, size: true, updatedAt: true }
        }),
      null
    )
  ]);

  if (file) {
    return { available: true, filename: file.filename, size: file.size, updatedAt: file.updatedAt };
  }
  // An externally hosted CV still counts as available; /resume redirects to it.
  return { available: Boolean(settings.resumeUrl), filename: null, size: null, updatedAt: null };
});
