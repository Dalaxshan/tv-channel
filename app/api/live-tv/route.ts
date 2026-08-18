import { connectDB } from "@/lib/mongodb";
import LiveTv from "@/models/LiveTv";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const docs = await LiveTv.find().sort({ createdAt: -1 });
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  await connectDB();
  const doc = await LiveTv.create(await req.json());
  return NextResponse.json(doc, { status: 201 });
}
