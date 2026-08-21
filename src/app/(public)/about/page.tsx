import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { getResumeMeta } from "@/lib/resume";
import { pageMetadata } from "@/lib/seo";
import { Testimonials } from "@/components/public/Testimonials";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "About Caleb Kilemba and his approach to data engineering and analytics engineering.",
  path: "/about"
});

/**
 * TODO (Caleb): add your photo to public/images/ and point this at it, e.g.
 * "/images/profile.jpg". A portrait crop around 480x560 works best.
 *
 * This is a constant rather than a filesystem check on purpose: on Vercel the public
 * directory is served from the CDN and is not guaranteed to be readable from the
 * rendering function, so probing for the file can report "missing" even when it is live.
 */
const PROFILE_PHOTO = "/images/profile-placeholder.svg";
const PLACEHOLDER = "/images/profile-placeholder.svg";

export default async function AboutPage() {
  const [settings, resume] = await Promise.all([getSiteSettings(), getResumeMeta()]);
  const usingPlaceholder = PROFILE_PHOTO === PLACEHOLDER;

  return (
    <section className="section-space">
      <div className="container-site max-w-5xl">
        <div className="grid gap-10 md:grid-cols-[.62fr_1fr] md:items-start">
          <div>
            <img
              src={PROFILE_PHOTO}
              alt={usingPlaceholder ? "Profile photo placeholder" : `${settings.name}, ${settings.professionalTitle}`}
              width={480}
              height={560}
              className="w-full rounded-2xl border border-[#e1e7ec] object-cover"
            />
            {usingPlaceholder && (
              <p className="muted mt-3 text-xs">
                Placeholder — set <code>PROFILE_PHOTO</code> in this page to your own image.
              </p>
            )}
          </div>

          <div>
            <p className="eyebrow">About</p>
            <h1 className="h1 mt-5">{settings.name}</h1>
            <p className="lead mt-6">{settings.professionalTitle}</p>
            <div className="mt-8 space-y-5">
              {settings.aboutText.split("\n").filter(Boolean).map((paragraph) => (
                <p key={paragraph} className="lead">{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {settings.linkedinUrl && (
                <a className="btn btn-primary" href={settings.linkedinUrl} target="_blank" rel="noreferrer noopener">
                  Connect on LinkedIn
                </a>
              )}
              <Link href="/book" className="btn btn-secondary">Book My Services</Link>
              {resume.available && (
                <a className="btn btn-secondary" href="/resume">Download Resume/CV</a>
              )}
            </div>
          </div>
        </div>

        <Testimonials />
      </div>
    </section>
  );
}
