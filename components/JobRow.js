"use client";
import { Loader2 } from "lucide-react";

export default function JobRow({ job, applied, onApply, onCover, coverLoading }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-xl">{job.logo}</div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{job.title}</div>
          <div className="text-xs text-slate-400">{job.company} · {job.location}</div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold text-green-600">{job.match}%</span>
        <button onClick={onCover} disabled={coverLoading} className="text-xs text-indigo-600 hover:underline disabled:opacity-50 flex items-center gap-1">
          {coverLoading && <Loader2 size={12} className="animate-spin" />} Cover letter
        </button>
        <button
          onClick={onApply}
          disabled={applied}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium ${applied ? "bg-green-50 text-green-700" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
        >
          {applied ? "Applied ✓" : "Apply"}
        </button>
      </div>
    </div>
  );
}
