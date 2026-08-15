import { setMessageStatus } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MessageStatus } from "@/generated/prisma/enums";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return <><AdminPageHeader title="Messages" description="View, mark as read/replied, or archive contact enquiries." /><div className="grid gap-5">{messages.map((m) => <article key={m.id} className="card p-6"><div className="flex flex-wrap justify-between gap-4"><div><span className="badge">{m.status}</span><h2 className="mt-3 text-xl font-extrabold">{m.subject}</h2><p className="muted mt-1 text-sm">{m.name} · {m.company} · {m.email}{m.phone ? ` · ${m.phone}` : ""}</p></div><p className="muted text-sm">{formatDate(m.createdAt)}</p></div><p className="mt-5 whitespace-pre-wrap leading-7">{m.message}</p><form action={setMessageStatus} className="mt-5 flex flex-wrap items-end gap-3"><input type="hidden" name="id" value={m.id} /><div><label className="label">Status</label><select className="field min-w-44" name="status" defaultValue={m.status}>{Object.values(MessageStatus).map((status) => <option key={status} value={status}>{status}</option>)}</select></div><button className="btn btn-primary">Update</button></form></article>)}{messages.length === 0 && <p className="muted">No contact messages yet.</p>}</div></>;
}
