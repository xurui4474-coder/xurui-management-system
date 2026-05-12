import { Trash2 } from "lucide-react";
import { owners, statuses } from "../data/initialData";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

export default function TaskTable({ tasks, onUpdate, onDelete }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-soft">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-cream text-left text-xs font-semibold text-muted">
          <tr>
            <th className="px-3 py-3">任务</th>
            <th className="w-32 px-3 py-3">状态</th>
            <th className="w-32 px-3 py-3">负责人</th>
            <th className="w-36 px-3 py-3">截止日期</th>
            <th className="w-40 px-3 py-3">进度</th>
            <th className="px-3 py-3">备注</th>
            <th className="w-16 px-3 py-3">操作</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t border-line align-top">
              <td className="px-2 py-2">
                <input className="table-input font-semibold" value={task.title || ""} onChange={(event) => onUpdate(task.id, "title", event.target.value)} />
              </td>
              <td className="px-2 py-2">
                <select className="table-select" value={task.status || "未开始"} onChange={(event) => onUpdate(task.id, "status", event.target.value)}>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <StatusBadge status={task.status} />
                </div>
              </td>
              <td className="px-2 py-2">
                <select className="table-select" value={task.owner || "徐瑞"} onChange={(event) => onUpdate(task.id, "owner", event.target.value)}>
                  {owners.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-2 py-2">
                <input className="table-input" type="date" value={task.dueDate || task.due_date || ""} onChange={(event) => onUpdate(task.id, "dueDate", event.target.value)} />
              </td>
              <td className="px-3 py-4">
                <ProgressBar value={task.progress} />
                <input
                  className="mt-2 w-full accent-sage"
                  type="range"
                  min="0"
                  max="100"
                  value={Number(task.progress) || 0}
                  onChange={(event) => onUpdate(task.id, "progress", Number(event.target.value))}
                />
              </td>
              <td className="px-2 py-2">
                <textarea
                  className="table-input min-h-20 resize-y"
                  value={task.notes || task.remark || ""}
                  onChange={(event) => onUpdate(task.id, "notes", event.target.value)}
                />
              </td>
              <td className="px-3 py-3">
                <button className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-700" onClick={() => onDelete(task.id)} title="删除">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {!tasks.length && (
            <tr>
              <td className="px-4 py-10 text-center text-muted" colSpan="7">
                暂无数据
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
