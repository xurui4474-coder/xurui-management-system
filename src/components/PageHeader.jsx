import { Download, Plus } from "lucide-react";

export default function PageHeader({ title, subtitle, onAdd, onExport }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-normal text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      <div className="flex gap-2">
        {onExport && (
          <button className="btn btn-ghost" onClick={onExport}>
            <Download size={16} />
            导出 CSV
          </button>
        )}
        {onAdd && (
          <button className="btn btn-primary" onClick={onAdd}>
            <Plus size={16} />
            新增
          </button>
        )}
      </div>
    </div>
  );
}
