import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { getResumeMeta } from "@/lib/resume";
import { SocialLinks } from "@/components/public/SocialLinks";

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
          <SocialLinks settings={settings} className="mt-5 flex gap-3" />
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
