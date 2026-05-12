const statusClassMap = {
  未开始: "bg-gray-100 text-gray-700",
  进行中: "bg-blue-50 text-blue-700",
  已完成: "bg-green-50 text-green-700",
  延期: "bg-orange-50 text-orange-700",
  风险: "bg-red-50 text-red-700",
};

export default function TaskList({ tasks = [] }) {
  if (!tasks.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        暂无任务
      </div>
    );
  }

  return (
    <div className="excel-wrap">
      <table className="excel-table text-sm">
        <thead>
          <tr>
            <th className="px-3 py-3">任务</th>
            <th className="px-3 py-3">状态</th>
            <th className="px-3 py-3">负责人</th>
            <th className="px-3 py-3">截止日期</th>
            <th className="px-3 py-3">进度</th>
            <th className="px-3 py-3">备注</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t border-gray-100 align-top">
              <td className="px-3 py-3 font-medium text-gray-900">{task.title || "-"}</td>
              <td className="px-3 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassMap[task.status] || statusClassMap["未开始"]}`}>
                  {task.status || "未开始"}
                </span>
              </td>
              <td className="px-3 py-3 text-gray-700">{task.owner || "-"}</td>
              <td className="px-3 py-3 text-gray-700">{task.due_date || "-"}</td>
              <td className="px-3 py-3">
                <div className="flex min-w-28 items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-gray-900" style={{ width: `${Math.min(100, Math.max(0, Number(task.progress) || 0))}%` }} />
                  </div>
                  <span className="w-10 text-right text-xs font-semibold text-gray-700">{Number(task.progress) || 0}%</span>
                </div>
              </td>
              <td className="max-w-xs px-3 py-3 text-gray-600">{task.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
