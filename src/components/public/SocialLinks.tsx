import { siGithub } from "simple-icons";
import { LinkedInIcon } from "@/components/public/LinkedInIcon";

type Settings = {
  name: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  email: string | null;
  phone: string | null;
};

/**
 * Social and contact links, drawn from site settings.
 *
 * Rendered in `currentColor` rather than brand colours: these sit in outlined circles on a
 * black-and-white page, and a row of brand colours would fight the palette. The stack
 * badges are the place where brand colour carries meaning.
 *
 * LinkedIn keeps its own component — simple-icons no longer carries that mark.
 */
export function SocialLinks({
  settings,
  className = "flex gap-3"
}: {
  settings: Settings;
  className?: string;
}) {
  const items: { key: string; href: string; label: string; icon: React.ReactNode }[] = [];

  if (settings.linkedinUrl) {
    items.push({
      key: "linkedin",
      href: settings.linkedinUrl,
      label: `${settings.name} on LinkedIn (opens in a new tab)`,
      icon: <LinkedInIcon className="h-4 w-4" />
    });
  }

  if (settings.githubUrl) {
    items.push({
      key: "github",
      href: settings.githubUrl,
      label: `${settings.name} on GitHub (opens in a new tab)`,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true" focusable="false">
          <path d={siGithub.path} />
        </svg>
      )
    });
  }

  if (settings.email) {
    items.push({
      key: "email",
      href: `mailto:${settings.email}`,
      label: `Email ${settings.name}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
          <path d="m3 7 8.2 6a1.4 1.4 0 0 0 1.6 0L21 7" />
        </svg>
      )
    });
  }

  if (settings.phone) {
    items.push({
      key: "phone",
      href: `tel:${settings.phone.replace(/[^+\d]/g, "")}`,
      label: `Call ${settings.name}`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
        </svg>
      )
    });
  }

  if (items.length === 0) return null;

  return (
    <div className={className}>
      {items.map((item) => {
        const external = item.href.startsWith("http");
        return (
          <a
            key={item.key}
            href={item.href}
            className="social-dot"
            aria-label={item.label}
            {...(external && { target: "_blank", rel: "noreferrer noopener" })}
          >
            {item.icon}
          </a>
        );
      })}
    </div>
  );
}
