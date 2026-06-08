import type { NextRequest } from "next/server";
import { createPassportRequest, type BackendPostError } from "@/lib/backend";
import { OFFER_LEAD_TYPES, type OfferKey } from "@/lib/pricing";

type AccessSuccessBody = {
  ok: true;
  offer: OfferKey;
  request_id: string;
  vessel_id: string | null;
  passport_id: string | null;
  status: string;
  next_step: string;
};

function responseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const candidate = (body as { detail?: unknown; error?: unknown }).detail ?? (body as { error?: unknown }).error;
  if (typeof candidate === "string" && candidate.trim()) return candidate;
  return fallback;
}

function successBody(offer: OfferKey, response: Awaited<ReturnType<typeof createPassportRequest>>): AccessSuccessBody {
  return {
    ok: true,
    offer,
    request_id: response.request_id,
    vessel_id: response.vessel_id ?? null,
    passport_id: response.passport_id ?? null,
    status: response.status,
    next_step: response.next_step,
  };
}

const ALLOWED_ROLES = new Set(["Broker", "Buyer", "Insurer", "Builder", "Other"]);
const ALLOWED_OFFERS = new Set<OfferKey>(OFFER_LEAD_TYPES);

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { name, email, role, message, offer, hin, passportSlug } = body as Record<
    string,
    unknown
  >;

  if (typeof name !== "string" || name.trim().length < 1) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (typeof role !== "string" || !ALLOWED_ROLES.has(role)) {
    return Response.json({ error: "Select a role." }, { status: 400 });
  }
  if (message !== undefined && typeof message !== "string") {
    return Response.json({ error: "Message must be text." }, { status: 400 });
  }
  if (hin !== undefined && typeof hin !== "string") {
    return Response.json({ error: "HIN must be text." }, { status: 400 });
  }
  if (passportSlug !== undefined && typeof passportSlug !== "string") {
    return Response.json({ error: "Passport slug must be text." }, { status: 400 });
  }

  const offerKey: OfferKey =
    typeof offer === "string" && ALLOWED_OFFERS.has(offer as OfferKey)
      ? (offer as OfferKey)
      : "create";

  try {
    const requestRow = await createPassportRequest({
      name: String(name).trim(),
      email: String(email).trim(),
      role: String(role),
      offer: offerKey,
      message: typeof message === "string" && message.trim() ? message.trim() : undefined,
      hin: typeof hin === "string" ? hin.trim().toUpperCase() : undefined,
      passport_id: typeof passportSlug === "string" && /^[0-9a-f-]{36}$/i.test(passportSlug) ? passportSlug : undefined,
    });

    return Response.json(successBody(offerKey, requestRow), { status: 200 });
  } catch (error) {
    const backendError = error as BackendPostError;
    const status = backendError.status ?? 502;
    const body = backendError.body;
    return Response.json(
      {
        error: responseErrorMessage(body, "Submission failed. Try again."),
        detail: body,
      },
      { status }
    );
  }
}
