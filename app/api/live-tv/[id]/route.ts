import { connectDB } from "@/lib/mongodb";
import LiveTv from "@/models/LiveTv";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await LiveTv.findById(params.id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await LiveTv.findByIdAndUpdate(params.id, await req.json(), { new: true, runValidators: true });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await LiveTv.findByIdAndDelete(params.id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
