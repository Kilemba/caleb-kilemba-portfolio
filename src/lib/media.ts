import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

export const PROFILE_PHOTO_ID = "profile-photo";

export type ProfilePhotoMeta = {
  available: boolean;
  filename: string | null;
  size: number | null;
  contentType: string | null;
  updatedAt: Date | null;
};

/**
 * Whether an uploaded profile photo exists, and its details.
 *
 * Metadata only — selecting the image bytes here would load the whole file on every page
 * render. Cached per request so the About page and the admin screen share one query.
 * The `updatedAt` value is used as a cache-busting query string so a replaced photo shows
 * immediately instead of serving the previous one from the browser cache.
 */
export const getProfilePhotoMeta = cache(async (): Promise<ProfilePhotoMeta> => {
  const asset = await safeQuery(
    "profile photo",
    () =>
      prisma.mediaAsset.findUnique({
        where: { id: PROFILE_PHOTO_ID },
        select: { filename: true, size: true, contentType: true, updatedAt: true }
      }),
    null
  );

  if (!asset) return { available: false, filename: null, size: null, contentType: null, updatedAt: null };
  return { available: true, ...asset };
});

/** URL for the profile photo, versioned so a replacement is not served from cache. */
export function profilePhotoUrl(updatedAt: Date | null) {
  return updatedAt ? `/profile-photo?v=${updatedAt.getTime()}` : "/profile-photo";
}
