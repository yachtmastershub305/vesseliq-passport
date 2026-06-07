import type { NextRequest } from "next/server";
import { OFFER_LEAD_TYPES, type OfferKey } from "@/lib/pricing";
import { startOnboardingSession, type BackendPostError } from "@/lib/backend";

const PASSPORT_ACCESS_USER_ID = "00000000-0000-0000-0000-000000000001";

type AccessSuccessBody = {
  ok: true;
  offer: OfferKey;
  session_id: string;
  vessel_id: string | null;
  state: string;
  status: string | null;
};

function responseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const candidate = (body as { detail?: unknown; error?: unknown }).detail ?? (body as { error?: unknown }).error;
  if (typeof candidate === "string" && candidate.trim()) return candidate;
  return fallback;
}

function buildOnboardingPayload(input: {
  hin?: string;
  message?: string;
  passportSlug?: string;
}) {
  const text = input.message?.trim() ?? "";
  const lines = [
    text,
    input.passportSlug ? `passport_reference=${input.passportSlug}` : "",
  ].filter(Boolean);

  return {
    hin: input.hin?.trim() || undefined,
    builder: undefined,
    make: undefined,
    model: lines.length ? lines.join("\n") : undefined,
    imo_number: undefined,
    user_id: PASSPORT_ACCESS_USER_ID,
  };
}

function successBody(offer: OfferKey, response: Awaited<ReturnType<typeof startOnboardingSession>>): AccessSuccessBody {
  return {
    ok: true,
    offer,
    session_id: response.session_id,
    vessel_id: response.vessel_id ?? null,
    state: response.state,
    status: response.status ?? null,
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
    const onboarding = await startOnboardingSession(
      buildOnboardingPayload({
        hin: typeof hin === "string" ? hin.trim().toUpperCase() : undefined,
        message: typeof message === "string" ? message : undefined,
        passportSlug: typeof passportSlug === "string" ? passportSlug : undefined,
      })
    );

    return Response.json(successBody(offerKey, onboarding), { status: 200 });
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
