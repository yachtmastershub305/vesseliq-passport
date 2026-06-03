import type { Passport, FactMetadataMap } from "@/lib/passport-types";

const DEFAULT_SCORE_WEIGHTS = {
  accuracy: 35,
  provenance: 25,
  completeness: 20,
  consistency: 10,
  timeliness: 10,
} as const;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type HinLookupResult = {
  vessel: {
    vessel_id: string;
    passport_id?: string | null;
    hin: string | null;
    name: string | null;
  };
};

type BackendError = Error & {
  status?: number;
  body?: unknown;
};

type BackendPassportResponse = {
  passport_id: string;
  status: string;
  mint_timestamp: string;
  snapshot_payload: Record<string, unknown>;
  signature: {
    canonical_hash_sha256: string;
    signature_b64: string;
    signing_key_id: string;
    signing_key_version: number;
    algorithm: string;
  };
  verifier_url: string;
};

type BackendRevokedPassportResponse = BackendPassportResponse & {
  error: "revoked";
  revoked_at?: string | null;
};

type BackendVerifyResponse = {
  passport_id: string;
  verified: boolean;
  status?: string;
  mint_timestamp?: string;
  signing_key_id?: string;
  algorithm?: string;
  error?: string;
  schema_version?: string;
};

function getBackendBaseUrl(): string | null {
  const raw =
    process.env.VESSELIQ_BACKEND_BASE_URL ??
    process.env.NEXT_PUBLIC_VESSELIQ_BACKEND_BASE_URL ??
    "";

  const base = raw.trim().replace(/\/$/, "");
  return base || null;
}

async function fetchBackendJson<T>(path: string): Promise<T> {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    throw new Error("backend_base_url_missing");
  }

  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(`backend_http_${res.status}`) as BackendError;
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return (await res.json()) as T;
}

function unwrapAnnotated<T>(value: unknown): T | null {
  if (value && typeof value === "object" && "value" in value) {
    return (value as { value: T | null }).value ?? null;
  }
  return (value as T) ?? null;
}

function factMetaFromAnnotated(value: unknown) {
  if (!value || typeof value !== "object" || !("tier" in value)) return null;
  const meta = value as {
    tier?: number;
    verification_status?: string;
    confidence_pct?: number | null;
  };
  if (!meta.tier || !meta.verification_status) return null;
  return {
    tier: meta.tier as 1 | 2 | 3 | 4,
    verification_status: meta.verification_status as "UNVERIFIED" | "USER_CONFIRMED" | "EXPERT_VALIDATED",
    confidence_pct: meta.confidence_pct ?? undefined,
  };
}

function buildFactMetadata(snapshot: Record<string, unknown>): FactMetadataMap {
  const out: FactMetadataMap = {};
  const vessel = (snapshot.vessel ?? {}) as Record<string, unknown>;
  for (const [key, value] of Object.entries(vessel)) {
    const meta = factMetaFromAnnotated(value);
    if (meta) out[`vessel.${key}`] = meta;
  }

  const equipment = Array.isArray(snapshot.equipment) ? snapshot.equipment : [];
  for (const item of equipment) {
    if (!item || typeof item !== "object") continue;
    const eq = item as Record<string, unknown>;
    const eqId = String(eq.equipment_instance_id ?? "");
    if (!eqId) continue;
    for (const field of ["serial_number", "installed_at", "manufacturer", "model_number"]) {
      const meta = factMetaFromAnnotated(eq[field]);
      if (meta) out[`equipment.${eqId}.${field}`] = meta;
    }
    const attrs = (eq.attributes ?? {}) as Record<string, unknown>;
    const currentHours = attrs.current_hours;
    if (currentHours !== undefined && currentHours !== null) {
      const manufacturerMeta = factMetaFromAnnotated(eq.manufacturer);
      if (manufacturerMeta) out[`equipment.${eqId}.current_hours`] = manufacturerMeta;
    }
  }

  const serviceHistory = Array.isArray(snapshot.service_history) ? snapshot.service_history : [];
  for (const item of serviceHistory) {
    if (!item || typeof item !== "object") continue;
    const event = item as Record<string, unknown>;
    const eventId = String(event.service_event_id ?? "");
    const status = event.verification_status;
    const tier = event.tier;
    if (!eventId || typeof status !== "string" || typeof tier !== "number") continue;
    out[`service.${eventId}`] = {
      tier: tier as 1 | 2 | 3 | 4,
      verification_status: status as "UNVERIFIED" | "USER_CONFIRMED" | "EXPERT_VALIDATED",
    };
  }

  return out;
}

function deriveManufacturer(vessel: Record<string, unknown>) {
  const mic = unwrapAnnotated<string>(vessel.manufacturer_mic) ?? null;
  const companyName = unwrapAnnotated<string>(vessel.builder) ?? unwrapAnnotated<string>(vessel.make) ?? "Unknown";
  return {
    mic: mic ?? "UNK",
    company_name: companyName,
    display_name: companyName,
    city: null,
    state: null,
    country: null,
    mic_status: "active",
  };
}

function buildScoring(snapshot: Record<string, unknown>) {
  const vessel = (snapshot.vessel ?? {}) as Record<string, unknown>;
  const summary = (snapshot.summary ?? {}) as Record<string, unknown>;
  const confidencePct = Number(unwrapAnnotated<number>(vessel.confidence_pct) ?? summary.completeness_pct ?? 0);
  return {
    confidence_pct: confidencePct,
    weights: { ...DEFAULT_SCORE_WEIGHTS },
    breakdown: {
      identity: Number(summary.completeness_pct ?? confidencePct ?? 0),
      equipment: Array.isArray(snapshot.equipment) ? Math.min(100, snapshot.equipment.length * 10) : 0,
      maintenance: Array.isArray(snapshot.service_history) ? Math.min(100, snapshot.service_history.length * 20) : 0,
      provenance: 100,
      documents: Array.isArray(snapshot.documents) ? Math.min(100, snapshot.documents.length * 20) : 0,
    },
  };
}

export function isUuidLike(value: string): boolean {
  return UUID_RE.test(value);
}

export function isBackendNotFoundError(error: unknown): boolean {
  const backendError = error as BackendError;
  if (backendError?.status !== 404) return false;

  const body = backendError.body;
  if (!body || typeof body !== "object") return true;
  return (body as { error?: unknown }).error === "not_found";
}

export async function fetchHinLookup(hin: string): Promise<HinLookupResult> {
  return fetchBackendJson<HinLookupResult>(`/api/v1/onboarding/lookup/hin/${encodeURIComponent(hin)}`);
}

function buildPassportFromBackendResponse(data: BackendPassportResponse): Passport {
  const snapshot = data.snapshot_payload ?? {};
  const vesselRaw = ((snapshot.vessel ?? {}) as Record<string, unknown>);
  const vessel = {
    vessel_id: String(vesselRaw.vessel_id ?? ""),
    vessel_version_id: unwrapAnnotated<string>(vesselRaw.vessel_version_id) ?? String(vesselRaw.vessel_version_id ?? ""),
    catalog_id: unwrapAnnotated<string>(vesselRaw.catalog_id) ?? String(vesselRaw.vessel_id ?? ""),
    hin: unwrapAnnotated<string>(vesselRaw.hin) ?? "",
    imo_number: unwrapAnnotated<string>(vesselRaw.imo_number),
    mmsi: unwrapAnnotated<string>(vesselRaw.mmsi),
    official_number_us: unwrapAnnotated<string>(vesselRaw.official_number_us),
    name: unwrapAnnotated<string>(vesselRaw.name) ?? "Unnamed vessel",
    flag_state: unwrapAnnotated<string>(vesselRaw.flag_state),
    builder: unwrapAnnotated<string>(vesselRaw.builder) ?? "Unknown",
    make: unwrapAnnotated<string>(vesselRaw.make) ?? "Unknown",
    model: unwrapAnnotated<string>(vesselRaw.model) ?? "Unknown",
    model_year: Number(unwrapAnnotated<number>(vesselRaw.model_year) ?? 0),
    loa_m: Number(unwrapAnnotated<number>(vesselRaw.loa_m) ?? 0),
    beam_m: Number(unwrapAnnotated<number>(vesselRaw.beam_m) ?? 0),
    draft_m: Number(unwrapAnnotated<number>(vesselRaw.draft_m) ?? 0),
    depth_m: Number(unwrapAnnotated<number>(vesselRaw.depth_m) ?? 0),
    hull_material: unwrapAnnotated<string>(vesselRaw.hull_material),
    vessel_type: unwrapAnnotated<string>(vesselRaw.vessel_type) ?? "vessel",
    classification_society: unwrapAnnotated<string>(vesselRaw.classification_society),
    verification_status: String(unwrapAnnotated<string>(vesselRaw.verification_status) ?? "UNVERIFIED"),
    confidence_pct: Number(unwrapAnnotated<number>(vesselRaw.confidence_pct) ?? 0),
    service_status: unwrapAnnotated<string>(vesselRaw.service_status),
    service_status_detail: unwrapAnnotated<string>(vesselRaw.service_status_detail),
    documented: unwrapAnnotated<string>(vesselRaw.documented),
    doc_status: unwrapAnnotated<string>(vesselRaw.doc_status),
    doc_type: unwrapAnnotated<string>(vesselRaw.doc_type),
    doc_issued_date: unwrapAnnotated<string>(vesselRaw.doc_issued_date),
    doc_expiration_date: unwrapAnnotated<string>(vesselRaw.doc_expiration_date),
    manufacturer_mic: unwrapAnnotated<string>(vesselRaw.manufacturer_mic),
    manufacturer_id: unwrapAnnotated<string>(vesselRaw.manufacturer_id),
    created_at: data.mint_timestamp,
    updated_at: data.mint_timestamp,
    attributes: {},
  };

  const equipment = (Array.isArray(snapshot.equipment) ? snapshot.equipment : []).map((item) => {
    const eq = item as Record<string, unknown>;
    return {
      equipment_instance_id: String(eq.equipment_instance_id ?? ""),
      serial_number: unwrapAnnotated<string>(eq.serial_number) ?? "—",
      installed_at: unwrapAnnotated<string>(eq.installed_at) ?? data.mint_timestamp,
      removed_at: null,
      subsystem_node_id: String(eq.subsystem_node_id ?? ""),
      attributes: (eq.attributes ?? {}) as Record<string, string | number | boolean | null>,
      model: {
        manufacturer: unwrapAnnotated<string>(eq.manufacturer) ?? "Unknown",
        model_number: unwrapAnnotated<string>(eq.model_number) ?? "Unknown",
        equipment_type: String(((eq.attributes ?? {}) as Record<string, unknown>).equipment_type ?? "Equipment"),
        specs: {},
      },
    };
  });

  const systems = (Array.isArray(snapshot.systems) ? snapshot.systems : []).map((item) => {
    const sys = item as Record<string, unknown>;
    const systemId = String(sys.system_id ?? "");
    return {
      system_id: systemId,
      system_type: String(sys.system_type ?? "SYSTEM"),
      name: unwrapAnnotated<string>(sys.name) ?? String(sys.system_type ?? "System"),
      attributes: (sys.attributes ?? {}) as Record<string, unknown>,
      equipment: equipment.filter((eq) => eq.subsystem_node_id === systemId),
    };
  });

  const serviceEvents = (Array.isArray(snapshot.service_history) ? snapshot.service_history : []).map((item) => {
    const ev = item as Record<string, unknown>;
    return {
      service_event_id: String(ev.service_event_id ?? ""),
      event_date: String(ev.event_date ?? ""),
      event_type: String(ev.event_type ?? "Service"),
      meter_reading_hrs: typeof ev.meter_reading_hrs === "number" ? ev.meter_reading_hrs : null,
      work_order_ref: "—",
      performed_by: String(ev.performed_by ?? "Unknown"),
      task_code: String(ev.event_type ?? "SERVICE"),
      equipment_instance_id: null,
      notes: String(ev.description ?? ""),
      line_items: [],
    };
  });

  const provenance = [
    ...serviceEvents.map((ev) => ({
      provenance_id: ev.service_event_id,
      entity: "service_event",
      source_name: "Service history",
      source_type: "user_submission",
      source_uri: null,
      source_url: null,
      license: "restricted",
      captured_at: ev.event_date,
      captured_by: ev.performed_by,
      payload_summary: ev.notes || `${ev.event_type} on ${ev.event_date}`,
    })),
    ...equipment.map((eq) => ({
      provenance_id: eq.equipment_instance_id,
      entity: "equipment_instance",
      source_name: eq.model.manufacturer,
      source_type: "oem_data",
      source_uri: null,
      source_url: null,
      license: "restricted",
      captured_at: eq.installed_at,
      captured_by: "VesselIQ",
      payload_summary: `${eq.model.manufacturer} ${eq.model.model_number}`,
    })),
  ];

  return {
    _meta: {
      note: "Live backend passport",
      schema_version: String(snapshot.schema_version ?? "1.0.0"),
      passport_id: data.passport_id,
      issued: data.mint_timestamp,
      is_sample: false,
      slug: data.passport_id,
      status: data.status,
    },
    vessel,
    manufacturer: deriveManufacturer(vesselRaw),
    systems,
    service_events: serviceEvents,
    provenance,
    scoring: buildScoring(snapshot),
    signature: {
      canonical_hash_sha256: data.signature.canonical_hash_sha256,
      signature_b64: data.signature.signature_b64,
      signing_key_id: data.signature.signing_key_id,
      signing_key_version: data.signature.signing_key_version,
      algorithm: data.signature.algorithm,
      mint_timestamp: data.mint_timestamp,
    },
    fact_metadata: buildFactMetadata(snapshot),
  };
}

export async function fetchPublicPassport(passportId: string): Promise<Passport> {
  const data = await fetchBackendJson<BackendPassportResponse>(`/api/v1/passports/public/${passportId}`);
  return buildPassportFromBackendResponse(data);
}

export function isBackendRevokedError(error: unknown): error is BackendError & { body: BackendRevokedPassportResponse } {
  const backendError = error as BackendError;
  return backendError?.status === 410 && !!backendError.body && typeof backendError.body === "object" && (backendError.body as { error?: unknown }).error === "revoked";
}

export function passportFromRevokedError(error: BackendError & { body: BackendRevokedPassportResponse }): Passport {
  return buildPassportFromBackendResponse(error.body);
}

export async function verifyPublicPassport(passportId: string): Promise<BackendVerifyResponse> {
  return fetchBackendJson<BackendVerifyResponse>(`/api/v1/passports/public/${passportId}/verify`);
}
