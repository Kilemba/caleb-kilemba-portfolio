"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[page error]", error);
  }, [error]);

  return (
    <section className="section-space">
      <div className="container-site max-w-2xl">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="h2 mt-5">This page could not be loaded.</h1>
        <p className="muted mt-4">
          The site had trouble reaching its data just now. This is usually temporary, so trying again
          normally resolves it.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={reset} className="btn btn-primary">Try again</button>
          <Link href="/" className="btn btn-secondary">Back to home</Link>
        </div>
        {error.digest && <p className="muted mt-6 text-xs">Reference: {error.digest}</p>}
      </div>
    </section>
  );
}
