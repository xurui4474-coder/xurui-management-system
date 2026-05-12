import { Trash2 } from "lucide-react";
import { exportToCsv } from "../utils/csv";
import PageHeader from "./PageHeader";

const columns = [
  ["week", "周次"],
  ["stage", "阶段"],
  ["period", "周期"],
  ["meetingTime", "沟通时间"],
  ["salesToDate", "截止销售额"],
  ["focus", "沟通重点"],
  ["actions", "本周具体落实动作"],
  ["deliverables", "代运营交付物"],
  ["result", "本周复盘结果"],
  ["nextPlan", "下周计划"],
  ["risk", "风险问题"],
];

const emptyReview = {
  week: "2026-W20",
  stage: "待填写",
  period: "",
  meetingTime: "",
  salesToDate: "",
  focus: "",
  actions: "",
  deliverables: "",
  result: "",
  nextPlan: "",
  risk: "",
};

export default function WeeklyReviewTable({ reviews, onAddReview, onUpdateReview, onDeleteReview }) {
  const update = (id, field, value) => {
    const current = reviews.find((item) => item.id === id);
    if (current) onUpdateReview({ ...current, [field]: value });
  };

  return (
    <section>
      <PageHeader
        title="周度复盘"
        subtitle="按周沉淀沟通重点、落实动作、交付物、复盘结论与风险问题"
        onAdd={() => onAddReview(emptyReview)}
        onExport={() => exportToCsv("周度复盘.csv", reviews)}
      />
      <div className="overflow-auto rounded-lg border border-line bg-paper shadow-soft scrollbar-thin">
        <table className="min-w-[1680px] text-sm">
          <thead className="bg-cream text-left text-xs font-semibold text-muted">
            <tr>
              {columns.map(([, label]) => (
                <th key={label} className="px-3 py-3">
                  {label}
                </th>
              ))}
              <th className="w-16 px-3 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((item) => (
              <tr key={item.id} className="border-t border-line align-top">
                {columns.map(([key]) => (
                  <td key={key} className="min-w-36 px-2 py-2">
                    <textarea className="table-input min-h-16 resize-y" value={item[key] || ""} onChange={(event) => update(item.id, key, event.target.value)} />
                  </td>
                ))}
                <td className="px-3 py-3">
                  <button className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-700" onClick={() => onDeleteReview(item.id)} title="删除">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!reviews.length && (
              <tr>
                <td className="px-4 py-10 text-center text-muted" colSpan={columns.length + 1}>
                  暂无复盘，点击右上角新增
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
