import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/**
 * Protects:
 *  - /admin-panel/dashboard/**  (pages) -> redirect to /admin-panel/login
 *  - /api/admin/**              (API)   -> 401 JSON response
 *
 * Public admin routes (login page, login/logout API) are excluded.
 * Uses `jose` (not `jsonwebtoken`) because Next.js middleware runs on the
 * Edge runtime, which doesn't support Node's `crypto` module.
 */

const SESSION_COOKIE_NAME = "admin_session";

const PUBLIC_API_ROUTES = ["/api/admin/auth/login", "/api/admin/auth/logout"];

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET ?? "";
  return new TextEncoder().encode(secret);
}

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // --- Admin API routes ---
  if (pathname.startsWith("/api/admin")) {
    if (PUBLIC_API_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }
    const valid = await isValidSession(token);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // --- Admin dashboard pages ---
  if (pathname.startsWith("/admin-panel/dashboard")) {
    const valid = await isValidSession(token);
    if (!valid) {
      const loginUrl = new URL("/admin-panel/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // --- Login page: bounce already-authenticated admins to the dashboard ---
  if (pathname === "/admin-panel/login") {
    const valid = await isValidSession(token);
    if (valid) {
      return NextResponse.redirect(new URL("/admin-panel/dashboard", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-panel/:path*", "/api/admin/:path*"],
};
 