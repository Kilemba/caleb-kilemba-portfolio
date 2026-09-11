import Link from "next/link";
import { logoutAction } from "@/actions/auth";

const links = [
  ["Dashboard", "/admin"],
  ["Projects", "/admin/projects"],
  ["Blog", "/admin/blog"],
  ["Services", "/admin/services"],
  ["Experience", "/admin/experience"],
  ["Bookings", "/admin/bookings"],
  ["Messages", "/admin/messages"],
  ["Testimonials", "/admin/testimonials"],
  ["Availability", "/admin/availability"],
  ["Settings", "/admin/settings"]
];

/** Two-letter monogram for the account chip, e.g. "Caleb Kilemba" -> "CK". */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminNav({ name }: { name: string }) {
  return (
    <header className="admin-nav">
      <div className="admin-nav-inner">
        <Link href="/admin" className="admin-brand">
          <span className="admin-brand-mark" aria-hidden="true">CK</span>
          <span>Caleb CMS</span>
        </Link>

        <nav className="admin-nav-links" aria-label="Admin navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="admin-nav-link">{label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/" className="admin-nav-link hidden sm:inline-flex" target="_blank" rel="noreferrer">
            View site
          </Link>
          <span className="admin-avatar" aria-hidden="true">{initials(name)}</span>
          <span className="hidden text-sm font-semibold lg:inline">{name}</span>
          <form action={logoutAction}>
            <button className="admin-logout">Log out</button>
          </form>
        </div>
      </div>
    </header>
  );
}
