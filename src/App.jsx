import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import BusinessBoard from "./components/BusinessBoard";
import ProductTable from "./components/ProductTable";
import WeeklyReviewTable from "./components/WeeklyReviewTable";
import DataBoard from "./components/DataBoard";
import LoginPage from "./components/LoginPage";
import BoardPage from "./pages/BoardPage";
import { businessSections } from "./data/initialData";
import { boardKeyByUuid } from "./data/boardConfig";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import {
  deleteProduct,
  deleteReview,
  deleteTask,
  insertProduct,
  insertReview,
  insertTask,
  loadAllData,
  updateMetric,
  updateProduct,
  updateReview,
  updateTask,
} from "./services/database";

const boardMeta = {
  selfAmazon: { title: "自运营亚马逊", subtitle: "Minirain / Softrain 自营项目任务、进度、广告复盘与库存风险" },
  agencyAmazon: { title: "代运营亚马逊", subtitle: "代运营交付物、会议动作、销售目标、广告优化与卡点跟进" },
  tiktok: { title: "TikTok 美区", subtitle: "达人转化、爆款视频、GMV、ROI 与店铺动作管理" },
  site: { title: "独立站制作进度", subtitle: "网站结构、设计、产品页、内容、上线进度与问题记录" },
  todos: { title: "待办事项与项目进度", subtitle: "徐瑞跨境项目本周重点事项、负责人、截止日期与进度" },
  risks: { title: "风险问题记录", subtitle: "集中记录库存、广告、交付、素材、供应链等风险与解决进度" },
};

const pathById = {
  dashboard: "/",
  selfAmazon: "/self-amazon",
  agencyAmazon: "/agency-amazon",
  tiktok: "/tiktok-us",
  site: "/site",
  board: "/board",
  products: "/products",
  reviews: "/weekly-reviews",
  todos: "/todos",
  risks: "/risks",
  data: "/data",
};

const idByPath = Object.entries(pathById).reduce((result, [id, path]) => {
  result[path] = id;
  return result;
}, {});

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const active = idByPath[location.pathname] || "dashboard";
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const tasksMap = useMemo(() => {
    const grouped = { selfAmazon: [], agencyAmazon: [], tiktok: [], site: [], todos: [], risks: [] };
    tasks.forEach((task) => {
      const key = boardKeyByUuid[task.boardId] || task.boardId || "todos";
      grouped[key] = [...(grouped[key] || []), task];
    });
    return grouped;
  }, [tasks]);

  const refreshData = async () => {
    if (!isSupabaseConfigured || !session) return;
    setDataLoading(true);
    setError("");
    try {
      const data = await loadAllData();
      setTasks(data.tasks);
      setProducts(data.products);
      setReviews(data.reviews);
      setMetrics(data.metrics);
    } catch (err) {
      setError(err.message || "数据加载失败");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return undefined;
    refreshData();

    const channel = supabase
      .channel("crossborder-project-db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, refreshData)
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refreshData)
      .on("postgres_changes", { event: "*", schema: "public", table: "weekly_reviews" }, refreshData)
      .on("postgres_changes", { event: "*", schema: "public", table: "metrics" }, refreshData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const addOrUpdateTask = async (payload) => {
    setError("");
    if (payload.id) {
      setTasks((current) => current.map((task) => (task.id === payload.id ? payload : task)));
      try {
        await updateTask(payload.id, payload);
      } catch (err) {
        setError(err.message || "任务更新失败");
        refreshData();
      }
      return;
    }
    try {
      await insertTask(payload);
      refreshData();
    } catch (err) {
      setError(err.message || "任务新增失败");
    }
  };

  const removeTask = async (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
    try {
      await deleteTask(id);
    } catch (err) {
      setError(err.message || "任务删除失败");
      refreshData();
    }
  };

  const addProduct = async (product) => {
    try {
      const saved = await insertProduct(product);
      setProducts((current) => [...current, saved]);
    } catch (err) {
      setError(err.message || "选品新增失败");
    }
  };

  const saveProduct = async (product) => {
    setProducts((current) => current.map((item) => (item.id === product.id ? product : item)));
    try {
      await updateProduct(product.id, product);
    } catch (err) {
      setError(err.message || "选品更新失败");
      refreshData();
    }
  };

  const removeProduct = async (id) => {
    setProducts((current) => current.filter((item) => item.id !== id));
    try {
      await deleteProduct(id);
    } catch (err) {
      setError(err.message || "选品删除失败");
      refreshData();
    }
  };

  const addReview = async (review) => {
    try {
      const saved = await insertReview(review);
      setReviews((current) => [...current, saved]);
    } catch (err) {
      setError(err.message || "复盘新增失败");
    }
  };

  const saveReview = async (review) => {
    setReviews((current) => current.map((item) => (item.id === review.id ? review : item)));
    try {
      await updateReview(review.id, review);
    } catch (err) {
      setError(err.message || "复盘更新失败");
      refreshData();
    }
  };

  const removeReview = async (id) => {
    setReviews((current) => current.filter((item) => item.id !== id));
    try {
      await deleteReview(id);
    } catch (err) {
      setError(err.message || "复盘删除失败");
      refreshData();
    }
  };

  const saveMetric = async (metric) => {
    setMetrics((current) => current.map((item) => (item.id === metric.id ? metric : item)));
    try {
      await updateMetric(metric.id, metric);
    } catch (err) {
      setError(err.message || "数据看板更新失败");
      refreshData();
    }
  };

  const handleNavigate = (id) => {
    navigate(pathById[id] || "/");
  };

  const renderLegacyContent = () => {
    if (active === "dashboard") return <Dashboard tasksMap={tasksMap} metrics={metrics} />;
    if (active === "products") return <ProductTable products={products} onAddProduct={addProduct} onUpdateProduct={saveProduct} onDeleteProduct={removeProduct} />;
    if (active === "reviews") return <WeeklyReviewTable reviews={reviews} onAddReview={addReview} onUpdateReview={saveReview} onDeleteReview={removeReview} />;
    if (active === "data") return <DataBoard metrics={metrics} onUpdateMetric={saveMetric} />;

    const meta = boardMeta[active];
    if (meta) {
      return (
        <BusinessBoard
          id={active}
          title={meta.title}
          subtitle={meta.subtitle}
          tasks={tasksMap[active] || []}
          setTasks={(payload) => (typeof payload === "string" ? removeTask(payload) : addOrUpdateTask(payload))}
        />
      );
    }

    return <Dashboard tasksMap={tasksMap} metrics={metrics} />;
  };

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-cream text-sm font-semibold text-muted">正在检查登录状态...</div>;
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen">
      <Sidebar active={active} onChange={handleNavigate} />
      <main className="ml-64 min-h-screen px-6 py-5">
        <div className="glass-panel mb-5 flex items-center justify-between rounded-3xl px-5 py-4">
          <div>
            <div className="text-sm font-semibold">跨境负责人：徐瑞</div>
            <div className="text-xs text-muted">
              Amazon Minirain / Softrain · TikTok 美区 · 独立站 · 当前账号：{session.user.email}
            </div>
          </div>
          <div className="flex items-center gap-5 text-right text-xs text-muted">
            {businessSections.map((section) => {
              const count = (tasksMap[section.id] || []).length;
              return (
                <div key={section.id} className="rounded-2xl bg-white/48 px-3 py-2">
                  <div className="text-base font-bold text-ink">{count}</div>
                  <div>{section.shortName}</div>
                </div>
              );
            })}
            <button className="btn btn-ghost" onClick={() => supabase.auth.signOut()}>
              退出登录
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        {dataLoading && <div className="mb-4 rounded-lg border border-line bg-paper px-4 py-3 text-sm text-muted">正在同步 Supabase 数据...</div>}

        <Routes>
          <Route path="/board" element={<BoardPage />} />
          <Route path="*" element={renderLegacyContent()} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
