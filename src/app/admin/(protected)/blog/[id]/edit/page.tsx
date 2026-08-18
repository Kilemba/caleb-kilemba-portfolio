import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BlogForm } from "@/components/admin/BlogForm";
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const post = await prisma.blogPost.findUnique({ where: { id }, include: { tags: true } }); if (!post) notFound(); return <><AdminPageHeader title="Edit Article" description={post.title} /><BlogForm post={post} /></>; }
