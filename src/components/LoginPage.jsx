import { useState } from "react";
import { LockKeyhole, LogIn, UserPlus } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!isSupabaseConfigured) {
      setMessage("请先在 .env 中配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY");
      return;
    }
    setLoading(true);
    const action =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { error } = await action;
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (mode === "signup") {
      setMessage("账号已提交创建。若开启邮箱验证，请先完成邮件确认。");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <form className="w-full max-w-md rounded-lg border border-line bg-paper p-6 shadow-soft" onSubmit={submit}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-paper">
            <LockKeyhole size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">跨境项目后台登录</h1>
            <p className="text-sm text-muted">徐瑞与老板共用 Supabase 账号体系</p>
          </div>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-semibold">邮箱</span>
          <input className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-sage" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-semibold">密码</span>
          <input className="w-full rounded-lg border border-line bg-cream px-3 py-2.5 outline-none focus:border-sage" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
        </label>

        {message && <div className="mb-4 rounded-lg border border-line bg-cream px-3 py-2 text-sm text-clay">{message}</div>}

        <button className="btn btn-primary w-full" disabled={loading}>
          {mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
          {loading ? "处理中" : mode === "login" ? "登录" : "创建账号"}
        </button>

        <button className="mt-3 w-full text-sm font-semibold text-steel" type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "没有账号，创建一个" : "已有账号，返回登录"}
        </button>
      </form>
    </main>
  );
}
