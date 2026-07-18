import { NextResponse } from "next/server";
import { askClaude } from "@/lib/ai";
import { writeDb } from "@/lib/db";

export async function POST(req) {
  try {
    const { resumeText, jobDesc } = await req.json();
    if (!resumeText?.trim() || !jobDesc?.trim()) {
      return NextResponse.json({ error: "resumeText and jobDesc are required" }, { status: 400 });
    }

    const prompt = `You are an ATS (Applicant Tracking System) resume scoring engine.
Given the RESUME and JOB DESCRIPTION below, return ONLY valid JSON, no markdown, no preamble, with this exact shape:
{
  "score": <integer 0-100>,
  "verdict": "<one short phrase like 'Good, but can be better!'>",
  "strengths": ["...", "...", "..."],
  "improvementAreas": ["...", "...", "..."],
  "matchedSkillsCount": <integer>,
  "missingSkillsCount": <integer>,
  "missingSkills": ["...", "..."]
}
RESUME:
"""${resumeText}"""
JOB DESCRIPTION:
"""${jobDesc}"""`;

    const result = await askClaude(prompt, { json: true });
    writeDb({ resumeText, jobDesc, atsResult: result });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
