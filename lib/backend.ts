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

type BackendError = Error & {
  status?: number;
  body?: unknown;
};

export type BackendPostError = BackendError;

export type HinLookupResult = {
  vessel: {
    vessel_id: string;
    passport_id?: string | null;
    hin: string | null;
    name: string | null;
    discovery_status?: string | null;
  };
};

export type CreatePassportRequestInput = {
  name: string;
  email: string;
  role: string;
  offer: string;
  message?: string;
  hin?: string;
  passport_id?: string;
};

export type PassportRequestResult = {
  request_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  hin?: string | null;
  vessel_id?: string | null;
  passport_id?: string | null;
  next_step: string;
};

export type StartOnboardingSessionInput = {
  hin?: string;
  imo_number?: string;
  make?: string;
  model?: string;
  builder?: string;
  user_id: string;
};

export type StartOnboardingSessionResult = {
  session_id: string;
  vessel_id?: string | null;
  state: string;
  status?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type TransferRequestStatus =
  | "requested"
  | "authorized"
  | "payment_pending"
  | "completed"
  | "rejected";

export type CreateTransferRequestInput = {
  requester_name: string;
  requester_email: string;
  message?: string;
};

export type TransferRequestResult = {
  request_id: string;
  passport_id: string;
  status: TransferRequestStatus;
  requester_name: string;
  requester_email: string;
  message?: string | null;
  successor_passport_id?: string | null;
  archive_reason?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateAccessRequestInput = {
  buyer_name?: string;
  buyer_email?: string;
  buyer_company?: string;
  message?: string;
};

export type AccessRequestResult = {
  access_request_id: string;
  passport_id: string;
  status: TransferRequestStatus;
  created_at: string;
};

export type AccessRequestProgressResult = {
  access_request_id: string;
  passport_id: string;
  status: TransferRequestStatus;
  requested_at: string;
  authorized_at?: string | null;
  payment_status?: string | null;
  completed_at?: string | null;
  rejected_at?: string | null;
};

export type TransferStateResult = {
  passport_id: string;
  state: string;
  active_request_id?: string | null;
  current_holder?: string | null;
  next_holder?: string | null;
  requested_at?: string | null;
  authorized_at?: string | null;
  payment_status?: string | null;
  completed_at?: string | null;
};

export type PassportLifecycleResult = {
  passport_id: string;
  status: string;
  transfer_requested_at?: string | null;
  broker_authorized_at?: string | null;
  payment_completed_at?: string | null;
  old_holder_label?: string | null;
  new_holder_label?: string | null;
  archived_at?: string | null;
  archived_reason?: string | null;
  successor_passport_id?: string | null;
  successor_public_url?: string | null;
  revoked_at?: string | null;
  revoked_reason?: string | null;
  replacement_passport_id?: string | null;
};

export type TransferCompleteInput = {
  access_request_id: string;
  payment_reference?: string;
};

export type TransferCompleteResult = {
  passport_id: string;
  old_status: string;
  new_status: string;
  successor_passport_id?: string | null;
  completed_at: string;
};

export type PassportSurveyResult = {
  survey_id: string;
  passport_id: string;
  file_url: string;
  uploaded_by: string;
  uploaded_at: string;
};

export type PassportInspectionResult = {
  inspection_id: string;
  passport_id: string;
  inspector_name: string;
  inspected_at: string;
};

export type PassportCompletionResult = {
  passport_id: string;
  has_survey: boolean;
  has_inspection: boolean;
  is_complete: boolean;
  survey?: PassportSurveyResult | null;
  inspection?: PassportInspectionResult | null;
};

export type PublicKeyResult = {
  public_key_url: string;
};

export async function fetchPassportCompletion(passportId: string): Promise<PassportCompletionResult> {
  return fetchBackendJson<PassportCompletionResult>(`/api/v1/passports/${passportId}/completion`);
}

export async function fetchPassportPublicKey(passportId: string): Promise<PublicKeyResult> {
  return { public_key_url: `${getBackendBaseUrl() ?? ""}/.well-known/passport-pubkey.pem` };
}

export async function fetchPassportPdfQr(passportId: string): Promise<string> {
  return `${getBackendBaseUrl() ?? ""}/api/v1/passports/public/${passportId}/verify`;
}

export function qrDataUri(value: string): string {
  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="white"/><rect x="8" y="8" width="112" height="112" fill="none" stroke="black" stroke-width="2"/><text x="64" y="54" text-anchor="middle" font-size="10" font-family="monospace">VERIFY URL</text><text x="64" y="70" text-anchor="middle" font-size="7" font-family="monospace">${escaped}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function publicKeyUrlFromVerifyUrl(verifyUrl: string): string {
  try {
    const url = new URL(verifyUrl, "http://localhost");
    return `${url.origin}/.well-known/passport-pubkey.pem`;
  } catch {
    return "/.well-known/passport-pubkey.pem";
  }
}

export function absoluteVerifyUrl(verifyUrl: string): string {
  if (/^https?:\/\//i.test(verifyUrl)) return verifyUrl;
  const base = getBackendBaseUrl() ?? "";
  return `${base}${verifyUrl}`;
}

export type PrintPassportPayload = {
  verify_url: string;
  qr_data_uri: string;
  public_key_url: string;
};

export async function buildPrintPassportPayload(passportId: string): Promise<PrintPassportPayload> {
  const verify_url = await fetchPassportPdfQr(passportId);
  return {
    verify_url,
    qr_data_uri: qrDataUri(verify_url),
    public_key_url: publicKeyUrlFromVerifyUrl(verify_url),
  };
}

export function printPassportDocument(): void {
  if (typeof window !== "undefined") window.print();
}

type BackendPassportResponse = {
  passport_id: string;
  status: string;
  mint_timestamp: string;
  archived_at?: string | null;
  revoked_at?: string | null;
  transfer_request?: {
    request_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    successor_passport_id?: string | null;
    archive_reason?: string | null;
  } | null;
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

export async function postBackendJson<TResponse, TBody extends Record<string, unknown>>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    throw new Error("backend_base_url_missing");
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const responseBody = await res.json().catch(() => ({}));
    const err = new Error(`backend_http_${res.status}`) as BackendError;
    err.status = res.status;
    err.body = responseBody;
    throw err;
  }

  return (await res.json()) as TResponse;
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

export async function createPassportRequest(
  body: CreatePassportRequestInput
): Promise<PassportRequestResult> {
  return postBackendJson<PassportRequestResult, CreatePassportRequestInput>(
    "/api/v1/passports/passport-requests",
    body
  );
}

export async function fetchPassportRequest(requestId: string): Promise<PassportRequestResult> {
  return fetchBackendJson<PassportRequestResult>(`/api/v1/passports/passport-requests/${requestId}`);
}

export async function startOnboardingSession(
  body: StartOnboardingSessionInput
): Promise<StartOnboardingSessionResult> {
  return postBackendJson<StartOnboardingSessionResult, StartOnboardingSessionInput>(
    "/api/v1/onboarding/session",
    body
  );
}

export async function createTransferRequest(
  passportId: string,
  body: CreateTransferRequestInput
): Promise<TransferRequestResult> {
  return postBackendJson<TransferRequestResult, CreateTransferRequestInput>(
    `/api/v1/passports/public/${passportId}/transfer-requests`,
    body
  );
}

export async function fetchTransferRequest(
  passportId: string,
  requestId: string
): Promise<TransferRequestResult> {
  return fetchBackendJson<TransferRequestResult>(
    `/api/v1/passports/public/${passportId}/transfer-requests/${requestId}`
  );
}

export async function createAccessRequest(
  passportId: string,
  body: CreateAccessRequestInput
): Promise<AccessRequestResult> {
  return postBackendJson<AccessRequestResult, CreateAccessRequestInput>(
    `/api/v1/passports/${passportId}/access-requests`,
    body
  );
}

export async function fetchAccessRequestProgress(
  passportId: string,
  accessRequestId: string
): Promise<AccessRequestProgressResult> {
  return fetchBackendJson<AccessRequestProgressResult>(
    `/api/v1/passports/${passportId}/access-requests/${accessRequestId}`
  );
}

export async function fetchTransferState(passportId: string): Promise<TransferStateResult> {
  return fetchBackendJson<TransferStateResult>(`/api/v1/passports/${passportId}/transfer-state`);
}

export async function fetchPassportLifecycle(passportId: string): Promise<PassportLifecycleResult> {
  return fetchBackendJson<PassportLifecycleResult>(`/api/v1/passports/${passportId}/lifecycle`);
}

export async function completeTransfer(
  passportId: string,
  body: TransferCompleteInput
): Promise<TransferCompleteResult> {
  return postBackendJson<TransferCompleteResult, TransferCompleteInput>(
    `/api/v1/passports/${passportId}/transfer/complete`,
    body
  );
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
  const manufacturer = deriveManufacturer(vesselRaw);
  const scoring = buildScoring(snapshot);

  return {
    _meta: {
      note: "Live VesselIQ Passport record.",
      schema_version: String(snapshot.schema_version ?? "1.0.0"),
      passport_id: data.passport_id,
      issued: data.mint_timestamp,
      status: data.status,
      lifecycle: {
        archived_at: data.archived_at ?? null,
        revoked_at: data.revoked_at ?? null,
        transfer_request: data.transfer_request
          ? {
              request_id: data.transfer_request.request_id,
              status: data.transfer_request.status,
              created_at: data.transfer_request.created_at,
              updated_at: data.transfer_request.updated_at,
              successor_passport_id: data.transfer_request.successor_passport_id ?? null,
              archive_reason: data.transfer_request.archive_reason ?? null,
            }
          : null,
      },
    },
    vessel: {
      vessel_id: String(unwrapAnnotated<string>(vesselRaw.vessel_id) ?? ""),
      vessel_version_id: String(unwrapAnnotated<string>(vesselRaw.vessel_version_id) ?? ""),
      catalog_id: String(unwrapAnnotated<string>(vesselRaw.catalog_id) ?? "catalog"),
      hin: String(unwrapAnnotated<string>(vesselRaw.hin) ?? ""),
      imo_number: unwrapAnnotated<string>(vesselRaw.imo_number),
      mmsi: unwrapAnnotated<string>(vesselRaw.mmsi),
      official_number_us: unwrapAnnotated<string>(vesselRaw.official_number_us),
      name: String(unwrapAnnotated<string>(vesselRaw.name) ?? "Vessel of record"),
      flag_state: unwrapAnnotated<string>(vesselRaw.flag_state),
      builder: String(unwrapAnnotated<string>(vesselRaw.builder) ?? manufacturer.company_name),
      make: String(unwrapAnnotated<string>(vesselRaw.make) ?? manufacturer.company_name),
      model: String(unwrapAnnotated<string>(vesselRaw.model) ?? "Unknown"),
      model_year: Number(unwrapAnnotated<number>(vesselRaw.model_year) ?? 0),
      loa_m: Number(unwrapAnnotated<number>(vesselRaw.loa_m) ?? 0),
      beam_m: Number(unwrapAnnotated<number>(vesselRaw.beam_m) ?? 0),
      draft_m: Number(unwrapAnnotated<number>(vesselRaw.draft_m) ?? 0),
      depth_m: Number(unwrapAnnotated<number>(vesselRaw.depth_m) ?? 0),
      hull_material: unwrapAnnotated<string>(vesselRaw.hull_material),
      vessel_type: String(unwrapAnnotated<string>(vesselRaw.vessel_type) ?? "Unknown"),
      classification_society: unwrapAnnotated<string>(vesselRaw.classification_society),
      verification_status: String(unwrapAnnotated<string>(vesselRaw.verification_status) ?? "unverified"),
      confidence_pct: Number(unwrapAnnotated<number>(vesselRaw.confidence_pct) ?? scoring.confidence_pct),
      service_status: unwrapAnnotated<string>(vesselRaw.service_status),
      service_status_detail: unwrapAnnotated<string>(vesselRaw.service_status_detail),
      documented: unwrapAnnotated<string>(vesselRaw.documented),
      doc_status: unwrapAnnotated<string>(vesselRaw.doc_status),
      doc_type: unwrapAnnotated<string>(vesselRaw.doc_type),
      doc_issued_date: unwrapAnnotated<string>(vesselRaw.doc_issued_date),
      doc_expiration_date: unwrapAnnotated<string>(vesselRaw.doc_expiration_date),
      manufacturer_mic: unwrapAnnotated<string>(vesselRaw.manufacturer_mic),
      manufacturer_id: unwrapAnnotated<string>(vesselRaw.manufacturer_id),
      created_at: String(unwrapAnnotated<string>(vesselRaw.created_at) ?? data.mint_timestamp),
      updated_at: String(unwrapAnnotated<string>(vesselRaw.updated_at) ?? data.mint_timestamp),
      attributes: (vesselRaw.attributes as Record<string, unknown>) ?? {},
    },
    manufacturer,
    systems: [],
    service_events: [],
    provenance: [],
    scoring,
    signature: {
      canonical_hash_sha256: data.signature.canonical_hash_sha256,
      signature_b64: data.signature.signature_b64,
      signing_key_id: data.signature.signing_key_id,
      signing_key_version: data.signature.signing_key_version,
      algorithm: data.signature.algorithm,
      mint_timestamp: data.mint_timestamp,
      public_key_url: publicKeyUrlFromVerifyUrl(absoluteVerifyUrl(data.verifier_url)),
    },
    fact_metadata: buildFactMetadata(snapshot),
  };
}

export async function fetchPublicPassport(passportId: string): Promise<Passport> {
  const data = await fetchBackendJson<BackendPassportResponse>(`/api/v1/passports/public/${passportId}`);
  return buildPassportFromBackendResponse(data);
}

export async function verifyPublicPassport(passportId: string): Promise<BackendVerifyResponse> {
  return fetchBackendJson<BackendVerifyResponse>(`/api/v1/passports/public/${passportId}/verify`);
}

export function isBackendRevokedError(error: unknown): error is BackendError {
  const backendError = error as BackendError;
  if (backendError?.status !== 410) return false;
  const body = backendError.body as { error?: unknown } | undefined;
  return body?.error === "revoked";
}

export function passportFromRevokedError(error: unknown): Passport {
  const backendError = error as BackendError;
  const body = backendError.body as BackendRevokedPassportResponse;
  return buildPassportFromBackendResponse(body);
}
