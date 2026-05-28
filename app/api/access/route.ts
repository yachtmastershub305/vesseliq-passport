import type { NextRequest } from "next/server";

const ALLOWED_ROLES = new Set(["Broker", "Buyer", "Insurer", "Builder", "Other"]);

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

  const { name, email, role, message } = body as Record<string, unknown>;

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

  console.log("[access-request]", {
    received_at: new Date().toISOString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    message_length: typeof message === "string" ? message.length : 0,
  });

  return Response.json({ ok: true }, { status: 200 });
}
