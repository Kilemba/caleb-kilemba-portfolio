import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { getResumeMeta } from "@/lib/resume";
import { LinkedInIcon } from "@/components/public/LinkedInIcon";

export async function SiteFooter() {
  const [settings, resume] = await Promise.all([getSiteSettings(), getResumeMeta()]);
  return (
    <footer className="border-t border-[#e5e7eb] py-12">
      <div className="container-site grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-extrabold">{settings.name}</p>
          <p className="muted mt-2 max-w-sm text-sm leading-7">
            {settings.professionalTitle}. Building practical data systems around real business problems.
          </p>
          {settings.linkedinUrl && (
            <a
              href={settings.linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] px-3.5 py-2 text-sm font-bold hover:border-[#12875a] hover:text-[#12875a]"
              aria-label={`Connect with ${settings.name} on LinkedIn (opens in a new tab)`}
            >
              <LinkedInIcon className="h-4 w-4" />
              Connect on LinkedIn
            </a>
          )}
        </div>

        <nav aria-label="Footer navigation">
          <p className="text-sm font-extrabold">Explore</p>
          <ul className="mt-3 space-y-2">
            {[["Services", "/services"], ["Projects", "/projects"], ["About", "/about"], ["Blog", "/blog"]].map(([label, href]) => (
              <li key={href}><Link href={href} className="muted text-sm hover:text-[#12875a]">{label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer contact links">
          <p className="text-sm font-extrabold">Work together</p>
          <ul className="mt-3 space-y-2">
            <li><Link href="/book" className="text-sm font-semibold text-[#12875a]">Book a consultation</Link></li>
            <li><Link href="/contact" className="muted text-sm hover:text-[#12875a]">Contact</Link></li>
            <li><Link href="/#faq" className="muted text-sm hover:text-[#12875a]">Common questions</Link></li>
            {resume.available && (
              <li><a href="/resume" className="muted text-sm hover:text-[#12875a]">Download resume</a></li>
            )}
            {settings.email && (
              <li><a href={`mailto:${settings.email}`} className="muted text-sm hover:text-[#12875a]">{settings.email}</a></li>
            )}
          </ul>
        </nav>
      </div>

      <div className="container-site mt-9 border-t border-[#e5e7eb] pt-6 text-xs muted">
        © {new Date().getFullYear()} {settings.name}. All rights reserved.
      </div>
    </footer>
  );
}
