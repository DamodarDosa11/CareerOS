"use client";
import { Briefcase, CalendarClock } from "lucide-react";
import Card from "@/components/Card";
import { useAppState } from "@/lib/useAppState";

export default function ApplicationsPage() {
  const { state, loading } = useAppState();
  if (loading || !state) return <div className="text-sm text-slate-400 py-10 text-center">Loading...</div>;

  const applications = state.applications || [];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Applications</h1>
      <Card>
        {applications.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            You haven&apos;t applied to anything yet. Head to Job Search to get started.
          </p>
        ) : (
          <div className="space-y-1">
            {applications.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Briefcase size={16} className="text-slate-400" />
                  <div>
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-slate-400">{a.company} · {a.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CalendarClock size={13} /> {new Date(a.appliedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
