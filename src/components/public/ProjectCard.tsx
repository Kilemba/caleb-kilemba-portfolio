import Link from "next/link";
import { TechBadge } from "@/components/public/TechBadge";

type ProjectCardProps = {
  project: { title: string; slug: string; category: string; summary: string; technologies: { name: string }[]; coverImage?: string | null };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="card overflow-hidden">
      {project.coverImage ? <img src={project.coverImage} alt={`${project.title} cover`} className="h-52 w-full object-cover" /> : <div className="h-44 bg-gradient-to-br from-[#e6f4ec] to-[#f6f7f8]" />}
      <div className="p-6">
        <span className="badge">{project.category}</span>
        <h3 className="mt-4 text-xl font-bold tracking-tight">{project.title}</h3>
        <p className="muted mt-3 leading-7">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">{project.technologies.slice(0, 5).map((t) => <TechBadge key={t.name} name={t.name} size="sm" />)}</div>
        <Link href={`/projects/${project.slug}`} className="mt-6 inline-flex font-bold text-[#12875a]">View case study →</Link>
      </div>
    </article>
  );
}
