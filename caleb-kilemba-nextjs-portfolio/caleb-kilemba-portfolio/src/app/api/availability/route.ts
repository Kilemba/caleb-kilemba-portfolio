import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTimeSlots, toDateOnly } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get("date") || "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return NextResponse.json({ slots: [] }, { status: 400 });
  const date = toDateOnly(dateParam);
  const dayOfWeek = date.getUTCDay();
  const [availability, blocked, bookings] = await Promise.all([
    prisma.availability.findUnique({ where: { dayOfWeek } }),
    prisma.blockedDate.findUnique({ where: { date } }),
    prisma.booking.findMany({ where: { bookingDate: date, activeSlotKey: { not: null } }, select: { startTime: true } })
  ]);
  if (!availability?.active || blocked) return NextResponse.json({ slots: [] });
  const taken = new Set(bookings.map((b) => b.startTime));
  const slots = generateTimeSlots(availability.startTime, availability.endTime, availability.slotDuration).filter((slot) => !taken.has(slot));
  return NextResponse.json({ slots });
}
