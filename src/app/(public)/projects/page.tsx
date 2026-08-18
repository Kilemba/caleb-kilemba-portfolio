import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { ProjectCard } from "@/components/public/ProjectCard";

export const metadata: Metadata = { title: "Projects", description: "Data engineering case studies focused on business problems, solutions and business impact." };

export default async function ProjectsPage() {
  const projects = await safeQuery("projects", () => prisma.project.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { technologies: true } }), []);
  return <section className="section-space"><div className="container-site"><p className="eyebrow">Projects</p><h1 className="h1 mt-5 max-w-5xl">Business problems solved with reliable data systems.</h1><p className="lead mt-7 max-w-3xl">Each case study explains the business problem, technical approach, architecture and practical value—without invented metrics.</p><div className="mt-12 grid gap-6 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div></div></section>;
}
