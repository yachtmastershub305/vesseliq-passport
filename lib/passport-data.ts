import data from "@/data/passport-demo-data-v2.json";
import type { Passport } from "./passport-types";

const passport = data as unknown as Passport;

function defaultSlug(p: Passport): string {
  return (p._meta.slug ?? p.vessel.name).toLowerCase().replace(/\s+/g, "-");
}

const PASSPORT_SLUG = defaultSlug(passport);

// Legacy slug aliases so older links keep working through renames.
const LEGACY_ALIASES = new Set(["meridian"]);

export function getPassportBySlug(slug: string): Passport | null {
  const s = slug.toLowerCase();
  if (s === PASSPORT_SLUG) return passport;
  if (LEGACY_ALIASES.has(s)) return passport;
  return null;
}

export function getAllPassportSlugs(): string[] {
  return [PASSPORT_SLUG];
}

export { passport, PASSPORT_SLUG };
