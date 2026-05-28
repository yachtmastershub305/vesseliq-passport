import { NextResponse, type NextRequest } from "next/server";

// Demo entry point. Returns a server side 307 to the sample Passport in
// transfer pending state with the demo flag on, so the broker sees the
// transfer progress banner immediately without needing to know any URL
// params.
//
// Using a Route Handler instead of a page so the redirect is a proper HTTP
// 307 with an absolute Location header, not a meta refresh that can get
// confused about its base URL.
//
// Share /demo as the public broker link.
export function GET(request: NextRequest) {
  const destination = new URL(
    "/passport/bruce-wayne?view=transfer&demo=1",
    request.nextUrl.origin
  );
  return NextResponse.redirect(destination, { status: 307 });
}
