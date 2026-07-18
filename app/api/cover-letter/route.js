import { NextResponse } from "next/server";
import { askClaude } from "@/lib/ai";
import { readDb, writeDb } from "@/lib/db";

export async function POST(req) {
  try {
    const { resumeText, jobDesc, job } = await req.json();
    if (!resumeText?.trim()) {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 });
    }

    const prompt = `Write a concise, genuine-sounding cover letter (150-200 words) for this candidate applying to the role of ${
      job ? job.title + " at " + job.company : "the target role"
    }. Base it on their resume and, if relevant, the job description. No placeholders like [Company Name] — use real details given. Return plain text only, no markdown headers.
RESUME:
"""${resumeText}"""
JOB DESCRIPTION:
"""${jobDesc || ""}"""`;

    const result = await askClaude(prompt);

    const db = readDb();
    const key = job?.id ? String(job.id) : "_general";
    writeDb({ coverLetters: { ...db.coverLetters, [key]: result } });

    return NextResponse.json({ text: result, jobId: key });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
