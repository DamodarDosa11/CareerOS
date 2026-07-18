"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, CalendarClock, MessageSquareText } from "lucide-react";
import Card from "@/components/Card";
import StatusSelect, { STATUSES } from "@/components/StatusSelect";
import { useAppState } from "@/lib/useAppState";

export default function ApplicationsPage() {
  const { state, patch, loading } = useAppState();
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  if (loading || !state) return <div className="text-sm text-slate-400 py-10 text-center">Loading...</div>;

  const applications = state.applications || [];

  const updateStatus = async (id, status) => {
    setError(null);
    setUpdatingId(id);
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await patch({ applications: data });
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Applications</h1>
        <span className="text-xs text-slate-400">{applications.length} total</span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
      )}

      {applications.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400 text-center py-8">
            You haven&apos;t applied to anything yet. Head to Job Search to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {STATUSES.map((status) => {
            const columnApps = applications.filter((a) => (a.status || "Applied") === status);
            return (
              <div key={status} className="min-w-0">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{status}</h2>
                  <span className="text-xs text-slate-400">{columnApps.length}</span>
                </div>
                <div className="space-y-2">
                  {columnApps.map((a) => (
                    <Card key={a.id} className="p-3.5">
                      <div className="flex items-start gap-2 mb-2">
                        <Briefcase size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{a.title}</div>
                          <div className="text-xs text-slate-400 truncate">
                            {a.company} · {a.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2.5">
                        <CalendarClock size={12} /> Applied {new Date(a.appliedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <StatusSelect
                          status={a.status || "Applied"}
                          disabled={updatingId === a.id}
                          onChange={(next) => updateStatus(a.id, next)}
                        />
                        <button
                          onClick={() => router.push(`/interview-prep?jobId=${a.id}`)}
                          className="text-slate-400 hover:text-indigo-600 shrink-0"
                          title="Prep interview questions"
                        >
                          <MessageSquareText size={15} />
                        </button>
                      </div>
                    </Card>
                  ))}
                  {columnApps.length === 0 && (
                    <div className="text-xs text-slate-300 text-center py-6 border border-dashed border-slate-200 rounded-xl">
                      No applications
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}