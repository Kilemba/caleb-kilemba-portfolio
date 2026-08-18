import { setBookingStatus } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { dateOnlyString, formatDate } from "@/lib/utils";
import { BookingStatus } from "@/generated/prisma/enums";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({ orderBy: [{ bookingDate: "desc" }, { startTime: "desc" }], include: { service: true } });
  return <><AdminPageHeader title="Bookings" description="Review consultation requests and manage their status." /><div className="grid gap-5">{bookings.map((b) => <article key={b.id} className="card p-6"><div className="flex flex-wrap justify-between gap-4"><div><span className="badge">{b.status}</span><h2 className="mt-3 text-xl font-extrabold">{b.name} · {b.company}</h2><p className="muted mt-1 text-sm">{b.email}</p></div><div className="text-right"><p className="font-extrabold">{dateOnlyString(b.bookingDate)} at {b.startTime}</p><p className="muted text-sm">Submitted {formatDate(b.createdAt)}</p></div></div><div className="mt-5 rounded-xl bg-[#f7f9fb] p-4"><strong>{b.service.title}</strong><p className="muted mt-2 whitespace-pre-wrap leading-7">{b.projectDescription}</p></div><form action={setBookingStatus} className="mt-5 flex flex-wrap items-end gap-3"><input type="hidden" name="id" value={b.id} /><div><label className="label">Status</label><select className="field min-w-44" name="status" defaultValue={b.status}>{Object.values(BookingStatus).map((status) => <option key={status} value={status}>{status}</option>)}</select></div><button className="btn btn-primary">Update Status</button></form></article>)}{bookings.length === 0 && <p className="muted">No bookings yet.</p>}</div></>;
}
