"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, Loader2, MessageSquareText, Lightbulb } from "lucide-react";
import Card from "@/components/Card";
import { useAppState } from "@/lib/useAppState";

const CATEGORY_STYLES = {
  Behavioral: "bg-indigo-50 text-indigo-700",
  Technical: "bg-blue-50 text-blue-700",
  "Role-specific": "bg-violet-50 text-violet-700",
  "Culture Fit": "bg-emerald-50 text-emerald-700",
};

function InterviewPrepInner() {
  const { state, patch, loading } = useAppState();
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const [selectedId, setSelectedId] = useState(jobIdParam || "_general");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobIdParam) setSelectedId(jobIdParam);
  }, [jobIdParam]);

  if (loading || !state) return <div className="text-sm text-slate-400 py-10 text-center">Loading...</div>;

  const applications = state.applications || [];
  const questionsMap = state.interviewQuestions || {};
  const selectedJob = applications.find((a) => String(a.id) === String(selectedId));
  const result = questionsMap[String(selectedId)];

  const generate = async () => {
    setError(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: state.resumeText,
          jobDesc: state.jobDesc,
          job: selectedJob || null,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await patch({ interviewQuestions: { ...questionsMap, [String(selectedId)]: data } });
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold">AI Interview Prep</h1>
      </div>
      <p className="text-slate-500 text-sm mb-5">
        Get realistic questions tailored to your resume and a specific job, with tips on how to answer.
      </p>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}

      <Card className="mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <label className="text-xs text-slate-400 mb-1 block">Prep for</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="_general">General (my resume + saved job description)</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} · {a.company}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={generate}
            disabled={generating}
            className="shrink-0 self-end sm:self-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2.5 flex items-center justify-center gap-2"
          >
            {generating ? <Loader2 size={14} className="animate-spin" /> : result ? <RefreshCw size={14} /> : <MessageSquareText size={14} />}
            {result ? "Regenerate" : "Generate Questions"}
          </button>
        </div>
      </Card>

      {generating && (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> Preparing your interview questions...
        </div>
      )}

      {!result && !generating && (
        <Card className="text-center text-sm text-slate-400 py-10">
          No questions yet — pick a job above and click &quot;Generate Questions&quot;.
        </Card>
      )}

      {result && !generating && (
        <div className="space-y-3">
          {result.questions?.map((q, i) => (
            <Card key={i}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm font-medium text-slate-800 leading-snug">{q.question}</p>
                <span
                  className={`shrink-0 text-[10px] font-medium px-2 py-1 rounded-full ${
                    CATEGORY_STYLES[q.category] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {q.category}
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                <Lightbulb size={13} className="text-amber-500 mt-0.5 shrink-0" />
                <span>{q.tip}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InterviewPrepPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-400 py-10 text-center">Loading...</div>}>
      <InterviewPrepInner />
    </Suspense>
  );
}