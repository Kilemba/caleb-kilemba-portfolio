/**
 * Landing page copy that is also emitted as schema.org structured data.
 *
 * Search engines treat structured data that does not appear on the page as spam, so the
 * FAQ entries here are rendered visibly *and* serialised into JSON-LD from this one source.
 * Editing the copy in a single place keeps the two in step.
 */

export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: "What does a data engineer actually do for my business?",
    answer:
      "A data engineer makes your business information reliable and usable. In practice that means collecting data from the systems you already run, cleaning and joining it, and delivering it somewhere your team can read it — a warehouse, a dashboard or an automated report. The outcome is that people stop arguing about whose spreadsheet is right and start making decisions from one trusted set of numbers."
  },
  {
    question: "How does Google BigQuery help my business?",
    answer:
      "BigQuery is a cloud data warehouse that queries very large amounts of data in seconds without you running any servers. For most businesses the practical benefit is speed and cost: reporting that took hours of manual spreadsheet work runs automatically, and you pay for the queries you actually make rather than for hardware sitting idle. I design the warehouse, model the data and set cost controls so the bill stays predictable."
  },
  {
    question: "We only have spreadsheets right now. Is that a problem?",
    answer:
      "No, and it is the most common place I start. Spreadsheets are usually a sign that the business logic already exists — it is just trapped in manual steps. I map what your team does by hand, move that logic into an automated pipeline, and keep the outputs in a familiar format so nobody has to relearn their job on day one."
  },
  {
    question: "How long does a typical data project take?",
    answer:
      "It depends on how many systems are involved, but most engagements start with a short discovery phase of one to two weeks so the scope is based on your actual data rather than a guess. A focused piece of work such as automating one report is usually measured in weeks; a full warehouse and reporting platform is measured in months. You get a written plan with milestones before any build begins."
  },
  {
    question: "How do you price your work?",
    answer:
      "Pricing follows the scope agreed during discovery, so you are quoted against a defined deliverable rather than an open-ended hourly count. Smaller automation work can be fixed price. Longer platform builds are usually staged by milestone so you can review progress and stop at a natural boundary if priorities change."
  },
  {
    question: "Will I be locked into you or a specific vendor?",
    answer:
      "No. I build on standard, portable tooling — SQL, Python, dbt and mainstream cloud warehouses — and you own the code, the documentation and the cloud account. Everything is handed over with notes so your own team or another engineer can pick it up. Lock-in is a business risk, not a retention strategy."
  },
  {
    question: "Do you work remotely with international clients?",
    answer:
      "Yes. The work is delivered remotely with scheduled check-ins, shared documentation and access to the same repositories and dashboards your team uses. You can book a consultation directly through this site to talk through your requirements and timezone overlap."
  }
];

export type Step = { title: string; detail: string };

export const PROCESS: Step[] = [
  {
    title: "Discovery call",
    detail:
      "We talk through the business problem before any tooling is chosen. I want to know what decision you are trying to make and what currently gets in the way."
  },
  {
    title: "Data audit and plan",
    detail:
      "I review the systems and data you already have, then write up a practical architecture with scope, milestones and costs. You approve the plan before the build starts."
  },
  {
    title: "Build and automate",
    detail:
      "Pipelines, warehouse and reporting get built in reviewable stages, so you see working output early rather than waiting for one large delivery at the end."
  },
  {
    title: "Handover and support",
    detail:
      "You receive documentation, the code and full ownership of the cloud account, plus a walkthrough so your team can run and extend the system confidently."
  }
];

export type Differentiator = { title: string; detail: string };

export const DIFFERENTIATORS: Differentiator[] = [
  {
    title: "The business problem comes first",
    detail:
      "Tools are chosen after the problem is understood, not before. If a scheduled query solves it, you will not be sold a streaming platform."
  },
  {
    title: "Costs are designed in",
    detail:
      "Cloud warehouses are easy to make expensive. Partitioning, scheduling and query design are treated as part of the build, so the monthly bill stays predictable."
  },
  {
    title: "You own everything",
    detail:
      "Code, documentation and cloud accounts are yours. The work is handed over so your team, or any other engineer, can maintain it without me."
  },
  {
    title: "Plain language, not jargon",
    detail:
      "You get explanations that make sense to whoever signs off the budget, alongside the technical detail your developers need."
  }
];

/** Focus areas advertised to search engines as an offer catalogue. */
export const SERVICE_KEYWORDS = [
  "data engineer",
  "data engineering services",
  "BigQuery consultant",
  "Google BigQuery",
  "digital transformation",
  "data pipeline development",
  "ETL developer",
  "cloud data warehouse",
  "analytics engineering",
  "analytics consultant",
  "business intelligence consultant",
  "BI dashboard development",
  "semantic layer",
  "KPI reporting",
  "data automation",
  "dbt",
  "dbt consultant",
  "Looker",
  "Looker Studio",
  "Tableau",
  "Power BI",
  "freelance data engineer"
];

export type Stat = { value: string; label: string };

/**
 * Headline figures for the hero band.
 *
 * Every one of these is taken from Caleb's CV — years of experience, daily volume
 * processed, analytic models supported, and the measured latency improvement. Deliberately
 * NOT the usual "happy clients / awards won" counters, which would be invented. If you
 * want to change these, keep the rule: only numbers you could evidence if asked.
 */
export const STATS: Stat[] = [
  { value: "5+", label: "Years in data engineering" },
  { value: "500GB+", label: "Processed per day" },
  { value: "100+", label: "Analytic models supported" },
  { value: "40%", label: "Pipeline latency removed" }
];

export type StackGroup = { title: string; note: string; tools: string[] };

/**
 * The data stack, grouped by what each tool is for.
 *
 * Entries are tools rather than concepts, because each one renders with its brand mark —
 * "data modelling" has no logo and would show as a monogram next to real ones. The
 * practices that are not products are described in `note` instead.
 *
 * Everything here appears in the CV. Add a tool by putting its name in a group; if
 * `simple-icons` carries the brand it is picked up automatically, otherwise it falls back
 * to a monogram.
 */
export const STACK_GROUPS: StackGroup[] = [
  {
    title: "Warehouses & databases",
    note: "Designing the models and access controls, not just the storage.",
    tools: ["Google BigQuery", "Snowflake", "PostgreSQL", "MySQL"]
  },
  {
    title: "Pipelines & transformation",
    note: "ETL and ELT built as tested, documented, reviewable code.",
    tools: ["Apache Airflow", "dbt", "Python", "pandas"]
  },
  {
    title: "Streaming & big data",
    note: "Batch and real-time processing where the volume justifies it.",
    tools: ["Apache Kafka", "Apache Spark", "PySpark", "Google Cloud Platform"]
  },
  {
    title: "Analytics & BI",
    note: "Semantic layers and dashboards people actually use.",
    tools: ["Looker", "Tableau", "Power BI", "Looker Studio", "Grafana"]
  },
  {
    title: "Platform & delivery",
    note: "Infrastructure as code, containers and CI/CD around the data.",
    tools: ["Docker", "Kubernetes", "Terraform", "Git", "FastAPI"]
  }
];

/** Practices that are not products, so they carry no logo. */
export const STACK_PRACTICES = [
  "Dimensional and semantic data modelling",
  "PHI / PII protection and HIPAA controls",
  "Role-based access and column-level masking",
  "Data lineage, testing and SLA monitoring"
];
