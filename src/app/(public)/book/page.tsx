import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { getSiteSettings } from "@/lib/settings";
import { BookingForm } from "@/components/public/BookingForm";

export const metadata: Metadata = { title: "Book My Services", description: "Request a consultation with Caleb Kilemba for data engineering and analytics services." };

export default async function BookPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string; service?: string }> }) {
  const [settings, services, query] = await Promise.all([getSiteSettings(), safeQuery("services", () => prisma.service.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, select: { id: true, title: true } }), []), searchParams]);
  return <section className="section-space"><div className="container-site grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow">Book My Services</p><h1 className="h2 mt-5">Start with a focused consultation.</h1><p className="lead mt-5">{settings.bookingIntroduction}</p><p className="muted mt-6 text-sm">Submitting a request creates a pending booking. Caleb can confirm or cancel it from the secure admin dashboard.</p></div><div className="card p-6 sm:p-8">{query.success && <div className="alert-success mb-5">Your consultation request has been submitted. The booking is pending confirmation.</div>}{query.error && <div className="alert-error mb-5">{query.error}</div>}<BookingForm services={services} initialServiceId={query.service || ""} /></div></div></section>;
}
