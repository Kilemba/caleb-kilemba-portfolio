"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogSchema, experienceSchema, projectSchema, serviceSchema, siteSettingsSchema, testimonialSchema } from "@/lib/validation";
import { slugify, splitCsv, toDateOnly } from "@/lib/utils";
import { BookingStatus, MessageStatus } from "@/generated/prisma/enums";

/**
 * Listing and detail routes both cache, so an edit has to clear both. Passing the route
 * pattern with "page" clears every slug under it, which is what a rename or unpublish needs.
 */
function revalidateProjects() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

function revalidateBlog() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/rss.xml");
  revalidatePath("/sitemap.xml");
}

const checkbox = (formData: FormData, name: string) => formData.get(name) === "on";
const str = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();
const optional = (value: string) => value || null;

async function technologyConnections(names: string[]) {
  const records = [];
  for (const name of names) {
    const record = await prisma.technology.upsert({
      where: { name },
      update: {},
      create: { name, slug: slugify(name) }
    });
    records.push({ id: record.id });
  }
  return records;
}

async function tagConnections(names: string[]) {
  const records = [];
  for (const name of names) {
    const record = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, slug: slugify(name) }
    });
    records.push({ id: record.id });
  }
  return records;
}

export async function saveProject(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const raw = {
    title: str(formData, "title"), slug: str(formData, "slug"), category: str(formData, "category"),
    summary: str(formData, "summary"), businessProblem: str(formData, "businessProblem"), solution: str(formData, "solution"),
    businessImpact: str(formData, "businessImpact"), impactMetric: str(formData, "impactMetric"), architecture: str(formData, "architecture"),
    caseStudy: str(formData, "caseStudy"), coverImage: str(formData, "coverImage"), githubUrl: str(formData, "githubUrl"),
    liveUrl: str(formData, "liveUrl"), sortOrder: str(formData, "sortOrder") || "0", featured: checkbox(formData, "featured"),
    published: checkbox(formData, "published")
  };
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) redirect(`${id ? `/admin/projects/${id}/edit` : "/admin/projects/new"}?error=Please%20check%20the%20project%20fields.`);
  const technologies = await technologyConnections(splitCsv(formData.get("technologies")));
  const baseData = {
    ...parsed.data,
    impactMetric: optional(parsed.data.impactMetric || ""), coverImage: optional(parsed.data.coverImage || ""),
    githubUrl: optional(parsed.data.githubUrl || ""), liveUrl: optional(parsed.data.liveUrl || "")
  };
  if (id) await prisma.project.update({ where: { id }, data: { ...baseData, technologies: { set: technologies } } });
  else await prisma.project.create({ data: { ...baseData, technologies: { connect: technologies } } });
  revalidateProjects();
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(formData: FormData) {
  await assertAdmin();
  await prisma.project.delete({ where: { id: str(formData, "id") } });
  revalidateProjects();
}

export async function saveService(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const parsed = serviceSchema.safeParse({
    title: str(formData, "title"), slug: str(formData, "slug"), description: str(formData, "description"),
    sortOrder: str(formData, "sortOrder") || "0", published: checkbox(formData, "published")
  });
  if (!parsed.success) redirect(`/admin/services?error=Please%20check%20the%20service%20fields.`);
  const technologies = await technologyConnections(splitCsv(formData.get("technologies")));
  if (id) await prisma.service.update({ where: { id }, data: { ...parsed.data, technologies: { set: technologies } } });
  else await prisma.service.create({ data: { ...parsed.data, technologies: { connect: technologies } } });
  revalidatePath("/"); revalidatePath("/services");
  redirect("/admin/services?saved=1");
}

export async function deleteService(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const bookingCount = await prisma.booking.count({ where: { serviceId: id } });
  if (bookingCount) redirect("/admin/services?error=This%20service%20has%20bookings%20and%20cannot%20be%20deleted.%20Unpublish%20it%20instead.");
  await prisma.service.delete({ where: { id } });
  revalidatePath("/"); revalidatePath("/services");
}

export async function saveBlogPost(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const parsed = blogSchema.safeParse({
    title: str(formData, "title"), slug: str(formData, "slug"), excerpt: str(formData, "excerpt"),
    content: String(formData.get("content") ?? ""), coverImage: str(formData, "coverImage"), category: str(formData, "category"),
    published: checkbox(formData, "published"), featured: checkbox(formData, "featured"),
    devToUrl: str(formData, "devToUrl"), canonicalUrl: str(formData, "canonicalUrl")
  });
  if (!parsed.success) redirect(`${id ? `/admin/blog/${id}/edit` : "/admin/blog/new"}?error=Please%20check%20the%20blog%20fields.`);
  const tags = await tagConnections(splitCsv(formData.get("tags")));
  const existing = id ? await prisma.blogPost.findUnique({ where: { id } }) : null;
  const publishedAt = parsed.data.published ? (existing?.publishedAt ?? new Date()) : null;
  const baseData = {
    ...parsed.data,
    coverImage: optional(parsed.data.coverImage || ""), devToUrl: optional(parsed.data.devToUrl || ""),
    canonicalUrl: optional(parsed.data.canonicalUrl || ""), publishedAt
  };
  if (id) await prisma.blogPost.update({ where: { id }, data: { ...baseData, tags: { set: tags } } });
  else await prisma.blogPost.create({ data: { ...baseData, tags: { connect: tags } } });
  revalidateBlog();
  redirect("/admin/blog?saved=1");
}

export async function deleteBlogPost(formData: FormData) {
  await assertAdmin();
  await prisma.blogPost.delete({ where: { id: str(formData, "id") } });
  revalidateBlog();
}

export async function setBookingStatus(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status") as BookingStatus;
  if (!Object.values(BookingStatus).includes(status)) throw new Error("Invalid booking status");
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new Error("Booking not found");
  const slotKey = `${booking.bookingDate.toISOString().slice(0, 10)}:${booking.startTime}`;
  await prisma.booking.update({
    where: { id },
    data: { status, activeSlotKey: status === BookingStatus.PENDING || status === BookingStatus.CONFIRMED ? slotKey : null }
  });
  revalidatePath("/admin/bookings");
}

export async function setMessageStatus(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status") as MessageStatus;
  if (!Object.values(MessageStatus).includes(status)) throw new Error("Invalid message status");
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/admin/messages");
}

export async function saveAvailability(formData: FormData) {
  await assertAdmin();
  const dayOfWeek = Number(str(formData, "dayOfWeek"));
  const startTime = str(formData, "startTime");
  const endTime = str(formData, "endTime");
  const slotDuration = Number(str(formData, "slotDuration"));
  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6 || !/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime) || slotDuration < 15) {
    redirect("/admin/availability?error=Invalid%20availability%20settings.");
  }
  await prisma.availability.upsert({
    where: { dayOfWeek },
    update: { startTime, endTime, slotDuration, active: checkbox(formData, "active") },
    create: { dayOfWeek, startTime, endTime, slotDuration, active: checkbox(formData, "active") }
  });
  revalidatePath("/book");
  redirect("/admin/availability?saved=1");
}

export async function addBlockedDate(formData: FormData) {
  await assertAdmin();
  const date = str(formData, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) redirect("/admin/availability?error=Invalid%20date.");
  await prisma.blockedDate.upsert({
    where: { date: toDateOnly(date) },
    update: { reason: optional(str(formData, "reason")) },
    create: { date: toDateOnly(date), reason: optional(str(formData, "reason")) }
  });
  revalidatePath("/book");
  redirect("/admin/availability?saved=1");
}

export async function deleteBlockedDate(formData: FormData) {
  await assertAdmin();
  await prisma.blockedDate.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/book");
}

export async function saveTestimonial(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const parsed = testimonialSchema.safeParse({
    name: str(formData, "name"), company: str(formData, "company"), role: str(formData, "role"),
    testimonial: str(formData, "testimonial"), published: checkbox(formData, "published"), sortOrder: str(formData, "sortOrder") || "0"
  });
  if (!parsed.success) redirect("/admin/testimonials?error=Please%20check%20the%20testimonial%20fields.");
  if (id) await prisma.testimonial.update({ where: { id }, data: parsed.data }); else await prisma.testimonial.create({ data: parsed.data });
  revalidatePath("/");
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(formData: FormData) {
  await assertAdmin();
  await prisma.testimonial.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/");
}

export async function saveSettings(formData: FormData) {
  await assertAdmin();
  const parsed = siteSettingsSchema.safeParse({
    name: str(formData, "name"), professionalTitle: str(formData, "professionalTitle"), heroHeading: str(formData, "heroHeading"),
    homepageIntroduction: str(formData, "homepageIntroduction"), aboutText: str(formData, "aboutText"),
    linkedinUrl: str(formData, "linkedinUrl"), githubUrl: str(formData, "githubUrl"), email: str(formData, "email"),
    phone: str(formData, "phone"), location: str(formData, "location"), resumeUrl: str(formData, "resumeUrl"),
    seoDescription: str(formData, "seoDescription"), bookingIntroduction: str(formData, "bookingIntroduction")
  });
  if (!parsed.success) redirect("/admin/settings?error=Please%20check%20the%20settings%20fields%20and%20URLs.");
  const data = {
    ...parsed.data,
    linkedinUrl: optional(parsed.data.linkedinUrl || ""), githubUrl: optional(parsed.data.githubUrl || ""),
    email: optional(parsed.data.email || ""), phone: optional(parsed.data.phone || ""),
    location: optional(parsed.data.location || ""), resumeUrl: optional(parsed.data.resumeUrl || "")
  };
  await prisma.siteSettings.upsert({ where: { id: "default" }, update: data, create: { id: "default", ...data } });
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

const RESUME_MAX_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

/**
 * Stores the CV in the database rather than on disk: Vercel's filesystem is read-only and
 * ephemeral, so an uploaded file would vanish on the next deploy. A single document is
 * small enough that this avoids taking a dependency on an object store.
 */
export async function uploadResume(formData: FormData) {
  await assertAdmin();
  const file = formData.get("resume");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/settings?error=Choose%20a%20resume%20file%20to%20upload.");
  }
  if (!RESUME_TYPES.has(file.type)) {
    redirect("/admin/settings?error=Resume%20must%20be%20a%20PDF%20or%20Word%20document.");
  }
  if (file.size > RESUME_MAX_BYTES) {
    redirect("/admin/settings?error=Resume%20must%20be%205%20MB%20or%20smaller.");
  }

  const data = Buffer.from(await file.arrayBuffer());
  const record = {
    filename: file.name || "resume.pdf",
    contentType: file.type,
    size: data.byteLength,
    data
  };
  await prisma.resumeFile.upsert({
    where: { id: "default" },
    update: record,
    create: { id: "default", ...record }
  });

  revalidatePath("/", "layout");
  revalidatePath("/resume");
  redirect("/admin/settings?saved=1");
}

export async function removeResume() {
  await assertAdmin();
  await prisma.resumeFile.deleteMany({ where: { id: "default" } });
  revalidatePath("/", "layout");
  revalidatePath("/resume");
  redirect("/admin/settings?saved=1");
}


/** "YYYY-MM" from a month input to the first of that month, in UTC. */
function monthToDate(value: string) {
  return new Date(`${value}-01T00:00:00.000Z`);
}

export async function saveExperience(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const parsed = experienceSchema.safeParse({
    role: str(formData, "role"),
    company: str(formData, "company"),
    location: str(formData, "location"),
    startDate: str(formData, "startDate"),
    endDate: str(formData, "endDate"),
    summary: str(formData, "summary"),
    published: checkbox(formData, "published"),
    sortOrder: str(formData, "sortOrder") || "0"
  });
  if (!parsed.success) {
    redirect(`/admin/experience?error=${encodeURIComponent(parsed.error.issues[0]?.message || "Please check the fields.")}`);
  }

  const { startDate, endDate, location, summary, ...rest } = parsed.data;
  if (endDate && endDate < startDate) {
    redirect("/admin/experience?error=The%20end%20date%20cannot%20be%20before%20the%20start%20date.");
  }

  const data = {
    ...rest,
    location: optional(location || ""),
    summary: optional(summary || ""),
    startDate: monthToDate(startDate),
    endDate: endDate ? monthToDate(endDate) : null,
    // One achievement per line; blank lines ignored.
    highlights: str(formData, "highlights").split("\n").map((line) => line.trim()).filter(Boolean)
  };

  if (id) await prisma.experience.update({ where: { id }, data });
  else await prisma.experience.create({ data });

  revalidatePath("/about");
  revalidatePath("/");
  redirect("/admin/experience?saved=1");
}

export async function deleteExperience(formData: FormData) {
  await assertAdmin();
  await prisma.experience.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/about");
  revalidatePath("/");
}

const PHOTO_MAX_BYTES = 4 * 1024 * 1024;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
// Keep in step with PROFILE_PHOTO_ID in lib/media.ts. A "use server" module may only
// export async functions, so the shared constant cannot be re-exported from here.
const PROFILE_PHOTO_ID = "profile-photo";

/**
 * Stores the profile photo in the database for the same reason as the CV: Vercel's
 * filesystem is read-only and ephemeral, so a file written to public/ would be lost on
 * the next deploy. Served back through /profile-photo.
 */
export async function uploadProfilePhoto(formData: FormData) {
  await assertAdmin();
  const file = formData.get("photo");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/settings?error=Choose%20an%20image%20to%20upload.");
  }
  if (!PHOTO_TYPES.has(file.type)) {
    redirect("/admin/settings?error=Photo%20must%20be%20a%20JPG%2C%20PNG%20or%20WebP%20image.");
  }
  if (file.size > PHOTO_MAX_BYTES) {
    redirect("/admin/settings?error=Photo%20must%20be%204%20MB%20or%20smaller.");
  }

  const data = Buffer.from(await file.arrayBuffer());
  const record = { filename: file.name || "profile.jpg", contentType: file.type, size: data.byteLength, data };
  await prisma.mediaAsset.upsert({
    where: { id: PROFILE_PHOTO_ID },
    update: record,
    create: { id: PROFILE_PHOTO_ID, ...record }
  });

  revalidatePath("/", "layout");
  revalidatePath("/profile-photo");
  redirect("/admin/settings?saved=1");
}

export async function removeProfilePhoto() {
  await assertAdmin();
  await prisma.mediaAsset.deleteMany({ where: { id: PROFILE_PHOTO_ID } });
  revalidatePath("/", "layout");
  revalidatePath("/profile-photo");
  redirect("/admin/settings?saved=1");
}
