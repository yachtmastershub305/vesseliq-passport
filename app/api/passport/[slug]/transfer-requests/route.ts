import type { NextRequest } from "next/server";
import { isUuidLike, createTransferRequest, type BackendPostError } from "@/lib/backend";

function responseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const candidate = (body as { detail?: unknown; error?: unknown }).detail ?? (body as { error?: unknown }).error;
  if (typeof candidate === "string" && candidate.trim()) return candidate;
  return fallback;
}

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: NextRequest, ctx: RouteContext) {
  const { slug } = await ctx.params;
  if (!isUuidLike(slug)) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { requester_name, requester_email, message } = body as Record<string, unknown>;

  if (typeof requester_name !== "string" || requester_name.trim().length < 1) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof requester_email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requester_email)) {
    return Response.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (message !== undefined && typeof message !== "string") {
    return Response.json({ error: "Message must be text." }, { status: 400 });
  }

  try {
    const created = await createTransferRequest(slug, {
      requester_name: requester_name.trim(),
      requester_email: requester_email.trim().toLowerCase(),
      message: typeof message === "string" && message.trim() ? message.trim() : undefined,
    });
    return Response.json(created, { status: 201 });
  } catch (error) {
    const backendError = error as BackendPostError;
    const status = backendError.status ?? 502;
    return Response.json(
      {
        error: responseErrorMessage(backendError.body, "Submission failed. Try again."),
        detail: backendError.body,
      },
      { status }
    );
  }
}
