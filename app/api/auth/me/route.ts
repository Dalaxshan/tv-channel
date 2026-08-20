import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const payload = verifyToken(token);
    await connectDB();
    const user = await User.findById(payload.id).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
