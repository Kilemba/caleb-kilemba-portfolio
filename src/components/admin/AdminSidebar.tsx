import Link from "next/link";
import { logoutAction } from "@/actions/auth";

const links = [
  ["Dashboard", "/admin"], ["Projects", "/admin/projects"], ["Blog", "/admin/blog"], ["Services", "/admin/services"],
  ["Bookings", "/admin/bookings"], ["Messages", "/admin/messages"], ["Availability", "/admin/availability"],
  ["Experience", "/admin/experience"], ["Testimonials", "/admin/testimonials"], ["Site Settings", "/admin/settings"]
];

export function AdminSidebar() {
  return <aside className="border-b border-[#e5e7eb] bg-[#0f1115] text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r"><div className="p-5"><Link href="/admin" className="text-lg font-extrabold">Caleb CMS</Link><nav className="mt-6 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">{links.map(([label, href]) => <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">{label}</Link>)}</nav><form action={logoutAction} className="mt-6"><button className="w-full rounded-lg border border-white/20 px-3 py-2 text-left text-sm font-semibold hover:bg-white/10">Logout</button></form></div></aside>;
}
