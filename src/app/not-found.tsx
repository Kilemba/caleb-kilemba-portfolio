import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-space">
      <div className="container-site max-w-2xl">
        <p className="eyebrow">404</p>
        <h1 className="h2 mt-5">That page does not exist.</h1>
        <p className="muted mt-4">The page you asked for may have been moved or renamed.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/projects" className="btn btn-secondary">View projects</Link>
        </div>
      </div>
    </section>
  );
}
