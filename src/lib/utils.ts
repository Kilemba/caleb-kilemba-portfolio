export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function splitCsv(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function toDateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function dateOnlyString(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function generateTimeSlots(startTime: string, endTime: string, durationMinutes: number) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  const slots: string[] = [];
  for (let minute = start; minute + durationMinutes <= end; minute += durationMinutes) {
    const hours = Math.floor(minute / 60).toString().padStart(2, "0");
    const minutes = (minute % 60).toString().padStart(2, "0");
    slots.push(`${hours}:${minutes}`);
  }
  return slots;
}

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Consultations are scheduled in Caleb's working timezone, not the visitor's. */
export const BUSINESS_TIMEZONE = "Africa/Nairobi";

function businessParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(new Date());
  return Object.fromEntries(parts.map((p) => [p.type, p.value])) as Record<string, string>;
}

/** Today's date in the business timezone, as YYYY-MM-DD. */
export function businessToday() {
  const p = businessParts();
  return `${p.year}-${p.month}-${p.day}`;
}

/** Current time in the business timezone, as HH:MM. */
export function businessTimeNow() {
  const p = businessParts();
  // Intl can render midnight as "24" in some environments.
  const hour = p.hour === "24" ? "00" : p.hour;
  return `${hour}:${p.minute}`;
}
