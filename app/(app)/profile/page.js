"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Card from "@/components/Card";
import { useAppState } from "@/lib/useAppState";

export default function ProfilePage() {
  const { state, patch, loading } = useAppState();
  const [resumeText, setResumeText] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (state) setResumeText(state.resumeText || "");
  }, [!!state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !state) return <div className="text-sm text-slate-400 py-10 text-center">Loading...</div>;

  const save = async () => {
    await patch({ resumeText });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Profile</h1>
      <Card>
        <label className="text-xs font-medium text-slate-500 mb-1.5 block">Master resume</label>
        <p className="text-xs text-slate-400 mb-2">
          This is the resume text used across ATS checks, resume improvement, and cover letters.
        </p>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={14}
          className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-3"
        />
        <button onClick={save} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center gap-2">
          {saved ? <Check size={14} /> : null} {saved ? "Saved" : "Save changes"}
        </button>
      </Card>
    </div>
  );
}
