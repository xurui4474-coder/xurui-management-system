import { useMemo, useState } from "react";
import { owners, statuses } from "../data/initialData";
import { exportToCsv } from "../utils/csv";
import Filters from "./Filters";
import PageHeader from "./PageHeader";
import TaskTable from "./TaskTable";

const emptyTask = {
  title: "新任务",
  status: "未开始",
  owner: "徐瑞",
  dueDate: new Date().toISOString().slice(0, 10),
  progress: 0,
  remark: "",
};

export default function BusinessBoard({ id, title, subtitle, tasks, setTasks }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [owner, setOwner] = useState("");

  const filteredTasks = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchedSearch = !keyword || [task.title, task.remark, task.owner, task.status].some((field) => String(field).toLowerCase().includes(keyword));
      const matchedStatus = !status || task.status === status;
      const matchedOwner = !owner || task.owner === owner;
      return matchedSearch && matchedStatus && matchedOwner;
    });
  }, [tasks, search, status, owner]);

  const addTask = () => {
    setTasks({ ...emptyTask, boardId: id });
  };

  const updateTask = (taskId, field, value) => {
    const current = tasks.find((task) => task.id === taskId);
    if (current) setTasks({ ...current, [field]: value });
  };

  const deleteTask = (taskId) => {
    setTasks(taskId);
  };

  return (
    <section>
      <PageHeader title={title} subtitle={subtitle} onAdd={addTask} onExport={() => exportToCsv(`${title}.csv`, filteredTasks)} />
      <Filters search={search} setSearch={setSearch} status={status} setStatus={setStatus} owner={owner} setOwner={setOwner} statuses={statuses} owners={owners} />
      <TaskTable tasks={filteredTasks} onUpdate={updateTask} onDelete={deleteTask} />
    </section>
  );
}
