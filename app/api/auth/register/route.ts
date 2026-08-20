import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password, phoneNo } = await req.json();

  const existing = await User.findOne({ email });
  if (existing)
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, phoneNo });

  return NextResponse.json(
    { _id: user._id, name: user.name, email: user.email },
    { status: 201 }
  );
}
