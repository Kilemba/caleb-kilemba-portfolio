import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatDate } from "@/lib/utils";

/** Tinted plates for the stat cards, one tone per metric as in the reference dashboard. */
const TONES = [
  { bg: "#fdf3e3", fg: "#a9690d" },
  { bg: "#e9effd", fg: "#2d4fa2" },
  { bg: "#efeafc", fg: "#5b3fb8" },
  { bg: "#e6f4ec", fg: "#0c6845" }
];

function KpiIcon({ index }: { index: number }) {
  const paths = [
    // inbox
    <>
      <path d="M3.5 12.5h4l1.2 2.2h6.6l1.2-2.2h4" />
      <path d="M5.2 5.5h13.6l1.7 7v4.5a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2V12.5z" />
    </>,
    // people
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.6a3 3 0 0 1 0 4.8M17.5 19a5.5 5.5 0 0 0-2-4.3" />
    </>,
    // document
    <>
      <path d="M6.5 3.5h7l4 4v13h-11z" />
      <path d="M13.5 3.5v4h4" />
      <path d="M9 12h6M9 15.5h6" />
    </>,
    // clipboard check
    <>
      <path d="M9 4.5H7.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2H15" />
      <rect x="9" y="2.8" width="6" height="3.4" rx="1.2" />
      <path d="m9.8 13 1.9 1.9 3.5-3.6" />
    </>
  ];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {paths[index]}
    </svg>
  );
}

export default async function AdminDashboard() {
  const [projects, posts, pendingBookings, unreadMessages, totalBookings, confirmed, recentBookings, recentMessages] =
    await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: { in: ["CONFIRMED", "COMPLETED"] } } }),
      prisma.booking.findMany({
        where: { status: "PENDING" },
        orderBy: [{ bookingDate: "asc" }, { startTime: "asc" }],
        include: { service: true },
        take: 5
      }),
      prisma.contactMessage.findMany({ where: { status: "UNREAD" }, orderBy: { createdAt: "desc" }, take: 4 })
    ]);

  const cards = [
    { label: "Pending bookings", value: pendingBookings, note: "Oldest first below", href: "/admin/bookings" },
    { label: "Unread messages", value: unreadMessages, note: "From the contact form", href: "/admin/messages" },
    { label: "Your projects", value: projects, note: "Case studies published", href: "/admin/projects" },
    { label: "Published articles", value: posts, note: "Live on the blog", href: "/admin/blog" }
  ];

  // Share of all booking requests that have been confirmed or completed.
  const confirmRate = totalBookings === 0 ? 0 : Math.round((confirmed / totalBookings) * 100);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Review requests, manage your content and keep an eye on what needs attention."
        action={
          <div className="flex flex-wrap gap-2.5">
            <Link href="/admin/blog/new" className="btn btn-secondary">New article</Link>
            <Link href="/admin/projects/new" className="btn btn-primary">+ New project</Link>
          </div>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <Link key={card.label} href={card.href} className="kpi transition hover:border-[#d4d8dd]">
            <div className="flex items-start justify-between gap-4">
              <p className="kpi-label">{card.label}</p>
              <span className="kpi-icon" style={{ background: TONES[i].bg, color: TONES[i].fg }}>
                <KpiIcon index={i} />
              </span>
            </div>
            <p className="kpi-value mt-5">{card.value}</p>
            <p className="kpi-note mt-2">{card.note}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.65fr_1fr]">
        <section className="admin-panel">
          <h2 className="text-xl font-extrabold">Bookings awaiting confirmation</h2>
          <p className="muted mt-2 text-sm">Soonest first, so nothing is missed.</p>

          <div className="mt-5">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="admin-row">
                <div className="min-w-0">
                  <p className="font-bold">{booking.service.title}</p>
                  <p className="muted mt-1 text-sm">
                    {booking.name} · {booking.company} · {formatDate(booking.bookingDate)} at {booking.startTime}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="status-pill bg-[#e9effd] text-[#2d4fa2]">{booking.status}</span>
                  <Link href="/admin/bookings" className="btn btn-primary !min-h-9 !px-3.5 !text-sm">Review</Link>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && (
              <p className="muted text-sm">No bookings waiting. New requests appear here automatically.</p>
            )}
          </div>

          {recentMessages.length > 0 && (
            <div className="mt-8 border-t border-[#e5e7eb] pt-6">
              <h3 className="text-base font-extrabold">Unread messages</h3>
              <div className="mt-3">
                {recentMessages.map((message) => (
                  <div key={message.id} className="admin-row">
                    <div className="min-w-0">
                      <p className="font-bold">{message.subject}</p>
                      <p className="muted mt-1 text-sm">{message.name} · {formatDate(message.createdAt)}</p>
                    </div>
                    <Link href="/admin/messages" className="btn btn-secondary !min-h-9 !px-3.5 !text-sm">Open</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="admin-panel">
          <h2 className="text-xl font-extrabold">Booking health</h2>

          <p className="muted mt-5 text-sm font-semibold">Confirmation rate</p>
          <p className="kpi-value mt-2">{confirmRate}%</p>
          <div className="meter mt-3">
            <span style={{ width: `${confirmRate}%` }} />
          </div>
          <p className="kpi-note mt-2">
            {confirmed} of {totalBookings} request{totalBookings === 1 ? "" : "s"} confirmed.
          </p>

          <div className="mt-7 grid gap-2.5">
            <Link href="/admin/availability" className="btn btn-secondary w-full">Edit availability</Link>
            <Link href="/admin/settings" className="btn btn-secondary w-full">Site settings</Link>
            <Link href="/" target="_blank" rel="noreferrer" className="btn btn-primary w-full">View live site</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
