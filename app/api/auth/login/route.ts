import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken({ id: user._id, email: user.email });

  const res = NextResponse.json({ _id: user._id, name: user.name, email: user.email, token });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
