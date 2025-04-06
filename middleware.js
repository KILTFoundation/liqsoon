import { NextResponse } from "next/server";

const BLOCKED_COUNTRIES = ["US"]; // Blocks USA

export function middleware(req) {
  const country = req.geo?.country || "Unknown"; // Vercel provides this as "US" for USA
  if (BLOCKED_COUNTRIES.includes(country)) {
    return new NextResponse("Sorry, this migration portal is not available in your region.", {
      status: 403,
    });
  }
  return NextResponse.next(); // Proceed if not blocked
}

export const config = {
  matcher: "/", // Applies to the root page (your migration portal)
};
