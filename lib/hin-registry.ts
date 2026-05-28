// Demonstration HIN registry. Swap findVesselByHin for the live API later.
//
// This module is the seam between the demo and the real lookup. The single
// async function below is the only thing other code calls. When Bill's API
// is ready, replace the body with a fetch, the rest of the app does not
// change.

export type HinLookupHit = {
  status: "found";
  slug: string;
  // Canonical HIN as stored on the record.
  hin: string;
  vesselName: string;
};

export type HinLookupMiss = {
  status: "not_found";
  hin: string;
};

export type HinLookupResult = HinLookupHit | HinLookupMiss;

// Hardcoded demo registry. Keys are uppercased HINs. The value points at the
// slug under /passport/[slug] that should resolve for that HIN.
//
// Meridian's HIN is the canonical value from passport-demo-data-v2.json.
// The aliases let a broker key in something close (e.g. truncated or with
// spaces removed) and still land on the demo Passport.
const DEMO_REGISTRY: Record<string, { slug: string; canonicalHin: string; vesselName: string }> = {
  FCM44021J526: { slug: "meridian", canonicalHin: "FCM44021J526", vesselName: "Meridian" },
  // Aliases for the demo, in case the broker types a near match. Optional.
  FCM44021J525: { slug: "meridian", canonicalHin: "FCM44021J526", vesselName: "Meridian" },
};

export function normalizeHin(input: string): string {
  return input.replace(/\s|-/g, "").toUpperCase();
}

// The single swappable function. Returns the lookup result for a HIN.
// Async on purpose so swapping to a real API call is a body change, not a
// signature change.
export async function findVesselByHin(rawHin: string): Promise<HinLookupResult> {
  const hin = normalizeHin(rawHin);
  const hit = DEMO_REGISTRY[hin];
  if (hit) {
    return {
      status: "found",
      slug: hit.slug,
      hin: hit.canonicalHin,
      vesselName: hit.vesselName,
    };
  }
  return { status: "not_found", hin };
}

// Surface counts for the honest demo banner copy. Update if the registry grows.
export const REGISTRY_DEMO_COUNT = Object.keys(DEMO_REGISTRY).length;
