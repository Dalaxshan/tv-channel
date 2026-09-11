import { NextRequest } from "next/server";
import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { verifyPassword } from "@/lib/auth/password";
import { signSessionToken, setSessionCookie } from "@/lib/auth/session";
import { loginSchema, flattenZodError } from "@/lib/validation/admin";
import { apiSuccess, apiError } from "@/lib/api-response";
import type { AdminDocument, AdminSession } from "@/types/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiError("Invalid request body", 400);

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Please fix the errors below", 422, flattenZodError(parsed.error));
    }

    await ensureIndexes();
    const db = await getDb();
    const admin = await db
      .collection<AdminDocument>(COLLECTIONS.admins)
      .findOne({ email: parsed.data.email.toLowerCase() });

    // Use a generic message so we don't leak whether the email exists.
    const genericError = "Invalid email or password";
    if (!admin) return apiError(genericError, 401);

    const passwordValid = await verifyPassword(parsed.data.password, admin.passwordHash);
    if (!passwordValid) return apiError(genericError, 401);

    const session: AdminSession = {
      id: admin._id!.toString(),
      email: admin.email,
      name: admin.name,
    };

    const token = await signSessionToken(session);
    await setSessionCookie(token);

    return apiSuccess(session);
  } catch (error) {
    console.error("Login error:", error);
    return apiError("Something went wrong. Please try again.", 500);
  }
}
