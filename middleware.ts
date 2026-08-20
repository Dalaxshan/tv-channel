import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api") || PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("auth_token")?.value;
  const bearer = req.headers.get("authorization")?.replace("Bearer ", "");
  const token = cookie ?? bearer;

  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

export const config = {
  matcher: "/api/:path*",
};
