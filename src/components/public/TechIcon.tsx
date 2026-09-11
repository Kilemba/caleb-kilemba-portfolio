import {
  siApacheairflow,
  siApachekafka,
  siApachespark,
  siDocker,
  siElasticsearch,
  siFastapi,
  siFlask,
  siGit,
  siGooglebigquery,
  siGooglecloud,
  siGrafana,
  siKubernetes,
  siLooker,
  siMysql,
  siPandas,
  siPostgresql,
  siPython,
  siSnowflake,
  siTerraform
} from "simple-icons";

type Icon = { title: string; hex: string; path: string };

/**
 * Brand marks for the data stack.
 *
 * Icons are imported by name from `simple-icons` rather than looked up dynamically, so the
 * bundler only includes the ones actually used. Everything renders on the server, so only
 * the resulting path ends up in the HTML.
 *
 * dbt, Tableau and Power BI are deliberately absent — those brands are no longer carried by
 * simple-icons, and an approximation drawn from memory would be visibly wrong. Those fall
 * through to a monogram, which reads as a considered choice rather than a broken logo.
 */
const ICONS: Record<string, Icon> = {
  "google bigquery": siGooglebigquery,
  bigquery: siGooglebigquery,
  "google cloud platform": siGooglecloud,
  "google cloud": siGooglecloud,
  snowflake: siSnowflake,
  postgresql: siPostgresql,
  mysql: siMysql,
  python: siPython,
  pandas: siPandas,
  "apache airflow": siApacheairflow,
  airflow: siApacheairflow,
  "apache kafka": siApachekafka,
  kafka: siApachekafka,
  "apache spark": siApachespark,
  pyspark: siApachespark,
  "spark sql": siApachespark,
  looker: siLooker,
  grafana: siGrafana,
  docker: siDocker,
  kubernetes: siKubernetes,
  terraform: siTerraform,
  git: siGit,
  fastapi: siFastapi,
  flask: siFlask,
  elasticsearch: siElasticsearch
};

/**
 * Monograms for the tools with no available brand mark. Set explicitly rather than derived,
 * because initials alone produce awkward results — "Tableau" would shorten to "Tab".
 */
const MONOGRAMS: Record<string, string> = {
  tableau: "Tb",
  "power bi": "PB",
  "looker studio": "LS",
  dbt: "dbt",
  sql: "SQL",
  apis: "API",
  "data modelling": "DM",
  "cloud technologies": "CT"
};

/** Short, readable monogram for tools without an available brand mark. */
function monogram(name: string) {
  const explicit = MONOGRAMS[name.trim().toLowerCase()];
  if (explicit) return explicit;

  const cleaned = name.replace(/[^A-Za-z0-9 ]/g, " ").trim();
  const words = cleaned.split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 3);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function TechIcon({ name, className = "h-7 w-7" }: { name: string; className?: string }) {
  const icon = ICONS[name.trim().toLowerCase()];

  if (icon) {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill={`#${icon.hex}`}
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <path d={icon.path} />
      </svg>
    );
  }

  return (
    <span
      className={`${className} inline-flex items-center justify-center rounded-md bg-[#e6f4ec] text-[0.6rem] font-extrabold tracking-tight text-[#0c6845]`}
      aria-hidden="true"
    >
      {monogram(name)}
    </span>
  );
}
