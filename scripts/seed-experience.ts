import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { pgConnectionConfig } from "../src/lib/db-config";

/**
 * Seeds career history from Caleb's CV. Idempotent: matched on role + company, so
 * re-running refreshes the entries without duplicating them. Edits made in
 * /admin/experience are overwritten by a re-run, so prefer the admin panel after seeding.
 */
const EXPERIENCE = [
  {
    role: "Data Engineer — R&D & Data",
    company: "Data Science East Africa",
    location: "Nairobi, Kenya",
    startDate: new Date("2023-11-01T00:00:00.000Z"),
    endDate: null,
    summary:
      "Building secure, cloud-native data platforms for fintech and ML workloads on GCP and Snowflake.",
    highlights: [
      "Architected a secure Snowflake data warehouse with a complementary data lake supporting 100+ analytic models, with PHI/PII protections and HIPAA compliance controls",
      "Built scalable APIs in Python (FastAPI) for data services, integrating with a microservices architecture to enable real-time data access for fintech analytics",
      "Optimised PySpark and Python ETL/ELT pipelines processing 500GB+/day on GCP, cutting end-to-end latency by 40% and compute costs by 20%",
      "Implemented dbt incremental models with automated testing and documentation, providing data lineage, contract enforcement and auditability for regulatory reporting",
      "Developed Airflow DAGs orchestrating cross-platform workflows across PostgreSQL, MySQL, Kafka and BigQuery with CI/CD automation to meet strict SLAs",
      "Engineered streaming ingestion with Kafka and PySpark Structured Streaming on GCP Dataflow for low-latency telemetry analytics",
      "Created automated data quality and monitoring frameworks using SQL tests, custom Python checks and BI alerts, sustaining 99.9% data reliability",
      "Migrated legacy ETL from SQL Server and Oracle to a cloud-native BigQuery architecture with zero data loss and 99.9% integrity validation",
      "Tuned complex SQL across BigQuery and the warehouse, reducing dashboard run-times by 30% for Looker and Tableau consumers",
      "Designed role-based access control and column-level masking for sensitive financial data",
      "Built feature stores and external data integrations supporting ML workloads for predictive analytics"
    ]
  },
  {
    role: "Data Engineer — Automation & Data",
    company: "WingFarm Organization",
    location: "Nairobi, Kenya",
    startDate: new Date("2022-04-01T00:00:00.000Z"),
    endDate: new Date("2023-11-01T00:00:00.000Z"),
    summary:
      "Converted monolithic batch jobs into modular, tested, continuously deployed data pipelines.",
    highlights: [
      "Engineered modular ETL/ELT pipelines with Python (PySpark, Pandas) and dbt, turning monolithic jobs into reusable, testable transformation models with full CI/CD integration",
      "Implemented CI/CD pipelines with GitHub Actions and automated testing, enabling reproducible deployments and rapid rollbacks for production data systems",
      "Optimised Spark jobs and GCP Dataproc cluster configuration, improving resource utilisation by 75% and reducing cost for high-volume batch workloads",
      "Integrated heterogeneous sources (PostgreSQL, MySQL, BigQuery, legacy systems) into a centralised GCP data lake, harmonising schemas for unified analytics",
      "Collaborated with product managers, data scientists and DevOps engineers to deliver data solutions in a fast-paced environment",
      "Improved BI delivery in Tableau and PowerBI by designing semantic layers and optimising data models and query patterns",
      "Managed sensitive data with tokenisation, encryption and column-level masking to maintain regulatory compliance",
      "Developed data quality checks and alerting in Python and SQL, reducing silent failures and improving mean-time-to-detect",
      "Built monitoring and observability for pipelines, with SLA tracking and performance dashboards"
    ]
  },
  {
    role: "Data Analyst — Data & Web",
    company: "Optica Africa",
    location: "Nairobi, Kenya",
    startDate: new Date("2020-07-01T00:00:00.000Z"),
    endDate: new Date("2022-03-01T00:00:00.000Z"),
    summary:
      "Built the APIs, schemas and reporting workflows behind high-volume transactional analytics.",
    highlights: [
      "Developed Python (Flask) RESTful APIs and normalised PostgreSQL schemas handling 500K+ daily transactions, supporting downstream analytics and reporting",
      "Implemented Infrastructure as Code with AWS CloudFormation and Elastic Beanstalk, standardising deployments and cutting provisioning time by 30%",
      "Built and maintained Elasticsearch monitoring stacks with optimised indices, achieving 99.9% uptime and faster log analytics",
      "Designed and ran ETL workflows in SQL and Python (Pandas), reducing reporting cycle times by 50% while improving accuracy and documentation",
      "Optimised cloud storage architecture with S3 lifecycle policies, controlling cost while improving retrieval performance",
      "Established logging and observability standards supporting analytics and incident response, enabling clear data lineage",
      "Trained cross-functional teams on data contracts, API integration patterns and secure handling of sensitive customer data"
    ]
  }
];

async function main() {
  const p = new PrismaClient({ adapter: new PrismaPg(pgConnectionConfig()) });
  for (let i = 0; i < EXPERIENCE.length; i++) {
    const item = EXPERIENCE[i];
    const existing = await p.experience.findFirst({ where: { role: item.role, company: item.company } });
    const data = { ...item, sortOrder: i, published: true };
    if (existing) await p.experience.update({ where: { id: existing.id }, data });
    else await p.experience.create({ data });
    console.log(`${existing ? "updated" : "created"}: ${item.role} @ ${item.company}`);
  }
  await p.$disconnect();
}
main().catch(e => { console.error("FAILED:", e.message); process.exit(1); });
