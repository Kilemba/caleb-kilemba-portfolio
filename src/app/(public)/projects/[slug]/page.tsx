import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TechBadge } from "@/components/public/TechBadge";

/**
 * Prerenders the published project pages at build time. Slugs created later still work:
 * Next renders them on first request and caches the result.
 */
export async function generateStaticParams() {
  const projects = await prisma.project.findMany({ where: { published: true }, select: { slug: true } });
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findFirst({ where: { slug, published: true } });
  if (!project) return { title: "Project" };
  return { title: project.title, description: project.summary, openGraph: { title: project.title, description: project.summary, images: project.coverImage ? [project.coverImage] : undefined } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({ where: { slug, published: true }, include: { technologies: true } });
  if (!project) notFound();
  return <article className="section-space"><div className="container-site max-w-5xl"><span className="badge">{project.category}</span><h1 className="h1 mt-5">{project.title}</h1><p className="lead mt-7">{project.summary}</p>{project.coverImage && <img src={project.coverImage} alt={`${project.title} project cover`} className="mt-10 max-h-[560px] w-full rounded-2xl border border-[#e5e7eb] object-cover" />}<div className="mt-8 flex flex-wrap gap-2">{project.technologies.map((t) => <TechBadge key={t.id} name={t.name} />)}</div><div className="mt-14 grid gap-10"><section><p className="eyebrow">Business Problem</p><p className="lead mt-4">{project.businessProblem}</p></section><section><p className="eyebrow">Solution</p><p className="lead mt-4">{project.solution}</p></section><section><p className="eyebrow">Business Impact</p><p className="lead mt-4">{project.businessImpact}</p>{project.impactMetric && <div className="card mt-5 p-5"><strong>Impact metric</strong><p className="muted mt-2">{project.impactMetric}</p></div>}</section><section><p className="eyebrow">Architecture</p><p className="lead mt-4 whitespace-pre-wrap">{project.architecture}</p></section><section><p className="eyebrow">Case Study</p><div className="prose-caleb mt-4 whitespace-pre-wrap">{project.caseStudy}</div></section></div><div className="mt-12 flex flex-wrap gap-3">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">GitHub Repository</a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">Live Demo</a>}<Link href="/book" className="btn btn-primary">Book a Consultation</Link></div></div></article>;
}
