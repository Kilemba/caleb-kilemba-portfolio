import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { ProjectCard } from "@/components/public/ProjectCard";

export default async function HomePage() {
  const [settings, technologies, services, projects, testimonials, posts] = await Promise.all([
    getSiteSettings(),
    prisma.technology.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take: 10 }),
    prisma.service.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { title: "asc" }], include: { technologies: true }, take: 6 }),
    prisma.project.findMany({ where: { published: true, featured: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], include: { technologies: true }, take: 3 }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 6 }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { publishedAt: "desc" }], take: 3 })
  ]);

  return (
    <>
      <section className="section-space overflow-hidden">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="eyebrow">{settings.professionalTitle}</p>
            <h1 className="h1 mt-5 max-w-5xl">{settings.heroHeading}</h1>
            <p className="lead mt-7 max-w-3xl">{settings.homepageIntroduction}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn btn-primary">Explore My Solutions</Link>
              <Link href="/book" className="btn btn-secondary">Book a Consultation</Link>
              {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">LinkedIn</a>}
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#e1e7ec] bg-[#f7f9fb] p-6 sm:p-10">
            <p className="eyebrow">Business-first data engineering</p>
            <div className="mt-8 space-y-6">
              {["Reliable data pipelines", "Automated reporting systems", "Analytics-ready data platforms", "Practical architecture & consulting"].map((item, i) => (
                <div key={item} className="flex gap-4 border-b border-[#e1e7ec] pb-5 last:border-0">
                  <span className="font-extrabold text-[#0f766e]">0{i + 1}</span><p className="font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="surface border-y border-[#e1e7ec] py-8">
        <div className="container-site">
          <p className="eyebrow mb-5">Technologies</p>
          <div className="flex flex-wrap gap-3">{technologies.map((tech) => <span key={tech.id} className="rounded-full border border-[#e1e7ec] bg-white px-4 py-2 text-sm font-bold">{tech.name}</span>)}</div>
        </div>
      </section>

      <section className="section-space" id="about">
        <div className="container-site grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="eyebrow">About</p><h2 className="h2 mt-4">Engineering data around the business problem.</h2></div>
          <div>
            {settings.aboutText.split("\n").filter(Boolean).map((p) => <p key={p} className="lead mb-5">{p}</p>)}
            {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-secondary mt-3">Connect with me on LinkedIn</a>}
          </div>
        </div>
      </section>

      <section className="section-space surface" id="services">
        <div className="container-site">
          <p className="eyebrow">Services</p><h2 className="h2 mt-4 max-w-3xl">Data solutions designed for operational and decision-making needs.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => <article key={service.id} className="card p-6"><h3 className="text-xl font-extrabold">{service.title}</h3><p className="muted mt-3 leading-7">{service.description}</p><div className="mt-5 flex flex-wrap gap-2">{service.technologies.map((t) => <span key={t.id} className="badge">{t.name}</span>)}</div></article>)}
          </div>
          <Link href="/services" className="btn btn-secondary mt-8">View all services</Link>
        </div>
      </section>

      <section className="section-space">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">Selected solutions</p><h2 className="h2 mt-4">Projects framed as business outcomes.</h2></div><Link href="/projects" className="font-bold text-[#0f766e]">All projects →</Link></div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
        </div>
      </section>

      {posts.length > 0 && <section className="section-space surface"><div className="container-site"><p className="eyebrow">Technical blog</p><h2 className="h2 mt-4">Writing about practical data engineering.</h2><div className="mt-9 grid gap-5 md:grid-cols-3">{posts.map((post) => <article key={post.id} className="card p-6"><span className="badge">{post.category}</span><h3 className="mt-4 text-xl font-extrabold">{post.title}</h3><p className="muted mt-3 leading-7">{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="mt-5 inline-flex font-bold text-[#0f766e]">Read article →</Link></article>)}</div></div></section>}

      {testimonials.length > 0 && <section className="section-space"><div className="container-site"><p className="eyebrow">Testimonials</p><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{testimonials.map((item) => <blockquote key={item.id} className="card p-6"><p className="leading-8">“{item.testimonial}”</p><footer className="mt-5"><strong>{item.name}</strong><p className="muted text-sm">{item.role}, {item.company}</p></footer></blockquote>)}</div></div></section>}

      <section className="section-space bg-[#172033] text-white"><div className="container-site grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="eyebrow !text-[#7dd3ca]">Work with Caleb</p><h2 className="h2 mt-4 max-w-3xl">Have a data problem that needs a practical solution?</h2></div><Link href="/book" className="btn bg-white text-[#172033]">Book a Consultation</Link></div></section>
    </>
  );
}
