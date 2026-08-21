import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Serves the profile photo uploaded through the admin panel. Returns 404 when none has
 * been uploaded; the About page checks first and falls back to the placeholder graphic,
 * so a missing photo never shows as a broken image.
 */
export async function GET() {
  const photo = await prisma.mediaAsset.findUnique({ where: { id: "profile-photo" } });
  if (!photo) return new NextResponse("No profile photo uploaded.", { status: 404 });

  return new NextResponse(new Uint8Array(photo.data), {
    headers: {
      "content-type": photo.contentType,
      "content-length": String(photo.size),
      // Revalidated explicitly when the admin uploads or removes the photo.
      "cache-control": "public, max-age=0, s-maxage=86400, must-revalidate"
    }
  });
}
