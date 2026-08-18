import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Services", description: "Data engineering, automation, warehousing, analytics and consulting services by Caleb Kilemba." };

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { title: "asc" }], include: { technologies: true } });
  return <section className="section-space"><div className="container-site"><p className="eyebrow">Services</p><h1 className="h1 mt-5 max-w-5xl">Practical data engineering services for growing organisations.</h1><p className="lead mt-7 max-w-3xl">From data movement and automation to analytical modelling and reporting, each engagement starts with the business problem rather than the tool.</p><div className="mt-12 grid gap-6 md:grid-cols-2">{services.map((service) => <article key={service.id} className="card p-7"><h2 className="text-2xl font-extrabold">{service.title}</h2><p className="lead mt-4 !text-base">{service.description}</p><div className="mt-5 flex flex-wrap gap-2">{service.technologies.map((t) => <span className="badge" key={t.id}>{t.name}</span>)}</div><Link href={`/book?service=${service.id}`} className="mt-7 inline-flex font-bold text-[#0f766e]">Discuss this service →</Link></article>)}</div></div></section>;
}
