"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { bookingSchema, contactSchema } from "@/lib/validation";
import { generateTimeSlots, toDateOnly } from "@/lib/utils";

function todayInNairobi() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export async function submitContact(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message")
  });
  if (!parsed.success) redirect("/contact?error=Please%20check%20the%20form%20and%20try%20again.");
  await prisma.contactMessage.create({ data: parsed.data });
  redirect("/contact?success=1");
}

export async function submitBooking(formData: FormData) {
  const parsed = bookingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    serviceId: formData.get("serviceId"),
    projectDescription: formData.get("projectDescription"),
    bookingDate: formData.get("bookingDate"),
    startTime: formData.get("startTime")
  });
  if (!parsed.success) redirect("/book?error=Please%20complete%20all%20booking%20fields.");

  const { bookingDate, startTime, serviceId } = parsed.data;
  if (bookingDate < todayInNairobi()) redirect("/book?error=Please%20choose%20a%20future%20date.");

  const date = toDateOnly(bookingDate);
  const dayOfWeek = date.getUTCDay();
  const [service, availability, blocked] = await Promise.all([
    prisma.service.findFirst({ where: { id: serviceId, published: true } }),
    prisma.availability.findUnique({ where: { dayOfWeek } }),
    prisma.blockedDate.findUnique({ where: { date } })
  ]);

  if (!service || !availability?.active || blocked) {
    redirect("/book?error=That%20date%20is%20not%20available.");
  }
  const slots = generateTimeSlots(availability.startTime, availability.endTime, availability.slotDuration);
  if (!slots.includes(startTime)) redirect("/book?error=That%20time%20is%20not%20available.");

  const activeSlotKey = `${bookingDate}:${startTime}`;
  try {
    await prisma.booking.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company,
        projectDescription: parsed.data.projectDescription,
        bookingDate: date,
        startTime,
        activeSlotKey,
        serviceId
      }
    });
  } catch {
    redirect("/book?error=That%20slot%20was%20just%20taken.%20Please%20choose%20another%20time.");
  }
  redirect("/book?success=1");
}
