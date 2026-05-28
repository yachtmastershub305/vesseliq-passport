import type { NextRequest } from "next/server";
import { getPassportBySlug } from "@/lib/passport-data";

// Demo verifier. Always returns verified for the sample so the broker
// can see the green check. When Bill's real GET /api/v1/passports/public/
// {passport_id}/verify endpoint ships, swap the body here for a fetch.
//
// To demo the negative case, pass ?fail=1 and the response flips to
// verified: false.
export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/passport/[slug]/verify">
) {
  const { slug } = await ctx.params;
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
