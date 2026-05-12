import {
  AlertTriangle,
  BarChart3,
  CalendarCheck,
  CheckSquare,
  ClipboardList,
  Home,
  LayoutList,
  PackageSearch,
  PanelsTopLeft,
  ShoppingBag,
  Store,
} from "lucide-react";

const items = [
  { id: "dashboard", label: "首页总览", icon: Home },
  { id: "selfAmazon", label: "自运营亚马逊", icon: Store },
  { id: "agencyAmazon", label: "代运营亚马逊", icon: ShoppingBag },
  { id: "tiktok", label: "TikTok 美区", icon: PanelsTopLeft },
  { id: "site", label: "独立站", icon: ClipboardList },
  { id: "board", label: "任务板块", icon: LayoutList },
  { id: "products", label: "选品总表", icon: PackageSearch },
  { id: "reviews", label: "周度复盘", icon: CalendarCheck },
  { id: "todos", label: "待办事项", icon: CheckSquare },
  { id: "risks", label: "风险记录", icon: AlertTriangle },
  { id: "data", label: "数据看板", icon: BarChart3 },
];

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/50 bg-white/42 px-4 py-5 shadow-[12px_0_40px_rgba(80,68,48,0.06)] backdrop-blur-2xl">
      <div className="mb-7 rounded-2xl border border-white/60 bg-white/46 px-4 py-4">
        <div className="text-lg font-bold tracking-normal text-ink">跨境项目后台</div>
        <div className="mt-1 text-xs text-muted">徐瑞 · 运营管理中心</div>
      </div>
      <nav className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm transition ${
                selected
                  ? "bg-ink text-paper shadow-[0_14px_30px_rgba(36,36,36,0.16)]"
                  : "text-ink/82 hover:bg-white/60 hover:shadow-[0_10px_24px_rgba(80,68,48,0.06)]"
              }`}
              onClick={() => onChange(item.id)}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
