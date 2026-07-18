import Link from "next/link";
import { Search, FileCheck2, FileText, ListChecks, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: Search, title: "AI Job Search", desc: "Find relevant jobs from multiple sources" },
  { icon: FileCheck2, title: "ATS Resume Check", desc: "Improve your resume and beat ATS" },
  { icon: FileText, title: "AI Cover Letter", desc: "Generate personalized cover letters" },
  { icon: ListChecks, title: "Application Tracker", desc: "Track and manage all your applications" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-semibold tracking-tight">CareerOS</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <span>Features</span>
          <span>How it Works</span>
          <span>Pricing</span>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-slate-600">Log in</Link>
          <Link href="/dashboard" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2">
            Sign up
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full px-3 py-1 mb-5">
          AI Powered Career Copilot
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl mx-auto">
          Find Jobs. Improve Your Resume. Get Hired Faster{" "}
          <span className="text-indigo-600">with AI.</span>
        </h1>
        <p className="text-slate-500 mt-4 max-w-xl mx-auto">
          All the tools you need to land your dream job in one smart platform.
        </p>
        <div className="flex items-center justify-center gap-3 mt-7">
          <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-5 py-3 text-sm">
            Get Started for Free
          </Link>
          <Link href="/ats-check" className="border border-slate-200 rounded-lg px-5 py-3 text-sm font-medium text-slate-700">
            See How It Works
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-center font-medium text-lg mb-8">Everything you need to get hired</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="text-center">
                <div className="w-11 h-11 mx-auto rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                  <Icon size={19} className="text-indigo-600" />
                </div>
                <div className="text-sm font-medium">{f.title}</div>
                <div className="text-xs text-slate-400 mt-1">{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-indigo-600 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold text-lg">Ready to accelerate your career?</h3>
            <p className="text-indigo-100 text-sm mt-1">Join thousands of job seekers using AI to get hired faster.</p>
          </div>
          <Link href="/dashboard" className="bg-white text-indigo-600 font-medium rounded-lg px-5 py-3 text-sm shrink-0">
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
