import { NextResponse, type NextRequest } from "next/server";

// Demo entry point. Returns a server side 307 to the guided tour at
// step 1, so the broker walks through the narrative end to end.
//
// Using a Route Handler so the redirect is a proper HTTP 307 with an
// absolute Location header.
//
// Share /demo as the public broker link.
export function GET(request: NextRequest) {
  const destination = new URL("/demo/tour?step=1", request.nextUrl.origin);
  return NextResponse.redirect(destination, { status: 307 });
}
