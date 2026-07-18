import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.applications);
}

export async function POST(req) {
  const job = await req.json();
  const db = readDb();
  if (db.applications.some((a) => a.id === job.id)) {
    return NextResponse.json(db.applications);
  }
  const next = [...db.applications, { ...job, appliedAt: new Date().toISOString() }];
  writeDb({ applications: next });
  return NextResponse.json(next);
}
