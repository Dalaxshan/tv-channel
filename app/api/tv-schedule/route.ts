import { connectDB } from "@/lib/mongodb";
import TvSchedule from "@/models/TvSchedule";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const docs = await TvSchedule.find().sort({ dateTime: 1 });
  return NextResponse.json(docs);
}

export async function POST(req: Request) {
  await connectDB();
  const doc = await TvSchedule.create(await req.json());
  return NextResponse.json(doc, { status: 201 });
}
