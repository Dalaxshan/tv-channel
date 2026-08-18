import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const docs = await News.find().sort({ createdAt: -1 });
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  await connectDB();
  const doc = await News.create(await req.json());
  return NextResponse.json(doc, { status: 201 });
}
