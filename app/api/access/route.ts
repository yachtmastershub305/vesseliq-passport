import type { NextRequest } from "next/server";
import { OFFER_LEAD_TYPES, type OfferKey } from "@/lib/pricing";

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

  const { name, email, role, message, offer } = body as Record<string, unknown>;

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

  const offerKey: OfferKey =
    typeof offer === "string" && ALLOWED_OFFERS.has(offer as OfferKey)
      ? (offer as OfferKey)
      : "create";

  console.log("[access-request]", {
    received_at: new Date().toISOString(),
    offer: offerKey,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    message_length: typeof message === "string" ? message.length : 0,
  });

  return Response.json({ ok: true, offer: offerKey }, { status: 200 });
}
