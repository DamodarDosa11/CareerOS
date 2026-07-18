"use client";
import { useState } from "react";
import { RefreshCw, Loader2, Check, Copy } from "lucide-react";
import Card from "@/components/Card";
import { useAppState } from "@/lib/useAppState";

export default function CoverLetterPage() {
  const { state, patch, loading } = useAppState();
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  if (loading || !state) return <div className="text-sm text-slate-400 py-10 text-center">Loading...</div>;

  const letters = state.coverLetters || {};
  const latestKey = Object.keys(letters).slice(-1)[0];
  const text = latestKey ? letters[latestKey] : "";

  const regenerate = async () => {
    setError(null);
    setRegenerating(true);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: state.resumeText, jobDesc: state.jobDesc, job: null }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await patch({ coverLetters: { ...letters, _general: data.text } });
    } catch (e) {
      setError(e.message);
    } finally {
      setRegenerating(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">AI Cover Letter Generator</h1>
        <button onClick={regenerate} disabled={regenerating} className="text-sm text-indigo-600 flex items-center gap-1.5 disabled:opacity-50">
          {regenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Regenerate
        </button>
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>}

      {regenerating && (
        <div className="flex items-center gap-2 text-sm text-slate-500 py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> Writing your cover letter...
        </div>
      )}

      {text && !regenerating && (
        <Card>
          <div className="mb-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
            <Check size={15} /> Cover letter generated successfully!
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 mb-4">{text}</div>
          <button onClick={copy} className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50">
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
          </button>
        </Card>
      )}

      {!text && !regenerating && (
        <Card className="text-center text-sm text-slate-400 py-10">
          Generate a cover letter from a job on the Dashboard or Job Search page.
        </Card>
      )}
    </div>
  );
}
