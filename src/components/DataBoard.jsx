import { exportToCsv } from "../utils/csv";
import PageHeader from "./PageHeader";
import ProgressBar from "./ProgressBar";

export default function DataBoard({ metrics, onUpdateMetric }) {
  const update = (id, field, value) => {
    const current = metrics.find((item) => item.id === id);
    if (!current) return;
    onUpdateMetric({ ...current, [field]: field === "channel" ? value : Number(value) });
  };

  return (
    <section>
      <PageHeader title="数据看板" subtitle="用于老板汇报的核心经营指标，可后续替换为数据库或 BI 数据源" onExport={() => exportToCsv("数据看板.csv", metrics)} />
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((item) => (
          <div key={item.id} className="rounded-lg border border-line bg-paper p-4 shadow-soft">
            <input className="table-input text-base font-bold" value={item.channel} onChange={(event) => update(item.id, "channel", event.target.value)} />
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <MetricInput label="Sales" value={item.sales} onChange={(value) => update(item.id, "sales", value)} />
              <MetricInput label="Orders" value={item.orders} onChange={(value) => update(item.id, "orders", value)} />
              <MetricInput label="ACOS" value={item.acos} onChange={(value) => update(item.id, "acos", value)} suffix="%" />
              <MetricInput label="TACOS" value={item.tacos} onChange={(value) => update(item.id, "tacos", value)} suffix="%" />
            </div>
            <div className="mt-4">
              <div className="mb-2 text-xs font-semibold text-muted">项目进度</div>
              <ProgressBar value={item.progress} />
              <input className="mt-2 w-full accent-sage" type="range" min="0" max="100" value={item.progress} onChange={(event) => update(item.id, "progress", event.target.value)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MetricInput({ label, value, onChange, suffix = "" }) {
  return (
    <label className="rounded-lg border border-line bg-cream/35 p-3">
      <span className="text-xs font-semibold text-muted">{label}</span>
      <div className="mt-1 flex items-center gap-1">
        <input className="w-full bg-transparent text-lg font-bold outline-none" type="number" value={value} onChange={(event) => onChange(event.target.value)} />
        {suffix && <span className="font-semibold text-muted">{suffix}</span>}
      </div>
    </label>
  );
}
