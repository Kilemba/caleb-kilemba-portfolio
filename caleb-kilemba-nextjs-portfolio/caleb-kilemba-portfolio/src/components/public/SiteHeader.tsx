import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

const nav = [
  ["Home", "/"], ["About", "/about"], ["Services", "/services"], ["Projects", "/projects"],
  ["Blog", "/blog"], ["Contact", "/contact"]
];

export async function SiteHeader() {
  const settings = await getSiteSettings();
  return (
    <header className="sticky top-0 z-50 border-b border-[#e1e7ec] bg-white/95 backdrop-blur">
      <div className="container-site flex min-h-18 items-center justify-between gap-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight">{settings.name}</Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
          {nav.map(([label, href]) => <Link key={href} href={href} className="text-sm font-semibold text-[#5f6b7a] hover:text-[#0f766e]">{label}</Link>)}
          {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#5f6b7a] hover:text-[#0f766e]">LinkedIn</a>}
          <Link href="/book" className="btn btn-primary">Book My Services</Link>
        </nav>
        <details className="relative lg:hidden">
          <summary className="btn btn-secondary list-none cursor-pointer">Menu</summary>
          <nav className="absolute right-0 mt-2 w-64 rounded-xl border border-[#e1e7ec] bg-white p-3 shadow-xl" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {nav.map(([label, href]) => <Link key={href} href={href} className="rounded-lg px-3 py-2 font-semibold hover:bg-[#f7f9fb]">{label}</Link>)}
              {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-2 font-semibold hover:bg-[#f7f9fb]">LinkedIn</a>}
              <Link href="/book" className="btn btn-primary mt-2">Book My Services</Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
