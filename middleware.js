import { NextResponse } from "next/server";

const BLOCKED_COUNTRIES = ["US"]; // Blocks USA

export function middleware(req) {
  const country = req.geo?.country || "Unknown";
  if (BLOCKED_COUNTRIES.includes(country)) {
    return NextResponse.redirect(new URL("/blocked", req.url)); // Redirect to /blocked
  }
  return NextResponse.next(); // Proceed if not blocked
}

export const config = {
  matcher: "/", // Applies to the root page
};
