import { fetchHinLookup } from "@/lib/backend";

// Demonstration HIN registry. It is available only through explicit sample
// entry points and is not part of the default live lookup path.

// This module remains the seam between the demo and the real lookup. The single
// async function below is the only thing other code calls.

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
  FCM5X021J526: { slug: "bruce-wayne", canonicalHin: "FCM5X021J526", vesselName: "Bruce Wayne" },
  // Near-match aliases for the demo so a broker typing close still lands here.
  FCM5X021J525: { slug: "bruce-wayne", canonicalHin: "FCM5X021J526", vesselName: "Bruce Wayne" },
  // Prior demo HIN, kept resolving for backwards links during the rollout.
  FCM44021J526: { slug: "bruce-wayne", canonicalHin: "FCM5X021J526", vesselName: "Bruce Wayne" },
};

export function normalizeHin(input: string): string {
  return input.replace(/\s|-/g, "").toUpperCase();
}

// The single swappable function. Returns the lookup result for a HIN.
// Async on purpose so swapping to a real API call is a body change, not a
// signature change.
export async function findVesselByHin(rawHin: string): Promise<HinLookupResult> {
  const hin = normalizeHin(rawHin);

  try {
    const backend = await fetchHinLookup(hin);
    const vessel = backend?.vessel;
    if (vessel?.passport_id) {
      return {
        status: "found",
        slug: vessel.passport_id,
        hin: vessel.hin ?? hin,
        vesselName: vessel.name ?? "Vessel of record",
      };
    }
  } catch {
    return { status: "not_found", hin };
  }

  return { status: "not_found", hin };
}

export function findSampleVesselByHin(rawHin: string): HinLookupResult {
  const hin = normalizeHin(rawHin);
  const hit = DEMO_REGISTRY[hin];
  if (!hit) {
    return { status: "not_found", hin };
  }
  return {
    status: "found",
    slug: hit.slug,
    hin: hit.canonicalHin,
    vesselName: hit.vesselName,
  };
}

// Surface counts for the honest demo banner copy. Update if the registry grows.
export const REGISTRY_DEMO_COUNT = Object.keys(DEMO_REGISTRY).length;
