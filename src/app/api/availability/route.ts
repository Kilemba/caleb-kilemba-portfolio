import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { businessTimeNow, businessToday, generateTimeSlots, toDateOnly } from "@/lib/utils";

/** Why a date has no slots, so the form can explain itself instead of going quiet. */
type Reason = "invalid-date" | "past-date" | "closed-day" | "blocked-date" | "fully-booked" | "day-over";

function empty(reason: Reason, status = 200) {
  return NextResponse.json({ slots: [], reason }, { status });
}

export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get("date") || "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return empty("invalid-date", 400);

  const today = businessToday();
  if (dateParam < today) return empty("past-date");

  const date = toDateOnly(dateParam);
  const dayOfWeek = date.getUTCDay();
  const [availability, blocked, bookings] = await Promise.all([
    prisma.availability.findUnique({ where: { dayOfWeek } }),
    prisma.blockedDate.findUnique({ where: { date } }),
    prisma.booking.findMany({
      where: { bookingDate: date, activeSlotKey: { not: null } },
      select: { startTime: true }
    })
  ]);

  // No row for this weekday, or the day is switched off: not a working day.
  if (!availability?.active) return empty("closed-day");
  if (blocked) return empty("blocked-date");

  const taken = new Set(bookings.map((b) => b.startTime));
  const all = generateTimeSlots(availability.startTime, availability.endTime, availability.slotDuration);

  // Slots earlier today have already passed — offering them produces bookings for a
  // time that cannot happen.
  const now = businessTimeNow();
  const bookable = all.filter((slot) => (dateParam === today ? slot > now : true));

  const slots = bookable.filter((slot) => !taken.has(slot));
  if (slots.length === 0) {
    return empty(bookable.length === 0 && dateParam === today ? "day-over" : "fully-booked");
  }

  return NextResponse.json({ slots });
}
