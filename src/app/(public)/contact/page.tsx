import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { submitContact } from "@/actions/public";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Contact Caleb Kilemba about data engineering, analytics, automation and consulting work.",
  path: "/contact"
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const [settings, query] = await Promise.all([getSiteSettings(), searchParams]);
  return <section className="section-space"><div className="container-site grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">Contact</p><h1 className="h2 mt-5">Tell me what you are trying to solve.</h1><p className="lead mt-5">Use the form for general enquiries, or book a consultation if you already know you would like to discuss a service.</p><div className="muted mt-7 space-y-2 text-sm">{settings.email && <p>Email: {settings.email}</p>}{settings.phone && <p>Phone: {settings.phone}</p>}{settings.location && <p>Location: {settings.location}</p>}</div></div><div className="card p-6 sm:p-8">{query.success && <div className="alert-success mb-5">Thank you. Your enquiry has been received.</div>}{query.error && <div className="alert-error mb-5">{query.error}</div>}<form action={submitContact} className="grid gap-5"><div className="grid gap-5 md:grid-cols-2"><div><label className="label" htmlFor="name">Name</label><input className="field" id="name" name="name" required /></div><div><label className="label" htmlFor="email">Email</label><input className="field" id="email" name="email" type="email" required /></div></div><div className="grid gap-5 md:grid-cols-2"><div><label className="label" htmlFor="company">Company</label><input className="field" id="company" name="company" required /></div><div><label className="label" htmlFor="phone">Phone (optional)</label><input className="field" id="phone" name="phone" /></div></div><div><label className="label" htmlFor="subject">Subject</label><input className="field" id="subject" name="subject" required /></div><div><label className="label" htmlFor="message">Message</label><textarea className="field min-h-40" id="message" name="message" required /></div><button className="btn btn-primary w-fit" type="submit">Send Enquiry</button></form></div></div></section>;
}
