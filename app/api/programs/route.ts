import { connectDB } from "@/lib/mongodb";
import Program from "@/models/Programs";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const docs = await Program.find().sort({ createdAt: -1 });
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  await connectDB();
  const doc = await Program.create(await req.json());
  return NextResponse.json(doc, { status: 201 });
}
