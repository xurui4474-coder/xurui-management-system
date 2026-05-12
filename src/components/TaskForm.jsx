import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const defaultForm = {
  title: "",
  status: "未开始",
  owner: "",
  due_date: "",
  progress: 0,
  notes: "",
};

export default function TaskForm({ board_id, module, onAdd }) {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!board_id) {
      alert("缺少 board_id，无法新增任务");
      return;
    }

    if (!form.title.trim()) {
      alert("请填写任务标题");
      return;
    }

    setSubmitting(true);

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          board_id,
          title: form.title.trim(),
          module,
          status: form.status,
          owner: form.owner.trim(),
          due_date: form.due_date || null,
          progress: Number(form.progress) || 0,
          notes: form.notes.trim(),
        },
      ])
      .select();

    setSubmitting(false);

    if (error) {
      console.error("新增任务失败:", error);
      alert("新增任务失败，请检查 Supabase tasks 表字段或权限配置");
      return;
    }

    setForm(defaultForm);
    onAdd?.(data?.[0]);
  };

  return (
    <form className="rounded-lg border border-gray-100 bg-gray-50 p-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">任务标题</span>
          <input
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="请输入任务名称"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-gray-700">状态</span>
          <select
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            <option>未开始</option>
            <option>进行中</option>
            <option>已完成</option>
            <option>延期</option>
            <option>风险</option>
          </select>
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-gray-700">负责人</span>
          <input
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            value={form.owner}
            onChange={(event) => updateField("owner", event.target.value)}
            placeholder="例如：徐瑞"
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-gray-700">截止日期</span>
          <input
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            type="date"
            value={form.due_date}
            onChange={(event) => updateField("due_date", event.target.value)}
          />
        </label>

        <label>
          <span className="mb-1 block text-sm font-medium text-gray-700">进度</span>
          <input
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            type="number"
            min="0"
            max="100"
            value={form.progress}
            onChange={(event) => updateField("progress", event.target.value)}
          />
        </label>

        <label className="md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">备注</span>
          <textarea
            className="min-h-20 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="填写任务背景、问题或下一步动作"
          />
        </label>
      </div>

      <button
        className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "新增中..." : "新增任务"}
      </button>
    </form>
  );
}
