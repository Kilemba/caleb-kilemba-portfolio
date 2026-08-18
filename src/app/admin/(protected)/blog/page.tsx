import Link from "next/link";
import { deleteBlogPost } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [posts, query] = await Promise.all([prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } }), searchParams]);
  return <><AdminPageHeader title="Blog" description="Write technical articles in Markdown, save drafts and publish when ready." action={<Link className="btn btn-primary" href="/admin/blog/new">New Article</Link>} />{query.saved && <div className="alert-success mb-5">Article saved.</div>}<div className="card overflow-x-auto"><table className="admin-table"><thead><tr><th>Article</th><th>Category</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{posts.map((p) => <tr key={p.id}><td><strong>{p.title}</strong></td><td>{p.category}</td><td>{p.published ? "Published" : "Draft"}{p.featured ? " · Featured" : ""}</td><td>{formatDate(p.updatedAt)}</td><td><div className="flex gap-2"><Link className="font-bold text-[#0f766e]" href={`/admin/blog/${p.id}/edit`}>Edit</Link><form action={deleteBlogPost}><input type="hidden" name="id" value={p.id} /><button className="font-bold text-red-700">Delete</button></form></div></td></tr>)}</tbody></table></div></>;
}
