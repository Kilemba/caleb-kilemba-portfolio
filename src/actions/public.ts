"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { bookingSchema, contactSchema } from "@/lib/validation";
import { businessTimeNow, businessToday, generateTimeSlots, toDateOnly } from "@/lib/utils";

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
  const today = businessToday();
  if (bookingDate < today) redirect("/book?error=Please%20choose%20a%20date%20in%20the%20future.");

  const date = toDateOnly(bookingDate);
  const dayOfWeek = date.getUTCDay();
  const [service, availability, blocked] = await Promise.all([
    prisma.service.findFirst({ where: { id: serviceId, published: true } }),
    prisma.availability.findUnique({ where: { dayOfWeek } }),
    prisma.blockedDate.findUnique({ where: { date } })
  ]);

  if (!service) redirect("/book?error=Please%20choose%20a%20service.");
  if (!availability?.active) {
    redirect("/book?error=Consultations%20run%20Monday%20to%20Friday.%20Please%20choose%20a%20weekday.");
  }
  if (blocked) redirect("/book?error=That%20date%20is%20not%20available.%20Please%20choose%20another%20day.");
  const slots = generateTimeSlots(availability.startTime, availability.endTime, availability.slotDuration);
  if (!slots.includes(startTime)) redirect("/book?error=That%20time%20is%20not%20available.");
  // The form hides past slots, but a direct POST could still ask for one.
  if (bookingDate === today && startTime <= businessTimeNow()) {
    redirect("/book?error=That%20time%20has%20already%20passed.%20Please%20choose%20a%20later%20slot.");
  }

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
