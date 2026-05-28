// Centralized placeholder prices for the broker demo.
// Swap the strings here to update every surface at once.
// Final pricing is set by the founder, these are obvious placeholders.

export const PRICING = {
  creation: {
    label: "Have your Passport created",
    headline: "From $X,XXX",
    suffix: "one time, includes verification and certification",
  },
  transfer: {
    label: "Unlock and transfer",
    headline: "From $X,XXX",
    suffix: "one time, payable by the acquiring party",
  },
  maintenance: {
    label: "Keep your Passport live",
    headline: "From $XX per month",
    suffix: "YMH account, otherwise the record is a static snapshot",
  },
} as const;

export type OfferKey = "create" | "acquire";

export const OFFER_LEAD_TYPES = ["create", "acquire"] as const;

export const OFFER_LABELS: Record<OfferKey, string> = {
  create: "Create a Passport",
  acquire: "Acquire a Passport",
};
