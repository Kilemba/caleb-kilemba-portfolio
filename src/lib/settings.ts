import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
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
        "I'm Caleb Kilemba, a Data Engineer focused on designing systems that make organisational data reliable, accessible and useful.",
      seoDescription:
        "Caleb Kilemba is a Data Engineer, Analytics Engineer and Consultant building practical data solutions.",
      bookingIntroduction:
        "Choose a service and an available time, then describe the data problem you want to solve."
    }
  });
}
