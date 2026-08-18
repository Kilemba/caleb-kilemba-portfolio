/**
 * Picks a line icon for a service card.
 *
 * Services are admin-editable, so the icon is matched on keywords in the title rather than
 * stored per record — a new service gets a sensible icon without a schema change or a
 * migration. `database` is the fallback.
 */
type IconKey = "cloud" | "transform" | "pipeline" | "warehouse" | "automation" | "analytics" | "database" | "consulting";

const KEYWORD_MAP: [RegExp, IconKey][] = [
  [/bigquery|cloud|gcp|google/i, "cloud"],
  [/transformation|digital|modernis|moderniz/i, "transform"],
  [/pipeline|etl|elt|ingest|stream/i, "pipeline"],
  [/warehouse|warehousing|lake/i, "warehouse"],
  [/automat|workflow|schedul/i, "automation"],
  [/analytic|intelligence|report|dashboard|bi\b/i, "analytics"],
  [/consult|advis|strategy|architect/i, "consulting"],
  [/database|sql|postgres|modelling|modeling/i, "database"]
];

function resolveIcon(title: string): IconKey {
  return KEYWORD_MAP.find(([pattern]) => pattern.test(title))?.[1] ?? "database";
}

const PATHS: Record<IconKey, React.ReactNode> = {
  cloud: (
    <>
      <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97 6 6 0 0 0-11.66-1.5A4.25 4.25 0 0 0 6.5 19z" />
      <path d="M12 12v4" />
    </>
  ),
  transform: (
    <>
      <path d="M4 7h11l-2.5-2.5M20 17H9l2.5 2.5" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="6" cy="17" r="2" />
    </>
  ),
  pipeline: (
    <>
      <path d="M3 8h5a3 3 0 0 1 3 3v2a3 3 0 0 0 3 3h5" />
      <circle cx="3" cy="8" r="1.6" />
      <circle cx="21" cy="16" r="1.6" />
      <path d="M14 5h7M14 5l2.5-2M14 5l2.5 2" />
    </>
  ),
  warehouse: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
    </>
  ),
  automation: (
    <>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v4h-4" />
      <path d="m10 12 1.8 1.8L15 10.5" />
    </>
  ),
  analytics: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <rect x="7.5" y="12" width="3" height="5" rx=".7" />
      <rect x="13" y="8" width="3" height="9" rx=".7" />
      <rect x="18" y="14" width="2.5" height="3" rx=".7" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" />
    </>
  ),
  consulting: (
    <>
      <path d="M12 3 3 8l9 5 9-5z" />
      <path d="M6.5 10.5V15c0 1.5 2.6 3 5.5 3s5.5-1.5 5.5-3v-4.5" />
      <path d="M21 8v6" />
    </>
  )
};

export function ServiceIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[resolveIcon(name)]}
    </svg>
  );
}
