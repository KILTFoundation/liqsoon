import { NextResponse } from "next/server";

const BLOCKED_COUNTRIES = ["NG", "RU"]; // Example: Nigeria, Russia (ISO 3166-1 alpha-2 codes)

export function middleware(req) {
  const country = req.geo?.country || "Unknown";
  if (BLOCKED_COUNTRIES.includes(country)) {
    return new NextResponse("Access restricted in your region.", { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/", // Apply to all routes, or specify paths like "/migration"
};
