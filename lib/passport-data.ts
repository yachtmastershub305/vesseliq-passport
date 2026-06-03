import data from "@/data/passport-demo-data-v2.json";
import type { FactMeta, Passport } from "./passport-types";
import {
  fetchPublicPassport,
  isBackendNotFoundError,
  isBackendRevokedError,
  isUuidLike,
  passportFromRevokedError,
} from "./backend";

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

export async function getPassportForRoute(slug: string): Promise<Passport | null> {
  const demo = getPassportBySlug(slug);
  if (demo) return demo;
  if (!isUuidLike(slug)) return null;

  try {
    return await fetchPublicPassport(slug);
  } catch (error) {
    if (isBackendNotFoundError(error)) return null;
    if (isBackendRevokedError(error)) return passportFromRevokedError(error);
    throw error;
  }
}

export function isSamplePassportSlug(slug: string): boolean {
  return getPassportBySlug(slug) !== null;
}

export function getAllPassportSlugs(): string[] {
  return [PASSPORT_SLUG];
}

export function getFactMeta(p: Passport, path: string): FactMeta | null {
  return p.fact_metadata?.[path] ?? null;
}

export { passport, PASSPORT_SLUG };
