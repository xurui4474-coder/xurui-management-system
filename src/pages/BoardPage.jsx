import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Plus, Trash2 } from "lucide-react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { taskBoards } from "../data/boardConfig";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const customBoardsKey = "xurui-custom-task-boards";

function createBoardId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "77777777-7777-4777-8777-" + String(Date.now()).slice(-12).padStart(12, "0");
}

function readCustomBoards() {
  try {
    return JSON.parse(localStorage.getItem(customBoardsKey) || "[]");
  } catch {
    return [];
  }
}

export default function BoardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customBoards, setCustomBoards] = useState(readCustomBoards);
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");

  const boards = useMemo(() => [...taskBoards, ...customBoards], [customBoards]);

  const saveCustomBoards = (nextBoards) => {
    setCustomBoards(nextBoards);
    localStorage.setItem(customBoardsKey, JSON.stringify(nextBoards));
  };

  const fetchCustomBoards = async () => {
    const { data, error } = await supabase.from("task_boards").select("id, module, description, created_at").order("created_at", { ascending: true });
    if (error) {
      console.warn("自定义板块表未启用，使用浏览器本地板块:", error);
      return;
    }

    const remoteBoards = (data || []).map((board) => ({
      key: `custom-${board.id}`,
      id: board.id,
      module: board.module,
      description: board.description || "自定义任务板块",
      custom: true,
    }));
    saveCustomBoards(remoteBoards);
  };

  const addCustomBoard = async () => {
    const name = boardName.trim();
    if (!name) {
      alert("请填写板块名称");
      return;
    }

    const nextBoard = {
      key: `custom-${Date.now()}`,
      id: createBoardId(),
      module: name,
      description: boardDescription.trim() || "自定义任务板块",
      custom: true,
    };

    const { data, error } = await supabase
      .from("task_boards")
      .insert([{ id: nextBoard.id, module: nextBoard.module, description: nextBoard.description }])
      .select()
      .single();

    if (error) {
      console.warn("自定义板块未写入 Supabase，已保存到当前浏览器:", error);
      saveCustomBoards([...customBoards, nextBoard]);
    } else {
      saveCustomBoards([
        ...customBoards,
        {
          key: `custom-${data.id}`,
          id: data.id,
          module: data.module,
          description: data.description || "自定义任务板块",
          custom: true,
        },
      ]);
    }

    setBoardName("");
    setBoardDescription("");
  };

  const removeCustomBoard = async (boardId) => {
    const hasTasks = tasks.some((task) => task.board_id === boardId);
    const message = hasTasks ? "这个板块下已有任务。删除板块只会隐藏板块，不会删除数据库里的任务，确认继续？" : "确认删除这个自定义板块？";
    if (!confirm(message)) return;

    const { error } = await supabase.from("task_boards").delete().eq("id", boardId);
    if (error) console.warn("自定义板块未从 Supabase 删除，仅从当前浏览器移除:", error);

    saveCustomBoards(customBoards.filter((board) => board.id !== boardId));
  };

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
    fetchCustomBoards();

    const channel = supabase
      .channel("tasks-board-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, fetchTasks)
      .on("postgres_changes", { event: "*", schema: "public", table: "task_boards" }, fetchCustomBoards)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const groupedTasks = useMemo(() => {
    return boards.reduce((result, board) => {
      result[board.id] = tasks.filter((task) => task.board_id === board.id);
      return result;
    }, {});
  }, [boards, tasks]);

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">任务板块</h1>
          <p className="mt-1 text-sm text-muted">四个默认业务板块 + 自定义板块，任务实时同步到 Supabase。</p>
        </div>
      </div>

      <div className="mb-5 rounded-lg border border-line bg-paper p-4 shadow-soft">
        <div className="mb-3 text-sm font-semibold text-ink">新增自定义板块</div>
        <div className="grid grid-cols-[220px_1fr_auto] gap-3">
          <input
            className="rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-sage"
            value={boardName}
            onChange={(event) => setBoardName(event.target.value)}
            placeholder="板块名称"
          />
          <input
            className="rounded-lg border border-line bg-cream px-3 py-2.5 text-sm outline-none focus:border-sage"
            value={boardDescription}
            onChange={(event) => setBoardDescription(event.target.value)}
            placeholder="板块说明，可不填"
          />
          <button className="btn btn-primary" onClick={addCustomBoard}>
            <Plus size={16} />
            新增板块
          </button>
        </div>
      </div>

      {loading && <div className="mb-4 rounded-lg border border-line bg-paper px-4 py-3 text-sm text-muted">正在加载任务数据...</div>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {boards.map((board) => (
          <section key={board.id} className="rounded-lg border border-line bg-paper p-5 shadow-soft">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-ink">{board.module}</h2>
                <p className="mt-1 text-sm text-muted">{board.description}</p>
              </div>
              {board.custom && (
                <button className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-700" onClick={() => removeCustomBoard(board.id)} title="删除板块">
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <TaskForm board_id={board.id} module={board.module} onAdd={fetchTasks} />

            <div className="mt-5">
              <TaskList tasks={groupedTasks[board.id] || []} />
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
