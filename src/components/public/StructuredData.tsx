import type { SiteSettings } from "@/generated/prisma/client";
import { FAQS } from "@/lib/landing-content";

type ServiceSummary = { title: string; description: string; slug: string };

/**
 * schema.org JSON-LD describing the person, the services offered and the FAQ.
 *
 * This is what lets search engines show Caleb as a data engineering provider for
 * service-intent queries, and makes the FAQ eligible for rich results. The FAQ entries
 * come from the same module the page renders, because structured data that is not
 * visible on the page is treated as spam.
 */
export function StructuredData({
  settings,
  services,
  baseUrl
}: {
  settings: SiteSettings;
  services: ServiceSummary[];
  baseUrl: string;
}) {
  const sameAs = [settings.linkedinUrl, settings.githubUrl].filter((v): v is string => Boolean(v));

  const person = {
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: settings.name,
    jobTitle: "Data Engineer",
    description: settings.seoDescription,
    url: baseUrl,
    knowsAbout: [
      "Data Engineering",
      "Google BigQuery",
      "Digital Transformation",
      "ETL and ELT Pipelines",
      "Cloud Data Warehousing",
      "Analytics Engineering",
      "Business Intelligence",
      "Data Modelling",
      "Data Automation"
    ],
    ...(sameAs.length > 0 && { sameAs }),
    ...(settings.email && { email: settings.email }),
    ...(settings.location && { address: { "@type": "PostalAddress", addressLocality: settings.location } })
  };

  const professionalService = {
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#service`,
    name: `${settings.name} — Data Engineering Services`,
    description: settings.seoDescription,
    url: baseUrl,
    provider: { "@id": `${baseUrl}/#person` },
    areaServed: "Worldwide",
    availableLanguage: "English",
    serviceType: [
      "Data Engineering",
      "BigQuery Consulting",
      "Digital Transformation",
      "Data Pipeline Development",
      "Business Intelligence"
    ],
    ...(sameAs.length > 0 && { sameAs }),
    ...(services.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Data engineering services",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description,
            url: `${baseUrl}/services#${service.slug}`
          }
        }))
      }
    })
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };

  const website = {
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: settings.name,
    description: settings.seoDescription,
    publisher: { "@id": `${baseUrl}/#person` }
  };

  const graph = { "@context": "https://schema.org", "@graph": [person, professionalService, faqPage, website] };

  return (
    <script
      type="application/ld+json"
      // Escaping "<" prevents database-sourced copy from closing the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
