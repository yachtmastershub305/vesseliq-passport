import data from "@/data/passport-demo-data-v2.json";
import type { Passport } from "./passport-types";

const passport = data as unknown as Passport;

export function getPassportBySlug(slug: string): Passport | null {
  if (slug.toLowerCase() === passport.vessel.name.toLowerCase()) return passport;
  return null;
}

export function getAllPassportSlugs(): string[] {
  return [passport.vessel.name.toLowerCase()];
}

export { passport };
