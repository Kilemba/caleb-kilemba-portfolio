"use client";

import { useEffect } from "react";
import "./globals.css";

// Replaces the root layout entirely, so it must render its own <html> and <body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <section className="section-space">
          <div className="container-site max-w-2xl">
            <p className="eyebrow">Something went wrong</p>
            <h1 className="h2 mt-5">The site could not be loaded.</h1>
            <p className="muted mt-4">An unexpected error stopped the page from rendering. Please try again.</p>
            <button onClick={reset} className="btn btn-primary mt-7">Try again</button>
            {error.digest && <p className="muted mt-6 text-xs">Reference: {error.digest}</p>}
          </div>
        </section>
      </body>
    </html>
  );
}
