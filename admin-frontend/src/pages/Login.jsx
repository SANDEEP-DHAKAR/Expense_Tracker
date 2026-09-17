import { useContext, useState } from "react";
import { Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { AdminAuthContext } from "../context/AdminAuthContextValue";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AdminAuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email: email.trim(),
        password,
      });

      const payload = response?.data?.data || response?.data;

      if (!payload?.user) {
        setError("Invalid login response.");
        return;
      }

      if (payload.user.role !== "admin") {
        setError("Admin access required for this panel.");
        return;
      }

      login(payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-slate-100 bg-[#070a0f]">
      {/* LUXURY AMBIENT BACKGROUND GLOWS */}
      <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <section className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/[0.1] bg-slate-900/80 p-7 sm:p-9 shadow-glass backdrop-blur-2xl animate-fade-in">
        <div className="mb-7">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles size={12} />
            Executive Portal
          </div>

          <div className="flex items-center gap-3.5 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-glow">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                Admin Sign In
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Expense Tracker Platform Oversight
              </p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-xs sm:text-sm font-medium text-rose-300 animate-slide-up">
            {error}
          </div>
        ) : null}

        <form className="space-y-4.5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
              Admin Email
            </label>
            <input
              type="email"
              className="h-11 w-full rounded-xl border border-white/[0.1] bg-slate-950/80 px-4 text-xs sm:text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="sandeep@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="h-11 w-full rounded-xl border border-white/[0.1] bg-slate-950/80 px-4 pr-11 text-xs sm:text-sm text-white outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-3 h-12 w-full rounded-2xl text-xs sm:text-sm font-bold text-white shadow-emerald-glow transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Panel"}
          </button>
        </form>
      </section>
    </main>
  );
}