import { NextResponse } from "next/server";
import { readDb, writeDb, APPLICATION_STATUSES } from "@/lib/db";

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
  const next = [
    ...db.applications,
    { ...job, status: "Applied", appliedAt: new Date().toISOString(), statusUpdatedAt: new Date().toISOString() },
  ];
  writeDb({ applications: next });
  return NextResponse.json(next);
}

// PATCH { id, status } → move an application to a new stage of the pipeline
// (Applied / Interviewing / Offer / Rejected). Used by the Kanban board on
// the Applications page.
export async function PATCH(req) {
  const { id, status } = await req.json();
  if (id === undefined || id === null) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  if (!APPLICATION_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${APPLICATION_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }
  const db = readDb();
  let found = false;
  const next = db.applications.map((a) => {
    if (a.id === id) {
      found = true;
      return { ...a, status, statusUpdatedAt: new Date().toISOString() };
    }
    return a;
  });
  if (!found) {
    return NextResponse.json({ error: "application not found" }, { status: 404 });
  }
  writeDb({ applications: next });
  return NextResponse.json(next);
}