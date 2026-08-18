import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loginAction } from "@/actions/auth";
import { getCurrentAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [admin, query] = await Promise.all([getCurrentAdmin(), searchParams]);
  if (admin) redirect("/admin");
  return <section className="min-h-screen bg-[#f5f7f9] px-4 py-16"><div className="mx-auto max-w-md"><div className="card p-7"><p className="eyebrow">Secure Admin</p><h1 className="mt-3 text-3xl font-extrabold">Caleb CMS Login</h1><p className="muted mt-3">Manage portfolio content, enquiries and consultation bookings.</p>{query.error && <div className="alert-error mt-5">{query.error}</div>}<form action={loginAction} className="mt-7 grid gap-5"><div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" autoComplete="email" required /></div><div><label className="label" htmlFor="password">Password</label><input className="field" id="password" name="password" type="password" autoComplete="current-password" required /></div><button className="btn btn-primary" type="submit">Login</button></form></div></div></section>;
}
