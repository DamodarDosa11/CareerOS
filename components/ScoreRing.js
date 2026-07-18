export default function ScoreRing({ score = 0, size = 96 }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} stroke="#e2e8f0" strokeWidth="9" fill="none" />
      <circle
        cx="50" cy="50" r={r} stroke={color} strokeWidth="9" fill="none"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="47" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f172a">{score}</text>
      <text x="50" y="62" textAnchor="middle" fontSize="9" fill="#94a3b8">/100</text>
    </svg>
  );
}
