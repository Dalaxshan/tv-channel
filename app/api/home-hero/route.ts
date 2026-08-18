import { connectDB } from "@/lib/mongodb";
import HomeHero from "@/models/HomeHero";

import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const posts = await HomeHero.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(posts);
}

export async function POST() {
  await connectDB();
  const body = await req.json();
  const post = await HomeHero.create(body);
  return NextResponse.json(post, { status: 201 });
}