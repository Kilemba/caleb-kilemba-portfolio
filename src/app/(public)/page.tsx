import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { safeQuery } from "@/lib/safe-query";
import { ProjectCard } from "@/components/public/ProjectCard";
import { StructuredData } from "@/components/public/StructuredData";
import { ServiceIcon } from "@/components/public/ServiceIcon";
import { LinkedInIcon } from "@/components/public/LinkedInIcon";
import { DIFFERENTIATORS, FAQS, PROCESS, SERVICE_KEYWORDS } from "@/lib/landing-content";

export const metadata: Metadata = {
  title: "Data Engineer & BigQuery Consultant",
  description:
    "Data engineer and BigQuery consultant. I build reliable data pipelines, cloud data warehouses and automated reporting that turn scattered business data into decisions you can trust.",
  keywords: SERVICE_KEYWORDS,
  alternates: { canonical: "/" }
};

/** Highlights the closing words of the hero heading without hard-coding the copy. */
function splitHeading(heading: string, accentWords = 3) {
  const words = heading.trim().split(/\s+/);
  if (words.length <= accentWords) return { lead: "", accent: heading };
  return {
    lead: words.slice(0, -accentWords).join(" "),
    accent: words.slice(-accentWords).join(" ")
  };
}

export default async function HomePage() {
  const [settings, technologies, services, projects, testimonials, posts] = await Promise.all([
    getSiteSettings(),
    safeQuery("technologies", () => prisma.technology.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take: 12 }), []),
    safeQuery("services", () => prisma.service.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { title: "asc" }], include: { technologies: true }, take: 6 }), []),
    safeQuery("projects", () => prisma.project.findMany({ where: { published: true, featured: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { technologies: true }, take: 3 }), []),
    safeQuery("testimonials", () => prisma.testimonial.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 3 }), []),
    safeQuery("posts", () => prisma.blogPost.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { publishedAt: "desc" }], take: 3 }), [])
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { lead, accent } = splitHeading(settings.heroHeading);

  return (
    <>
      <StructuredData
        settings={settings}
        services={services.map((s) => ({ title: s.title, description: s.description, slug: s.slug }))}
        baseUrl={baseUrl}
      />

      {/* ---------- Hero ---------- */}
      <section className="hero-wrap section-space">
        <div className="blob blob-a" aria-hidden="true" />
        <div className="blob blob-b" aria-hidden="true" />
        <div className="container-site relative grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#bfe8e2] bg-white px-3.5 py-1.5 text-sm font-bold text-[#0b5f59]">
              <span className="h-2 w-2 rounded-full bg-[#0f766e]" aria-hidden="true" />
              Available for data engineering work
            </p>
            <h1 className="h1 mt-6 max-w-4xl">
              {lead}{" "}
              <span className="accent-text underline-sweep">{accent}</span>
            </h1>
            <p className="lead mt-7 max-w-2xl">{settings.homepageIntroduction}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/book" className="btn btn-primary">Book a free consultation</Link>
              <Link href="/projects" className="btn btn-secondary">See my work</Link>
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-secondary"
                  aria-label={`Connect with ${settings.name} on LinkedIn`}
                >
                  <LinkedInIcon className="h-4 w-4" />
                  Connect on LinkedIn
                </a>
              )}
            </div>

            <p className="muted mt-7 text-sm">
              Specialising in <strong className="text-[#172033]">Google BigQuery</strong>, cloud data warehousing
              and digital transformation for growing businesses.
            </p>
          </div>

          {/* Visual: what the work actually produces, rather than a stock image. */}
          <div className="relative">
            <div className="float-card p-6 sm:p-8">
              <p className="eyebrow">How your data flows</p>
              <ol className="mt-6 space-y-4">
                {[
                  { label: "Your systems", note: "Apps, databases, spreadsheets, APIs" },
                  { label: "Automated pipelines", note: "Cleaned, joined and scheduled" },
                  { label: "BigQuery warehouse", note: "One trusted source of numbers" },
                  { label: "Dashboards and reports", note: "Answers your team can act on" }
                ].map((stage, i, all) => (
                  <li key={stage.label} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="step-num">{i + 1}</span>
                      {i < all.length - 1 && <span className="mt-1 w-px flex-1 bg-[#cbd6dc]" aria-hidden="true" />}
                    </div>
                    <div className="pb-1">
                      <p className="font-extrabold">{stage.label}</p>
                      <p className="muted text-sm">{stage.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="float-card absolute -bottom-5 -left-3 hidden items-center gap-3 px-4 py-3 sm:flex lg:-left-8">
              <span className="icon-tile h-10 w-10"><ServiceIcon name="BigQuery for Business" className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-extrabold">BigQuery certified approach</p>
                <p className="muted text-xs">Cost-controlled by design</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Technologies ---------- */}
      {technologies.length > 0 && (
        <section className="surface border-y border-[#e1e7ec] py-9">
          <div className="container-site">
            <p className="eyebrow mb-5">Tools I build with</p>
            <ul className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <li key={tech.id} className="rounded-full border border-[#e1e7ec] bg-white px-4 py-2 text-sm font-bold">
                  {tech.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Services ---------- */}
      <section className="section-space" id="services">
        <div className="container-site">
          <p className="eyebrow">What I do</p>
          <h2 className="h2 mt-4 max-w-3xl">
            Data engineering services built around <span className="accent-text">business outcomes</span>.
          </h2>
          <p className="lead mt-5 max-w-2xl">
            From a single automated report to a full cloud data platform, every engagement starts with the
            decision you are trying to make.
          </p>

          <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="card flex flex-col p-7" id={service.slug}>
                <span className="icon-tile"><ServiceIcon name={service.title} className="h-6 w-6" /></span>
                <h3 className="mt-5 text-xl font-extrabold">{service.title}</h3>
                <p className="muted mt-3 flex-1 leading-7">{service.description}</p>
                {service.technologies.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.technologies.map((t) => <li key={t.id} className="badge">{t.name}</li>)}
                  </ul>
                )}
              </article>
            ))}
          </div>

          <Link href="/services" className="btn btn-secondary mt-9">View all services</Link>
        </div>
      </section>

      {/* ---------- Why hire me ---------- */}
      <section className="section-space surface" id="why-me">
        <div className="container-site grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Why work with me</p>
            <h2 className="h2 mt-4">Why hire me for your project?</h2>
            <p className="lead mt-5">
              Plenty of engineers can move data. The difference is whether the result is something your
              business can rely on, afford and maintain after the project ends.
            </p>
            <Link href="/about" className="btn btn-secondary mt-7">More about how I work</Link>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {DIFFERENTIATORS.map((item) => (
              <li key={item.title} className="card p-6">
                <h3 className="text-lg font-extrabold">{item.title}</h3>
                <p className="muted mt-3 leading-7">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="section-space" id="process">
        <div className="container-site">
          <p className="eyebrow">How we will work together</p>
          <h2 className="h2 mt-4 max-w-3xl">A clear process, so you always know what happens next.</h2>
          <ol className="mt-11 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="card p-6">
                <span className="step-num">{i + 1}</span>
                <h3 className="mt-4 text-lg font-extrabold">{step.title}</h3>
                <p className="muted mt-3 leading-7">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Projects ---------- */}
      {projects.length > 0 && (
        <section className="section-space surface">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 className="h2 mt-4">Projects framed as business outcomes.</h2>
              </div>
              <Link href="/projects" className="font-bold text-[#0f766e]">All projects →</Link>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Testimonials ---------- */}
      {testimonials.length > 0 && (
        <section className="section-space">
          <div className="container-site">
            <p className="eyebrow">What people say</p>
            <h2 className="h2 mt-4">Feedback from people I have worked with.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item) => (
                <blockquote key={item.id} className="card p-7">
                  <p className="leading-8">“{item.testimonial}”</p>
                  <footer className="mt-5">
                    <strong>{item.name}</strong>
                    <p className="muted text-sm">{item.role}, {item.company}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- FAQ (also emitted as FAQPage structured data) ---------- */}
      <section className="section-space surface" id="faq">
        <div className="container-site grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Questions</p>
            <h2 className="h2 mt-4">Getting to know how I work.</h2>
            <p className="lead mt-5">
              The things clients usually ask before we start. If yours is not here, ask it directly on a
              consultation call.
            </p>
            <Link href="/contact" className="btn btn-secondary mt-7">Ask a question</Link>
          </div>
          <div>
            {FAQS.map((faq) => (
              <details key={faq.question} className="faq">
                <summary>{faq.question}</summary>
                <p className="faq-body">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Blog ---------- */}
      {posts.length > 0 && (
        <section className="section-space">
          <div className="container-site">
            <p className="eyebrow">Technical blog</p>
            <h2 className="h2 mt-4">Writing about practical data engineering.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="card p-6">
                  <span className="badge">{post.category}</span>
                  <h3 className="mt-4 text-xl font-extrabold">{post.title}</h3>
                  <p className="muted mt-3 leading-7">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex font-bold text-[#0f766e]">Read article →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Closing CTA ---------- */}
      <section className="section-space bg-[#0d1626] text-white">
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow !text-[#7dd3ca]">Work with {settings.name}</p>
            <h2 className="h2 mt-4 max-w-3xl">Have a data problem that needs a practical solution?</h2>
            <p className="mt-5 max-w-2xl text-[#c7d2dc] leading-8">
              Book a free consultation and we will talk through your systems, the reporting you need and
              whether BigQuery is the right fit — before you commit to anything.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/book" className="btn bg-white text-[#0d1626]">Book a consultation</Link>
            {settings.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn border-white/30 bg-transparent text-white hover:bg-white/10"
                aria-label={`Connect with ${settings.name} on LinkedIn`}
              >
                <LinkedInIcon className="h-4 w-4" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
