import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { TESTIMONIALS } from "../../../content/testimonials";

/**
 * Quotes from the testimonials file and from the admin panel, shown together.
 *
 * Renders nothing when there are none, so the About page never shows an empty
 * "what clients say" heading with no quotes under it.
 */
export async function Testimonials() {
  const fromFile = TESTIMONIALS.filter((t) => t.published).map((t) => ({
    key: `file-${t.name}-${t.company}`,
    quote: t.quote,
    name: t.name,
    role: t.role,
    company: t.company,
    url: t.url
  }));

  const fromCms = (
    await safeQuery(
      "testimonials",
      () =>
        prisma.testimonial.findMany({
          where: { published: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
        }),
      []
    )
  ).map((t) => ({
    key: `cms-${t.id}`,
    quote: t.testimonial,
    name: t.name,
    role: t.role,
    company: t.company,
    url: undefined as string | undefined
  }));

  const testimonials = [...fromFile, ...fromCms];
  if (testimonials.length === 0) return null;

  return (
    <section className="mt-16">
      <p className="eyebrow">What clients say</p>
      <h2 className="h2 mt-4 text-3xl">Feedback from people I have worked with.</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {testimonials.map((item) => (
          <blockquote key={item.key} className="card p-6">
            <p className="leading-8">“{item.quote}”</p>
            <footer className="mt-5">
              <strong>{item.name}</strong>
              <p className="muted text-sm">
                {item.role}
                {item.company && `, `}
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer noopener" className="hover:text-[#12875a]">
                    {item.company}
                  </a>
                ) : (
                  item.company
                )}
              </p>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
