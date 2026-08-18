import { connectDB } from "@/lib/mongodb";
import HomeHero from "@/models/HomeHero";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await HomeHero.findById(params.id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await HomeHero.findByIdAndUpdate(params.id, await req.json(), { new: true, runValidators: true });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const doc = await HomeHero.findByIdAndDelete(params.id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
