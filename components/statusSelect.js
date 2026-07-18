"use client";

const STYLES = {
  Applied: "bg-slate-100 text-slate-600 border-slate-200",
  Interviewing: "bg-amber-50 text-amber-700 border-amber-200",
  Offer: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-600 border-red-200",
};

const STATUSES = ["Applied", "Interviewing", "Offer", "Rejected"];

export default function StatusSelect({ status, onChange, disabled }) {
  const style = STYLES[status] || STYLES.Applied;
  return (
    <select
      value={status}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`text-xs font-medium rounded-full border px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${style}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export { STATUSES };