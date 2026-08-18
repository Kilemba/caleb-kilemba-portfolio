import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

/**
 * Serves the CV uploaded through the admin panel.
 *
 * Falls back to the Resume URL in site settings when no file has been uploaded, so an
 * externally hosted CV keeps working. `?view=1` renders in the browser instead of
 * downloading, which is what the preview link in the admin uses.
 */
export async function GET(request: Request) {
  const resume = await prisma.resumeFile.findUnique({ where: { id: "default" } });

  if (!resume) {
    const settings = await getSiteSettings();
    if (settings.resumeUrl) return NextResponse.redirect(settings.resumeUrl);
    return new NextResponse("No resume has been uploaded yet.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" }
    });
  }

  const inline = new URL(request.url).searchParams.get("view") === "1";
  // Strip anything that could break out of the quoted filename in the header.
  const safeName = resume.filename.replace(/[^\w.\-() ]+/g, "_");

  return new NextResponse(new Uint8Array(resume.data), {
    headers: {
      "content-type": resume.contentType,
      "content-length": String(resume.size),
      "content-disposition": `${inline ? "inline" : "attachment"}; filename="${safeName}"`,
      // Revalidated explicitly whenever the admin uploads or removes a file.
      "cache-control": "public, max-age=0, s-maxage=3600, must-revalidate"
    }
  });
}
