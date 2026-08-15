import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const project = await prisma.project.findUnique({ where: { id }, include: { technologies: true } }); if (!project) notFound(); return <><AdminPageHeader title="Edit Project" description={project.title} /><ProjectForm project={project} /></>; }
