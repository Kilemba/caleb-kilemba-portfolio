/**
 * Client testimonials.
 *
 * Add one by appending an object here and setting `published: true`. They render on the
 * About page, newest entries first. Testimonials added through the admin panel are shown
 * alongside these, so you can use whichever is convenient.
 *
 * `published: false` keeps an entry in the file without showing it on the site.
 */
export type FileTestimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Optional link to the person's LinkedIn or company site. */
  url?: string;
  published: boolean;
};

export const TESTIMONIALS: FileTestimonial[] = [
  {
    // TODO: Replace with a real quote and set published to true.
    //
    // Left unpublished deliberately: a made-up endorsement attributed to a named person
    // is a fabricated credential, and on a site selling consulting work that is the kind
    // of thing a prospective client would reasonably rely on. Nothing renders until you
    // put a genuine quote here.
    //
    // Asking for one: after finishing a project, ask the client for two or three
    // sentences covering the problem they had, what you built, and what changed as a
    // result. Specific beats glowing.
    quote:
      "PLACEHOLDER — replace with a real client quote. Two or three sentences: the problem they had, what was built, and what changed afterwards.",
    name: "PLACEHOLDER Client Name",
    role: "PLACEHOLDER Role",
    company: "PLACEHOLDER Company",
    published: false
  }
];
