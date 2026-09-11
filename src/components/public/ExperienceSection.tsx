import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";

/** "Nov 2023", or "Present" for an open-ended role. */
function monthLabel(value: Date | null) {
  if (!value) return "Present";
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }).format(value);
}

/**
 * Career history, newest first, editable at /admin/experience.
 *
 * Renders nothing when there are no published entries, so the About page never shows an
 * empty "Experience" heading.
 */
export async function ExperienceSection() {
  const roles = await safeQuery(
    "experience",
    () =>
      prisma.experience.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }]
      }),
    []
  );

  if (roles.length === 0) return null;

  return (
    <section className="mt-16" id="experience">
      <p className="eyebrow">Experience</p>
      <h2 className="h2 mt-4 text-3xl">Where I have done this work.</h2>

      <ol className="mt-9 space-y-5">
        {roles.map((role) => (
          <li key={role.id} className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <div>
                <h3 className="text-xl font-extrabold">{role.role}</h3>
                <p className="muted mt-1 font-semibold">
                  {role.company}
                  {role.location && ` · ${role.location}`}
                </p>
              </div>
              <p className="muted text-sm font-bold whitespace-nowrap">
                <time dateTime={role.startDate.toISOString()}>{monthLabel(role.startDate)}</time>
                {" – "}
                {role.endDate ? (
                  <time dateTime={role.endDate.toISOString()}>{monthLabel(role.endDate)}</time>
                ) : (
                  <span className="accent-text">Present</span>
                )}
              </p>
            </div>

            {role.summary && <p className="lead mt-4 text-base">{role.summary}</p>}

            {role.highlights.length > 0 && (
              <ul className="muted mt-5 space-y-2.5 text-sm leading-7">
                {role.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#12875a]" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
