"use client";
import { Bell } from "lucide-react";

export default function TopBar() {
  return (
    <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 md:px-8">
      <div className="md:hidden font-semibold">CareerOS</div>
      <div className="hidden md:block text-sm text-slate-500">Welcome back, Damodara 👋</div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-500">
          <Bell size={17} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500" />
      </div>
    </div>
  );
}
