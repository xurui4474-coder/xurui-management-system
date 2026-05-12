export default function ProgressBar({ value }) {
  const percent = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div className="flex min-w-32 items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/72">
        <div className="h-full rounded-full bg-gradient-to-r from-sage to-steel" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-semibold text-ink">{percent}%</span>
    </div>
  );
}
