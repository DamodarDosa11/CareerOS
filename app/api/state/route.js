import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function GET() {
  return NextResponse.json(readDb());
}

export async function PATCH(req) {
  const body = await req.json();
  const next = writeDb(body);
  return NextResponse.json(next);
}
