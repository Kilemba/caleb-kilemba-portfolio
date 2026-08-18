import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminDashboard() {
  const [projects, posts, pendingBookings, unreadMessages] = await Promise.all([
    prisma.project.count(), prisma.blogPost.count({ where: { published: true } }),
    prisma.booking.count({ where: { status: "PENDING" } }), prisma.contactMessage.count({ where: { status: "UNREAD" } })
  ]);
  const cards = [["Total projects", projects, "/admin/projects"], ["Published blog posts", posts, "/admin/blog"], ["Pending bookings", pendingBookings, "/admin/bookings"], ["Unread messages", unreadMessages, "/admin/messages"]] as const;
  return <><AdminPageHeader title="Dashboard" description="Manage the content and client workflow for calebkilemba.com." /><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, href]) => <Link href={href} key={label} className="card p-6"><p className="muted text-sm font-semibold">{label}</p><p className="mt-3 text-4xl font-extrabold">{value}</p></Link>)}</div><div className="card mt-7 p-6"><h2 className="text-xl font-extrabold">Content workflow</h2><p className="muted mt-3 leading-7">Create or edit Projects, Blog posts, Services and Site Settings here, then publish them. The public website reads directly from PostgreSQL, so normal content updates do not require code changes.</p></div></>;
}
