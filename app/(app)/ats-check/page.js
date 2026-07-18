"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, FileCheck2, Sparkles, Check } from "lucide-react";
import Card from "@/components/Card";
import ScoreRing from "@/components/ScoreRing";
import { useAppState } from "@/lib/useAppState";

export default function AtsCheckPage() {
  const { state, patch, loading } = useAppState();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [improving, setImproving] = useState(false);
  const [error, setError] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  useEffect(() => {
    if (state) {
      setResumeText(state.resumeText || "");
      setJobDesc(state.jobDesc || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!state]);

  if (loading || !state) return <div className="text-sm text-slate-400 py-10 text-center">Loading...</div>;

  const atsResult = state.atsResult;

  const runCheck = async () => {
    setError(null);
    setChecking(true);
    try {
      const res = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDesc }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await patch({ resumeText, jobDesc, atsResult: data });
    } catch (e) {
      setError(e.message);
    } finally {
      setChecking(false);
    }
  };

  const runImprove = async () => {
    setError(null);
    setImproving(true);
    try {
      const res = await fetch("/api/resume-improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDesc }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await patch({ improved: data });
      router.push("/resume-improve");
    } catch (e) {
      setError(e.message);
    } finally {
      setImproving(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">ATS Resume Check</h1>
      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <Card>
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Your resume text</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={10}
            className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </Card>
        <Card>
          <label className="text-xs font-medium text-slate-500 mb-1.5 block">Target job description</label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={10}
            className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </Card>
      </div>

      <button
        onClick={runCheck}
        disabled={checking || !resumeText.trim() || !jobDesc.trim()}
        className="mb-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-5 py-2.5 flex items-center gap-2"
      >
        {checking ? <Loader2 size={14} className="animate-spin" /> : <FileCheck2 size={14} />}
        {checking ? "Analyzing..." : "Run ATS Check"}
      </button>

      {checking && (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> Scoring your resume against the job description...
        </div>
      )}

      {atsResult && !checking && (
        <Card>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <ScoreRing score={atsResult.score} size={110} />
            <div className="flex-1">
              <h2 className="font-medium">{atsResult.verdict}</h2>
              <p className="text-sm text-slate-500 mt-1">
                {atsResult.matchedSkillsCount} skills matched · {atsResult.missingSkillsCount} missing
              </p>
              <button
                onClick={runImprove}
                disabled={improving}
                className="mt-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center gap-2"
              >
                {improving ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Improve My Resume
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div>
              <h3 className="text-xs font-medium text-slate-500 mb-2">Strengths</h3>
              <ul className="space-y-1.5">
                {atsResult.strengths?.map((s, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <Check size={14} className="text-green-600 mt-0.5 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-medium text-slate-500 mb-2">Improvement areas</h3>
              <ul className="space-y-1.5">
                {atsResult.improvementAreas?.map((s, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {atsResult.missingSkills?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-medium text-slate-500 mb-2">Missing keywords</h3>
              <div className="flex flex-wrap gap-1.5">
                {atsResult.missingSkills.map((s, i) => (
                  <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
