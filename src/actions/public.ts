"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { bookingSchema, contactSchema } from "@/lib/validation";
import { businessTimeNow, businessToday, generateTimeSlots, toDateOnly } from "@/lib/utils";

/**
 * Turns Zod issues into something a visitor can act on. Previously any failure produced
 * "Please complete all booking fields", which is misleading when every field is filled
 * but one is too short — the person has no way to tell what to change.
 */
const FIELD_LABELS: Record<string, string> = {
  name: "your name",
  email: "your email address",
  company: "your company",
  serviceId: "a service",
  projectDescription: "a description of your data problem (at least 20 characters)",
  subject: "a subject",
  message: "a message (at least 10 characters)",
  bookingDate: "a date",
  startTime: "a time"
};

function describeIssues(issues: { path: PropertyKey[] }[]): string {
  const fields = [...new Set(issues.map((i) => String(i.path[0])))]
    .map((field) => FIELD_LABELS[field] || field)
    .filter(Boolean);
  if (fields.length === 0) return "Please check the form and try again.";
  const list = fields.length === 1 ? fields[0] : `${fields.slice(0, -1).join(", ")} and ${fields.at(-1)}`;
  return `Please provide ${list}.`;
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
  if (!parsed.success) redirect(`/contact?error=${encodeURIComponent(describeIssues(parsed.error.issues))}`);
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
  if (!parsed.success) redirect(`/book?error=${encodeURIComponent(describeIssues(parsed.error.issues))}`);

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
