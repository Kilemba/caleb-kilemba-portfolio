import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url()]).optional();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  company: z.string().trim().min(2).max(150),
  phone: z.string().trim().max(50).optional(),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000)
});

export const bookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  company: z.string().trim().min(2).max(150),
  serviceId: z.string().min(1),
  projectDescription: z.string().trim().min(20).max(5000),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/)
});

export const projectSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(3).max(180).regex(/^[a-z0-9-]+$/),
  category: z.string().trim().min(2).max(100),
  summary: z.string().trim().min(20).max(1000),
  businessProblem: z.string().trim().min(20),
  solution: z.string().trim().min(20),
  businessImpact: z.string().trim().min(20),
  impactMetric: z.string().trim().max(250).optional(),
  architecture: z.string().trim().min(10),
  caseStudy: z.string().trim().min(20),
  coverImage: optionalUrl,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  sortOrder: z.coerce.number().int().min(0),
  featured: z.boolean(),
  published: z.boolean()
});

export const serviceSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().min(3).max(160).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().min(20),
  sortOrder: z.coerce.number().int().min(0),
  published: z.boolean()
});

export const blogSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().trim().min(20).max(1000),
  content: z.string(),
  coverImage: optionalUrl,
  category: z.string().trim().min(2).max(100),
  published: z.boolean(),
  featured: z.boolean(),
  devToUrl: optionalUrl,
  canonicalUrl: optionalUrl
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(150),
  role: z.string().trim().min(2).max(150),
  testimonial: z.string().trim().min(10).max(2000),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0)
});

export const siteSettingsSchema = z.object({
  name: z.string().trim().min(2).max(120),
  professionalTitle: z.string().trim().min(3).max(180),
  heroHeading: z.string().trim().min(10).max(300),
  homepageIntroduction: z.string().trim().min(20).max(2000),
  aboutText: z.string().trim().min(20).max(10000),
  linkedinUrl: z.union([z.literal(""), z.string().url()]).optional(),
  githubUrl: z.union([z.literal(""), z.string().url()]).optional(),
  email: z.union([z.literal(""), z.string().email()]).optional(),
  phone: z.string().trim().max(80).optional(),
  location: z.string().trim().max(180).optional(),
  resumeUrl: z.union([z.literal(""), z.string().url()]).optional(),
  seoDescription: z.string().trim().min(20).max(320),
  bookingIntroduction: z.string().trim().min(20).max(2000)
});
