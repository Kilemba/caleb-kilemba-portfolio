import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { getResumeMeta } from "@/lib/resume";
import { pageMetadata } from "@/lib/seo";
import { Testimonials } from "@/components/public/Testimonials";
import { ExperienceSection } from "@/components/public/ExperienceSection";
import { getProfilePhotoMeta, profilePhotoUrl } from "@/lib/media";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "About Caleb Kilemba and his approach to data engineering and analytics engineering.",
  path: "/about"
});

/** Shown until a photo is uploaded in the admin panel. */
const PLACEHOLDER = "/images/profile-placeholder.svg";

export default async function AboutPage() {
  const [settings, resume, photo] = await Promise.all([
    getSiteSettings(),
    getResumeMeta(),
    getProfilePhotoMeta()
  ]);
  const usingPlaceholder = !photo.available;
  const photoSrc = photo.available ? profilePhotoUrl(photo.updatedAt) : PLACEHOLDER;

  return (
    <section className="section-space">
      <div className="container-site max-w-5xl">
        <div className="grid gap-10 md:grid-cols-[.62fr_1fr] md:items-start">
          <div>
            <img
              src={photoSrc}
              alt={usingPlaceholder ? "Profile photo placeholder" : `${settings.name}, ${settings.professionalTitle}`}
              width={480}
              height={560}
              className="w-full rounded-2xl border border-[#e1e7ec] object-cover"
            />
            {usingPlaceholder && (
              <p className="muted mt-3 text-xs">
                Placeholder — upload a photo in Admin → Site Settings.
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

        <ExperienceSection />

        <Testimonials />
      </div>
    </section>
  );
}
