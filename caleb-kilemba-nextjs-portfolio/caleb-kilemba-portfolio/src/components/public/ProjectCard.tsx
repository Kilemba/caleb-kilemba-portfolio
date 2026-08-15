import Link from "next/link";

type ProjectCardProps = {
  project: { title: string; slug: string; category: string; summary: string; technologies: { name: string }[]; coverImage?: string | null };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="card overflow-hidden">
      {project.coverImage ? <img src={project.coverImage} alt={`${project.title} cover`} className="h-52 w-full object-cover" /> : <div className="h-44 bg-gradient-to-br from-[#e8f5f3] to-[#f7f9fb]" />}
      <div className="p-6">
        <span className="badge">{project.category}</span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight">{project.title}</h3>
        <p className="muted mt-3 leading-7">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">{project.technologies.slice(0, 5).map((t) => <span key={t.name} className="text-xs font-semibold text-[#5f6b7a]">{t.name}</span>)}</div>
        <Link href={`/projects/${project.slug}`} className="mt-6 inline-flex font-bold text-[#0f766e]">View case study →</Link>
      </div>
    </article>
  );
}
