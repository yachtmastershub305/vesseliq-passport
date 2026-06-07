import { fetchTransferRequest, isUuidLike } from "@/lib/backend";

function responseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const candidate = (body as { detail?: unknown; error?: unknown }).detail ?? (body as { error?: unknown }).error;
  if (typeof candidate === "string" && candidate.trim()) return candidate;
  return fallback;
}

type RouteContext = {
  params: Promise<{ slug: string; requestId: string }>;
};

export async function GET(_: Request, ctx: RouteContext) {
  const { slug, requestId } = await ctx.params;
  if (!isUuidLike(slug) || !isUuidLike(requestId)) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const body = await fetchTransferRequest(slug, requestId);
    return Response.json(body, { status: 200 });
  } catch (error) {
    const backendError = error as { status?: number; body?: unknown };
    return Response.json(
      {
        error: responseErrorMessage(backendError.body, "Request lookup failed."),
        detail: backendError.body,
      },
      { status: backendError.status ?? 502 }
    );
  }
}
