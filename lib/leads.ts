/**
 * Lead shapes and validation shared by the forms and the API routes.
 * Safe to import from client components - contains no commercial terms.
 */

import { businessCategories, floors, units } from "@/lib/property";

export const leadSources = [
  "Register Interest",
  "Site Visit",
  "Unit Enquiry",
  "Pricing Request",
  "Contact Form",
  "Brochure Download",
] as const;

export type LeadSource = (typeof leadSources)[number];

export const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Site Visit Requested",
  "Site Visit Scheduled",
  "Site Visit Completed",
  "Proposal Requested",
  "Proposal Sent",
  "Negotiating",
  "Reserved",
  "Converted",
  "Not Interested",
  "Lost",
  "Follow Up Later",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export const contactMethods = ["Phone call", "WhatsApp", "Email"] as const;

export const leaseDurations = [
  "1 year",
  "2 years",
  "3 years",
  "5 years",
  "Over 5 years",
  "Not decided",
] as const;

export const occupationWindows = [
  "Immediately",
  "Within 3 months",
  "3 to 6 months",
  "6 to 12 months",
  "Over 12 months",
] as const;

export const spaceRequirements = [
  "Under 600 m²",
  "600 to 700 m²",
  "Two combined units",
  "A full floor",
  "The whole building",
  "Not sure yet",
] as const;

export const floorOptions = [
  { value: "", label: "No preference" },
  ...Object.values(floors).map((floor) => ({
    value: floor.slug,
    label: `${floor.name} (${floor.area})`,
  })),
];

export const unitOptions = [
  { value: "", label: "No preference" },
  ...units.map((unit) => ({
    value: unit.slug,
    label: `${unit.name} - ${unit.floorName}, ${unit.area} m²`,
  })),
  { value: "second-floor-area", label: "Second floor - area on application" },
];

export const businessCategoryOptions = businessCategories;

export interface LeadInput {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  preferredContact?: string;
  businessCategory?: string;
  preferredFloor?: string;
  preferredUnit?: string;
  requiredArea?: string;
  occupationDate?: string;
  leaseDuration?: string;
  siteVisitInterest?: string;
  requirements?: string;
  consent: boolean;
  source: LeadSource;
  pagePath?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** Honeypot - must stay empty. */
  website?: string;
  siteVisit?: {
    preferredDate?: string;
    preferredTime?: string;
    visitors?: string;
    unitInterest?: string;
    message?: string;
  };
}

export type ValidationErrors = Partial<Record<keyof LeadInput | "form", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Accepts +256 700 000 000, 0700000000, (256) 700-000-000 and similar.
const PHONE = /^[+]?[\d][\d\s()-]{6,19}$/;

/**
 * Validation is intentionally shared: the browser gets instant feedback and
 * the API re-runs exactly the same rules, so the price gate cannot be opened
 * by posting junk straight to the endpoint.
 */
export function validateLead(input: Partial<LeadInput>): ValidationErrors {
  const errors: ValidationErrors = {};

  const name = input.fullName?.trim() ?? "";
  if (name.length < 2) {
    errors.fullName = "Enter your full name.";
  } else if (!/[a-z]/i.test(name)) {
    errors.fullName = "Enter your name using letters.";
  }

  const email = input.email?.trim() ?? "";
  if (!EMAIL.test(email)) {
    errors.email = "Enter a valid email address so we can send the terms.";
  }

  const phone = input.phone?.trim() ?? "";
  const digits = phone.replace(/\D/g, "");
  if (!PHONE.test(phone) || digits.length < 9) {
    errors.phone = "Enter a valid phone number including the country code.";
  }

  if (!input.consent) {
    errors.consent = "Please confirm you are happy for us to contact you.";
  }

  if (input.website) {
    errors.form = "Submission rejected.";
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors) {
  return Object.keys(errors).length > 0;
}

export const SUCCESS_MESSAGE =
  "Thank you for registering your interest. Our leasing team will contact you shortly with availability and the next steps.";
