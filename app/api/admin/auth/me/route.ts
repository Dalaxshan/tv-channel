import { getServerSession } from "@/lib/auth/session";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);
  return apiSuccess(session);
}
