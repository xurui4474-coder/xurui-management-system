import { AlertTriangle, CalendarDays, CheckCircle2, CircleDollarSign, Clock3, Sparkles } from "lucide-react";
import { businessSections } from "../data/initialData";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";

function sum(list, key) {
  return list.reduce((total, item) => total + (Number(item[key]) || 0), 0);
}

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="rounded-2xl bg-white/62 p-2 text-steel">
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-4 text-3xl font-bold text-ink">{value}</div>
      <div className="mt-1 text-xs text-muted">{note}</div>
    </div>
  );
}

export default function Dashboard({ tasksMap, metrics }) {
  const allTasks = Object.values(tasksMap).flat();
  const risks = allTasks.filter((task) => task.status === "风险");
  const today = new Date().toISOString().slice(0, 10);
  const overdue = allTasks.filter((task) => task.status !== "已完成" && task.dueDate && task.dueDate < today);
  const weekly = allTasks.filter((task) => ["进行中", "风险", "延期"].includes(task.status)).slice(0, 6);
  const nextWeek = allTasks.filter((task) => task.status !== "已完成").slice(0, 5);
  const sales = sum(metrics, "sales");

  return (
    <section>
      <div className="glass-panel mb-5 overflow-hidden rounded-3xl p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/54 px-3 py-1 text-xs font-semibold text-muted">
              <Sparkles size={14} />
              Cross-border operating room
            </div>
            <h1 className="text-3xl font-bold tracking-normal text-ink">首页总览 Dashboard</h1>
            <p className="mt-2 text-sm text-muted">四大业务板块、任务进度、风险提醒与销售额概览</p>
          </div>
          <div className="rounded-2xl bg-white/58 px-4 py-3 text-right">
            <div className="text-xs text-muted">今日重点</div>
            <div className="mt-1 text-lg font-bold text-ink">{weekly.length} 项推进中</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={CircleDollarSign} label="销售额概览" value={`¥${sales.toLocaleString()}`} note="自运营 / 代运营 / TikTok / 独立站" />
        <StatCard icon={CheckCircle2} label="已完成任务" value={allTasks.filter((task) => task.status === "已完成").length} note={`总任务 ${allTasks.length} 项`} />
        <StatCard icon={Clock3} label="逾期任务" value={overdue.length} note="未完成且已过截止日期" />
        <StatCard icon={AlertTriangle} label="风险提醒" value={risks.length} note="状态标记为风险的事项" />
      </div>

      <div className="mt-5 grid grid-cols-[1fr_1fr] gap-4">
        <div className="glass-panel rounded-3xl p-5">
          <div className="mb-4 font-semibold">四个业务板块整体进度</div>
          <div className="space-y-4">
            {businessSections.map((section) => {
              const list = tasksMap[section.id] || [];
              const progress = list.length ? Math.round(list.reduce((total, item) => total + Number(item.progress || 0), 0) / list.length) : 0;
              return (
                <div key={section.id} className="rounded-2xl bg-white/48 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold">{section.name}</span>
                    <span className="text-muted">{list.length} 项任务</span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5">
          <div className="mb-4 font-semibold">销售额概览</div>
          <div className="space-y-3">
            {metrics.map((item) => (
              <div key={item.id} className="grid grid-cols-[140px_1fr_90px] items-center gap-3 rounded-2xl bg-white/48 p-3 text-sm">
                <span className="font-semibold">{item.channel}</span>
                <ProgressBar value={item.progress} />
                <span className="text-right font-bold">¥{item.sales.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <Panel title="本周重点任务" icon={CalendarDays} tasks={weekly} />
        <Panel title="逾期任务" icon={Clock3} tasks={overdue} />
        <Panel title="风险提醒" icon={AlertTriangle} tasks={risks} />
      </div>

      <div className="glass-panel mt-5 rounded-3xl p-5">
        <div className="mb-3 font-semibold">下周计划</div>
        <div className="grid grid-cols-5 gap-3">
          {nextWeek.map((task) => (
            <div key={task.id} className="rounded-2xl border border-white/70 bg-white/48 p-3">
              <div className="line-clamp-2 min-h-10 text-sm font-semibold">{task.title}</div>
              <div className="mt-3 flex items-center justify-between">
                <StatusBadge status={task.status} />
                <span className="text-xs text-muted">{task.dueDate}</span>
              </div>
            </div>
          ))}
          {!nextWeek.length && <div className="col-span-5 py-5 text-center text-sm text-muted">暂无计划</div>}
        </div>
      </div>
    </section>
  );
}

function Panel({ title, icon: Icon, tasks }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="mb-3 flex items-center gap-2 font-semibold">
        <Icon size={17} className="text-steel" />
        {title}
      </div>
      <div className="space-y-3">
        {tasks.slice(0, 5).map((task) => (
          <div key={task.id} className="rounded-2xl border border-white/70 bg-white/46 p-3">
            <div className="text-sm font-semibold">{task.title}</div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted">
              <span>{task.owner}</span>
              <span>{task.dueDate}</span>
            </div>
          </div>
        ))}
        {!tasks.length && <div className="py-5 text-center text-sm text-muted">暂无事项</div>}
      </div>
    </div>
  );
}
