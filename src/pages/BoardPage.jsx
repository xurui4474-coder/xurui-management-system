import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { taskBoards } from "../data/boardConfig";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BoardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .select("id, board_id, title, module, status, owner, due_date, progress, notes, created_at")
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("获取任务失败:", error);
      alert("获取任务失败，请检查 Supabase tasks 表字段或权限配置");
      return;
    }

    setTasks(data || []);
  };

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel("tasks-board-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, fetchTasks)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const groupedTasks = useMemo(() => {
    return taskBoards.reduce((result, board) => {
      result[board.id] = tasks.filter((task) => task.board_id === board.id);
      return result;
    }, {});
  }, [tasks]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">跨境电商任务管理</h1>
          <p className="mt-1 text-sm text-gray-500">四个业务板块独立管理任务，数据实时同步到 Supabase。</p>
        </div>

        {loading && <div className="mb-4 rounded-lg border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">正在加载任务数据...</div>}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {taskBoards.map((board) => (
            <section key={board.id} className="rounded-xl bg-white p-5 shadow">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">{board.module}</h2>
                <p className="mt-1 text-sm text-gray-500">{board.description}</p>
              </div>

              <TaskForm board_id={board.id} module={board.module} onAdd={fetchTasks} />

              <div className="mt-5">
                <TaskList tasks={groupedTasks[board.id] || []} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
