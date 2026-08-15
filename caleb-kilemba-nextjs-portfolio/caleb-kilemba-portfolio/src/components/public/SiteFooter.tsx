import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  return (
    <footer className="border-t border-[#e1e7ec] py-10">
      <div className="container-site grid gap-6 md:grid-cols-2 md:items-end">
        <div>
          <p className="font-extrabold">{settings.name}</p>
          <p className="muted mt-2 max-w-xl text-sm">{settings.professionalTitle}. Building practical data systems around real business problems.</p>
        </div>
        <div className="flex flex-wrap gap-4 md:justify-end">
          <Link href="/projects" className="text-sm font-semibold">Projects</Link>
          <Link href="/blog" className="text-sm font-semibold">Blog</Link>
          <Link href="/contact" className="text-sm font-semibold">Contact</Link>
          <Link href="/book" className="text-sm font-semibold text-[#0f766e]">Book a Consultation</Link>
        </div>
      </div>
      <div className="container-site mt-7 text-xs muted">© {new Date().getFullYear()} {settings.name}. All rights reserved.</div>
    </footer>
  );
}
