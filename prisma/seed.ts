import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { pgConnectionConfig } from "../src/lib/db-config";

const adapter = new PrismaPg(pgConnectionConfig());
const prisma = new PrismaClient({ adapter });

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Caleb Kilemba",
      professionalTitle: "Data Engineer • Analytics Engineer • Consultant",
      heroHeading: "I build data solutions that solve real business problems.",
      homepageIntroduction:
        "I'm Caleb Kilemba. I help businesses turn fragmented, manual and difficult-to-use data into reliable pipelines, automated reporting systems, analytics platforms and decision-ready information.",
      aboutText:
        "I'm Caleb Kilemba, a Data Engineer focused on designing systems that make organisational data reliable, accessible and useful.\n\nI work across data engineering, analytics engineering, databases, automation and business intelligence.\n\nMy focus is not simply implementing technologies. I build solutions around the business problem that needs to be solved.",
      linkedinUrl: "https://www.linkedin.com/in/caleb-kilemba/",
      seoDescription:
        "Data engineer and BigQuery consultant. I build reliable data pipelines, cloud data warehouses and automated reporting that turn scattered business data into decisions you can trust.",
      bookingIntroduction:
        "Choose the service closest to your need, select an available consultation slot and describe the data problem you want to solve."
    }
  });

  const technologyNames = [
    "Google BigQuery", "Python", "SQL", "PostgreSQL", "dbt", "Apache Kafka", "Apache Airflow",
    "Apache Spark", "Google Cloud Platform", "Looker", "Looker Studio", "Tableau", "Docker", "Power BI", "Git",
    "Cloud technologies", "APIs", "Data Modelling", "Grafana"
  ];

  const technologyMap = new Map<string, string>();
  for (let i = 0; i < technologyNames.length; i++) {
    const name = technologyNames[i];
    const record = await prisma.technology.upsert({
      where: { name },
      update: { sortOrder: i },
      create: { name, slug: slugify(name), sortOrder: i }
    });
    technologyMap.set(name, record.id);
  }

  const services = [
{
      title: "BigQuery for Business",
      description: "Move your reporting onto Google BigQuery so analysis that used to take hours runs in seconds. I design the warehouse, model the data with dbt and connect it to dashboards your team can actually use — with query costs kept under control.",
      technologies: ["Google BigQuery", "dbt", "SQL", "Looker Studio", "Google Cloud Platform"]
    },
{
      title: "Analytics & Business Intelligence",
      description: "Turn operational data into dashboards and KPIs your team actually uses. I design the semantic layer so numbers agree across reports, build in Looker, Tableau or Power BI, and tune the queries behind them so dashboards load in seconds instead of minutes.",
      technologies: ["Looker", "Tableau", "Power BI", "SQL", "Data Modelling"]
    },
{
      title: "Analytics Engineering",
      description: "Bring software practice to your analytics layer. I build dbt models with automated tests, documentation and lineage, so every metric has one agreed definition, changes are reviewed before they reach a dashboard, and any number can be traced back to its source.",
      technologies: ["dbt", "SQL", "Google BigQuery", "Data Modelling"]
    },
{
      title: "Digital Transformation",
      description: "Replace spreadsheets, manual handoffs and disconnected systems with one dependable data platform. I map how information moves through your business, remove the manual steps and leave you with automated reporting people trust.",
      technologies: ["Google Cloud Platform", "Python", "Apache Airflow", "Data Modelling"]
    },
{
      title: "Data Pipeline Development",
      description: "Design and build reliable ETL and ELT pipelines that move data between APIs, databases, applications and analytics platforms.",
      technologies: ["Python", "Apache Airflow", "Apache Kafka", "APIs"]
    },
{
      title: "Data Warehousing",
      description: "Build structured analytical databases and warehouses that give organisations a trusted source of business data.",
      technologies: ["PostgreSQL", "SQL", "Data Modelling"]
    },
{
      title: "Data Automation",
      description: "Replace repetitive manual processes with automated data workflows, scheduled jobs and reporting systems.",
      technologies: ["Python", "Apache Airflow", "SQL"]
    },
{
      title: "Database Development",
      description: "Design and optimise database structures that support applications, reporting and analytical workloads.",
      technologies: ["PostgreSQL", "SQL", "Data Modelling"]
    },
{
      title: "Data Engineering Consulting",
      description: "Help organisations assess their existing data systems and design practical architectures for future growth.",
      technologies: ["Cloud technologies", "Data Modelling", "SQL"]
    }
  ];

  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    await prisma.service.upsert({
      where: { slug: slugify(service.title) },
      // Keep ordering authoritative on re-seed without clobbering admin-edited copy.
      update: { sortOrder: i },
      create: {
        title: service.title,
        slug: slugify(service.title),
        description: service.description,
        published: true,
        sortOrder: i,
        technologies: {
          connect: service.technologies.map((name) => ({ id: technologyMap.get(name)! }))
        }
      }
    });
  }

  const projects = [
    {
      title: "Automated Business Reporting Platform",
      category: "Automation & Analytics",
      summary: "An automated workflow that consolidates operational data into a structured reporting environment for repeatable business reporting.",
      businessProblem: "Business reporting processes often involve manually collecting information from different sources, cleaning the information and preparing recurring reports.",
      solution: "Design an automated data workflow for collecting, cleaning, transforming and loading operational data into a structured analytical environment.",
      businessImpact: "Demonstrate how organisations can reduce repetitive manual work and provide stakeholders with more consistent reporting.",
      architecture: "Source systems → Python ingestion → Airflow orchestration → PostgreSQL analytical layer → Power BI reporting.",
      caseStudy: "This starter case study is intentionally concise. Expand it from the admin dashboard with implementation details, design decisions, data model notes and screenshots as the project develops.",
      technologies: ["Python", "Apache Airflow", "PostgreSQL", "Power BI"]
    },
    {
      title: "Real-Time Market Monitoring Platform",
      category: "Real-Time Data",
      summary: "A streaming architecture for continuously ingesting, processing and monitoring rapidly changing market information.",
      businessProblem: "Businesses operating in rapidly changing markets need access to continuously updated information rather than relying only on periodic reports.",
      solution: "Build a streaming data architecture capable of ingesting market information, processing events and storing processed data for monitoring and analytics.",
      businessImpact: "Demonstrate how real-time architectures can support monitoring, operational awareness and faster decision-making.",
      architecture: "Market source → Python producer → Kafka → Spark stream processing → PostgreSQL → Grafana monitoring, containerised with Docker.",
      caseStudy: "Use this case study to document event design, streaming guarantees, schema choices, observability and deployment decisions. No performance claims are seeded.",
      technologies: ["Python", "Apache Kafka", "Apache Spark", "PostgreSQL", "Grafana", "Docker"]
    },
    {
      title: "Centralised Business Analytics Platform",
      category: "Data Warehousing",
      summary: "A central analytical data model that consolidates fragmented business information for consistent reporting and analysis.",
      businessProblem: "Business information can become fragmented across databases, spreadsheets and operational systems, making company-wide reporting difficult.",
      solution: "Design a central analytical data model that consolidates information into structures optimised for reporting and analysis.",
      businessImpact: "Demonstrate how organisations can create a consistent source of information for management reporting and analytics.",
      architecture: "Operational sources → staging → curated dimensional model in PostgreSQL → semantic reporting layer → Power BI.",
      caseStudy: "Expand this case study with source-system assumptions, dimensional modelling choices, data quality rules and reporting examples.",
      technologies: ["SQL", "PostgreSQL", "Data Modelling", "Power BI"]
    }
  ];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    await prisma.project.upsert({
      where: { slug: slugify(project.title) },
      update: {},
      create: {
        ...project,
        slug: slugify(project.title),
        featured: i < 3,
        published: true,
        sortOrder: i,
        technologies: {
          connect: project.technologies.map((name) => ({ id: technologyMap.get(name)! }))
        }
      }
    });
  }

  const draftPosts = [
    ["Building a Real-Time Data Pipeline with Apache Kafka", "Apache Kafka"],
    ["Building an Automated ETL Pipeline with Apache Airflow", "Apache Airflow"],
    ["PostgreSQL Query Optimisation for Data Engineers", "PostgreSQL"]
  ];

  for (const [title, category] of draftPosts) {
    await prisma.blogPost.upsert({
      where: { slug: slugify(title) },
      update: {},
      create: {
        title,
        slug: slugify(title),
        excerpt: "Draft starter article. Add the full technical content from the admin dashboard before publishing.",
        content: "# Draft\n\nAdd the technical article here using Markdown.",
        category,
        published: false,
        featured: false
      }
    });
  }

  const defaultAvailability = [1, 2, 3, 4, 5];
  for (const dayOfWeek of defaultAvailability) {
    await prisma.availability.upsert({
      where: { dayOfWeek },
      update: {},
      create: { dayOfWeek, startTime: "09:00", endTime: "17:00", slotDuration: 60, active: true }
    });
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await prisma.adminUser.upsert({
      where: { email: process.env.ADMIN_EMAIL.toLowerCase() },
      update: {},
      create: {
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        name: "Caleb Kilemba"
      }
    });
    console.log(`Admin ensured for ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set; no admin user was seeded.");
  }

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
