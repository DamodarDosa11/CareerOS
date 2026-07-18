import { NextResponse } from "next/server";
import { askClaude } from "@/lib/ai";
import { writeDb } from "@/lib/db";

export async function POST(req) {
  try {
    const { resumeText, jobDesc } = await req.json();
    if (!resumeText?.trim()) {
      return NextResponse.json({ error: "resumeText is required" }, { status: 400 });
    }

    const prompt = `Rewrite the professional summary and bullet points of this resume to be more quantified, keyword-rich, and tailored to the job description. Keep it truthful to the original content — don't invent employers or numbers that aren't implied. Return ONLY valid JSON, no markdown:
{
  "summaryBefore": "<original summary, 1-2 sentences>",
  "summaryAfter": "<improved summary, 2-3 sentences>",
  "bulletsAfter": ["<improved bullet 1>", "<improved bullet 2>", "<improved bullet 3>"]
}
RESUME:
"""${resumeText}"""
JOB DESCRIPTION:
"""${jobDesc || "General software engineering role"}"""`;

    const result = await askClaude(prompt, { json: true });
    writeDb({ improved: result });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
