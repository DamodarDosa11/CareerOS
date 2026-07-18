"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, TrendingUp } from "lucide-react";
import Card from "@/components/Card";
import ScoreRing from "@/components/ScoreRing";
import JobRow from "@/components/JobRow";
import { useAppState } from "@/lib/useAppState";
import { MOCK_JOBS } from "@/data/mockJobs";

export default function DashboardPage() {
  const { state, patch, loading } = useAppState();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [coverLoadingId, setCoverLoadingId] = useState(null);
  const [error, setError] = useState(null);

  if (loading || !state) {
    return <div className="text-sm text-slate-400 py-10 text-center">Loading...</div>;
  }

  const runAtsCheck = async () => {
    setError(null);
    setChecking(true);
    try {
      const res = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: state.resumeText, jobDesc: state.jobDesc }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await patch({ atsResult: data });
      router.push("/ats-check");
    } catch (e) {
      setError(e.message);
    } finally {
      setChecking(false);
    }
  };

  const applyToJob = async (job) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    const applications = await res.json();
    await patch({ applications });
  };

  const generateCoverLetter = async (job) => {
    setError(null);
    setCoverLoadingId(job.id);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: state.resumeText, jobDesc: state.jobDesc, job }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await patch({ coverLetters: { ...state.coverLetters, [job.id]: data.text } });
      router.push("/cover-letter");
    } catch (e) {
      setError(e.message);
    } finally {
      setCoverLoadingId(null);
    }
  };

  const applications = state.applications || [];
  const atsResult = state.atsResult;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Welcome back, Damodara 👋</h1>
      <p className="text-slate-500 text-sm mb-6">Let's make progress on your career today.</p>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-xs text-slate-400 mb-1">Resume Score</div>
          <div className="text-2xl font-semibold">{atsResult?.score ?? "—"}</div>
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> {atsResult ? atsResult.verdict : "Run a check"}
          </div>
        </Card>
        <Card>
          <div className="text-xs text-slate-400 mb-1">Jobs Matched</div>
          <div className="text-2xl font-semibold">128</div>
          <div className="text-xs text-indigo-600 mt-1">View jobs</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-400 mb-1">Applications</div>
          <div className="text-2xl font-semibold">{applications.length}</div>
          <div className="text-xs text-indigo-600 mt-1">Track now</div>
        </Card>
        <Card>
          <div className="text-xs text-slate-400 mb-1">Interviews</div>
          <div className="text-2xl font-semibold">0</div>
          <div className="text-xs text-slate-400 mt-1">Upcoming</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Card className="md:col-span-2">
          <h2 className="font-medium text-sm mb-3">Recommended for you</h2>
          <div className="space-y-1">
            {MOCK_JOBS.slice(0, 3).map((j) => (
              <JobRow
                key={j.id}
                job={j}
                applied={applications.some((a) => a.id === j.id)}
                onApply={() => applyToJob(j)}
                onCover={() => generateCoverLetter(j)}
                coverLoading={coverLoadingId === j.id}
              />
            ))}
          </div>
        </Card>
        <Card className="flex flex-col items-center text-center">
          <h2 className="font-medium text-sm self-start mb-2">Improve your resume</h2>
          <ScoreRing score={atsResult?.score ?? 0} />
          <p className="text-xs text-slate-500 mt-2 mb-4">
            {atsResult ? "Increase your score further." : "Run an ATS check to see your score."}
          </p>
          <button
            onClick={runAtsCheck}
            disabled={checking}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg py-2.5 flex items-center justify-center gap-2"
          >
            {checking ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {atsResult ? "Re-check Resume" : "Check My Resume"}
          </button>
        </Card>
      </div>
    </div>
  );
}
