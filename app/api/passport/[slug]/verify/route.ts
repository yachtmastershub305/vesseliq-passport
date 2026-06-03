import type { NextRequest } from "next/server";
import { getPassportBySlug } from "@/lib/passport-data";
import { isUuidLike, verifyPublicPassport } from "@/lib/backend";

type BackendError = Error & {
  status?: number;
  body?: unknown;
};

// UUID slugs proxy the live backend verify endpoint.
// Demo slugs keep the local illustrative verifier so broker walkthroughs
// can still force positive and negative outcomes.
//
// To demo the negative case, pass ?fail=1 and the response flips to
// verified: false.
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

  const data = getPassportBySlug(slug);

  if (!data) {
    return Response.json({ verified: false, error: "not_found" }, { status: 404 });
  }
  if (!data.signature) {
    return Response.json({ verified: false, error: "no_signature" }, { status: 200 });
  }

  // Slight delay so the UI can show its loading state, the real KMS verify
  // takes a few hundred ms anyway.
  await new Promise((resolve) => setTimeout(resolve, 450));

  const fail = request.nextUrl.searchParams.get("fail") === "1";
  if (fail) {
    return Response.json(
      {
        passport_id: data._meta.passport_id,
        verified: false,
        status: "tampered",
        algorithm: data.signature.algorithm,
        signing_key_id: data.signature.signing_key_id,
        verified_at: new Date().toISOString(),
        demo_note: "Forced failure via ?fail=1, illustrative only.",
      },
      { status: 200 }
    );
  }

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
