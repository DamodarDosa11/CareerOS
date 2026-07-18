import { NextResponse } from "next/server";
import { askClaude } from "@/lib/ai";
import { readDb, writeDb } from "@/lib/db";

export async function POST(req) {
  try {
    const { resumeText, jobDesc, job } = await req.json();
    if (!resumeText?.trim()) {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 });
    }

    const roleLine = job ? `${job.title} at ${job.company}` : "the target role";

    const prompt = `You are an experienced technical interviewer preparing a candidate for an
upcoming interview for ${roleLine}. Using their resume and (if given) the job
description, generate a realistic interview prep sheet.

Return ONLY valid JSON, no markdown, no preamble, with this exact shape:
{
  "questions": [
    {
      "category": "<one of: Behavioral, Technical, Role-specific, Culture Fit>",
      "question": "<the interview question>",
      "tip": "<one short, concrete tip on how to answer it well, referencing the candidate's background where relevant>"
    }
  ]
}
Generate exactly 8 questions: 2 Behavioral, 3 Technical, 2 Role-specific, 1 Culture Fit.
Base the Technical and Role-specific questions on the actual skills/experience in the resume
and on the job description if provided.

RESUME:
"""${resumeText}"""
JOB DESCRIPTION:
"""${jobDesc || "Not provided"}"""`;

    const result = await askClaude(prompt, { json: true });

    const db = readDb();
    const key = job?.id ? String(job.id) : "_general";
    writeDb({ interviewQuestions: { ...db.interviewQuestions, [key]: result } });

    return NextResponse.json({ ...result, jobId: key });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}