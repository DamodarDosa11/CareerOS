"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import JobRow from "@/components/JobRow";
import { useAppState } from "@/lib/useAppState";
import { MOCK_JOBS } from "@/data/mockJobs";

export default function JobSearchPage() {
  const { state, patch, loading } = useAppState();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [coverLoadingId, setCoverLoadingId] = useState(null);
  const [error, setError] = useState(null);

  if (loading || !state) return <div className="text-sm text-slate-400 py-10 text-center">Loading...</div>;

  const applications = state.applications || [];
  const filtered = MOCK_JOBS.filter((j) =>
    (j.title + j.company).toLowerCase().includes(query.toLowerCase())
  );

  const applyToJob = async (job) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    const nextApplications = await res.json();
    await patch({ applications: nextApplications });
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

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Job Search</h1>
      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}
      <div className="flex gap-2 mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search job title, skills or company"
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg font-medium">Search</button>
      </div>
      <Card>
        <div className="space-y-1">
          {filtered.map((j) => (
            <JobRow
              key={j.id}
              job={j}
              applied={applications.some((a) => a.id === j.id)}
              onApply={() => applyToJob(j)}
              onCover={() => generateCoverLetter(j)}
              coverLoading={coverLoadingId === j.id}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 py-6 text-center">No jobs match &quot;{query}&quot;.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
