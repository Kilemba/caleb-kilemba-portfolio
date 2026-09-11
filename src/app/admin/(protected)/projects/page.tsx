import Link from "next/link";
import { deleteProject } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [projects, query] = await Promise.all([prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }), searchParams]);
  return <><AdminPageHeader title="Projects" description="Manage business-focused portfolio case studies." action={<Link className="btn btn-primary" href="/admin/projects/new">New Project</Link>} />{query.saved && <div className="alert-success mb-5">Project saved.</div>}<div className="card overflow-x-auto"><table className="admin-table"><thead><tr><th>Project</th><th>Category</th><th>Status</th><th>Order</th><th>Actions</th></tr></thead><tbody>{projects.map((p) => <tr key={p.id}><td><strong>{p.title}</strong><div className="muted text-xs">/{p.slug}</div></td><td>{p.category}</td><td>{p.published ? "Published" : "Draft"}{p.featured ? " · Featured" : ""}</td><td>{p.sortOrder}</td><td><div className="flex gap-2"><Link className="font-bold text-[#12875a]" href={`/admin/projects/${p.id}/edit`}>Edit</Link><form action={deleteProject}><input type="hidden" name="id" value={p.id} /><button className="font-bold text-red-700">Delete</button></form></div></td></tr>)}</tbody></table></div></>;
}
