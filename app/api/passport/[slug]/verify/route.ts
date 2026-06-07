import type { NextRequest } from "next/server";
import { getPassportBySlug, isSamplePassportSlug } from "@/lib/passport-data";
import { isUuidLike, verifyPublicPassport } from "@/lib/backend";

type BackendError = Error & {
  status?: number;
  body?: unknown;
};

// UUID slugs proxy the live backend verify endpoint.
// Explicit sample slugs keep the local illustrative verifier.
type VerifyRouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  request: NextRequest,
  ctx: VerifyRouteContext
) {
  const { slug } = await ctx.params;

  if (isUuidLike(slug)) {
    try {
      const body = await verifyPublicPassport(slug);
      return Response.json(
        {
          ...body,
          verified_at: new Date().toISOString(),
        },
        { status: 200 }
      );
    } catch (error) {
      const backendError = error as BackendError;
      const status = backendError.status ?? 502;
      const body =
        backendError.body && typeof backendError.body === "object"
          ? backendError.body
          : { error: backendError.message || "backend_request_failed" };

      return Response.json(body, { status });
    }
  }

  if (!isSamplePassportSlug(slug)) {
    return Response.json({ verified: false, error: "not_found" }, { status: 404 });
  }

  const data = getPassportBySlug(slug);
  if (!data) {
    return Response.json({ verified: false, error: "not_found" }, { status: 404 });
  }
  if (!data.signature) {
    return Response.json({ verified: false, error: "no_signature" }, { status: 200 });
  }

  await new Promise((resolve) => setTimeout(resolve, 450));

  return Response.json(
    {
      passport_id: data._meta.passport_id,
      verified: true,
      status: "certified_active",
      mint_timestamp: data.signature.mint_timestamp,
      signing_key_id: data.signature.signing_key_id,
      signing_key_version: data.signature.signing_key_version,
      algorithm: data.signature.algorithm,
      verified_at: new Date().toISOString(),
      demo_note: "Demonstration response. Real verification ships with Bill's KMS endpoint.",
    },
    { status: 200 }
  );
}
