import Link from "next/link";
import { getResumeMeta } from "@/lib/resume";
import { getSiteSettings } from "@/lib/settings";

/**
 * Renders nothing until a CV exists, so the page never shows a download button that 404s.
 * An uploaded file wins; otherwise the Resume URL from site settings is used. Either way
 * the link points at /resume, which resolves whichever is available.
 */
export async function ResumeSection() {
  const [settings, resume] = await Promise.all([getSiteSettings(), getResumeMeta()]);

  if (!resume.available) return null;

  const sizeLabel = resume.size ? `${Math.max(1, Math.round(resume.size / 1024))} KB` : null;
  const updatedLabel = resume.updatedAt
    ? resume.updatedAt.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  return (
    <section className="section-space" id="resume">
      <div className="container-site">
        <div className="card grid gap-8 p-8 sm:p-11 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <p className="eyebrow">Resume</p>
            <h2 className="h2 mt-4">Want the full background?</h2>
            <p className="lead mt-5">
              Download my CV for the detail that does not fit on a landing page — the roles, the
              platforms I have built and the tools I work with day to day.
            </p>
            <ul className="muted mt-6 grid gap-2 text-sm sm:grid-cols-2">
              {[
                "Experience and roles",
                "Technical skills and tooling",
                "Projects and outcomes",
                "Education and certifications"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-0.5 font-bold text-[#12875a]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-[#f7f9fb] p-6 text-center">
            <p className="font-extrabold">{settings.name}</p>
            <p className="muted mt-1 text-sm">{settings.professionalTitle}</p>
            {(sizeLabel || updatedLabel) && (
              <p className="muted mt-4 text-xs">
                {[updatedLabel && `Updated ${updatedLabel}`, sizeLabel].filter(Boolean).join(" · ")}
              </p>
            )}
            <a href="/resume" className="btn btn-primary mt-5 w-full" download>
              Download resume
            </a>
            <Link href="/contact" className="btn btn-secondary mt-3 w-full">Ask a question</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
