"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Loader2, ChevronRight } from "lucide-react";
import Card from "@/components/Card";
import { useAppState } from "@/lib/useAppState";

export default function ResumeImprovePage() {
  const { state, patch, loading } = useAppState();
  const router = useRouter();
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);

  if (loading || !state) return <div className="text-sm text-slate-400 py-10 text-center">Loading...</div>;

  const improved = state.improved;

  const regenerate = async () => {
    setError(null);
    setRegenerating(true);
    try {
      const res = await fetch("/api/resume-improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: state.resumeText, jobDesc: state.jobDesc }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await patch({ improved: data });
    } catch (e) {
      setError(e.message);
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div>
      <button onClick={() => router.push("/ats-check")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-3">
        <ArrowLeft size={14} /> Back to ATS check
      </button>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">AI Resume Improvement</h1>
        <button onClick={regenerate} disabled={regenerating} className="text-sm text-indigo-600 flex items-center gap-1.5 disabled:opacity-50">
          {regenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Regenerate
        </button>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}

      {!improved && !regenerating && (
        <Card className="text-center text-sm text-slate-400 py-10">
          Run an ATS check first, then click &quot;Improve My Resume&quot;.
        </Card>
      )}

      {regenerating && (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> Rewriting your resume...
        </div>
      )}

      {improved && !regenerating && (
        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <h3 className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Before</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{improved.summaryBefore}</p>
          </Card>
          <Card className="border-indigo-200 bg-indigo-50/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Improved</h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">AI Optimized</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{improved.summaryAfter}</p>
            {improved.bulletsAfter?.length > 0 && (
              <ul className="space-y-1.5">
                {improved.bulletsAfter.map((b, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <ChevronRight size={13} className="text-indigo-500 mt-1 shrink-0" />{b}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
