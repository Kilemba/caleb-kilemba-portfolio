import type { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "About", description: "About Caleb Kilemba and his approach to data engineering and analytics engineering." };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <section className="section-space"><div className="container-site max-w-4xl"><p className="eyebrow">About</p><h1 className="h1 mt-5">{settings.name}</h1><p className="lead mt-6">{settings.professionalTitle}</p><div className="mt-10 space-y-5">{settings.aboutText.split("\n").filter(Boolean).map((p) => <p key={p} className="lead">{p}</p>)}</div><div className="mt-8 flex flex-wrap gap-3">{settings.linkedinUrl && <a className="btn btn-primary" href={settings.linkedinUrl} target="_blank" rel="noreferrer">Connect on LinkedIn</a>}<Link href="/book" className="btn btn-secondary">Book My Services</Link>{settings.resumeUrl && <a className="btn btn-secondary" href={settings.resumeUrl} target="_blank" rel="noreferrer">View Resume/CV</a>}</div></div></section>;
}
