import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { LinkedInIcon } from "@/components/public/LinkedInIcon";

const nav = [
  ["Home", "/"], ["About", "/about"], ["Services", "/services"], ["Projects", "/projects"],
  ["Blog", "/blog"], ["Contact", "/contact"]
];

export async function SiteHeader() {
  const settings = await getSiteSettings();
  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 backdrop-blur">
      <div className="container-site flex min-h-18 items-center justify-between gap-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight">{settings.name}</Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-[#5b6470] hover:text-[#12875a]">{label}</Link>
          ))}
          {settings.linkedinUrl && (
            <a
              href={settings.linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5b6470] hover:text-[#12875a]"
              aria-label={`Connect with ${settings.name} on LinkedIn (opens in a new tab)`}
            >
              <LinkedInIcon className="h-4 w-4" />
              LinkedIn
            </a>
          )}
          <Link href="/book" className="btn btn-primary">Book My Services</Link>
        </nav>

        <details className="relative lg:hidden">
          <summary className="btn btn-secondary list-none cursor-pointer">Menu</summary>
          <nav className="absolute right-0 mt-2 w-64 rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-xl" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="rounded-lg px-3 py-2 font-semibold hover:bg-[#f6f7f8]">{label}</Link>
              ))}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-semibold hover:bg-[#f6f7f8]"
                  aria-label={`Connect with ${settings.name} on LinkedIn (opens in a new tab)`}
                >
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              <Link href="/book" className="btn btn-primary mt-2">Book My Services</Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
