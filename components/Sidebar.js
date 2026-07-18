"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Search, FileCheck2, FileText, ListChecks, User,
  Settings, LogOut, Sparkles, MessageSquareText,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/job-search", label: "Job Search", icon: Search },
  { href: "/ats-check", label: "ATS Resume Check", icon: FileCheck2 },
  { href: "/applications", label: "Applications", icon: ListChecks },
  { href: "/cover-letter", label: "AI Cover Letter", icon: FileText },
  { href: "/interview-prep", label: "Interview Prep", icon: MessageSquareText },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex-col hidden md:flex">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Sparkles size={15} className="text-white" />
        </div>
        <span className="font-semibold text-[15px] tracking-tight">CareerOS</span>
      </div>
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-slate-100 space-y-0.5">
        <Link href="/profile" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          <Settings size={16} /> Settings
        </Link>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}