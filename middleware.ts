// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const MAINTENANCE_API = process.env.MAINTENANCE_API!;

// routes requiring auth
const AUTH_ROUTES = ["/checkout", "/account"];

// allowed even in maintenance
const MAINTENANCE_ALLOWLIST = [
  "/maintenance",
  "/api",
  "/_next",
  "/favicon.ico",
];

async function isMaintenanceMode() {
  const res = await fetch(MAINTENANCE_API, {
    next: { revalidate: 60 }, // 🔥 cached for 1 minute
  });

  if (!res.ok) return false;

  const data = await res.json();
  return data.maintenance === true;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* ---------- MAINTENANCE CHECK ---------- */
  if (!MAINTENANCE_ALLOWLIST.some(p => pathname.startsWith(p))) {
    const maintenance = await isMaintenanceMode();

    if (maintenance) {
      return NextResponse.redirect(
        new URL("/maintenance", req.url)
      );
    }
  }

  /* ---------- AUTH CHECK ---------- */
  if (AUTH_ROUTES.some(p => pathname.startsWith(p))) {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/checkout/login", req.url)
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.redirect(
        new URL("/checkout/login", req.url)
      );
    }
  }

  return NextResponse.next();
}
