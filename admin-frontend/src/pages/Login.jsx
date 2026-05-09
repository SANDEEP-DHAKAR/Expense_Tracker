import { useContext, useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
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
      const response = await loginUser({ email: email.trim(), password });
      const payload = response?.data;

      if (!payload?.user || payload.user.role !== "admin") {
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
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-slate-100">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-dark-950 to-primary-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 to-transparent" />
      
      <section className="relative w-full max-w-md glass-heavy rounded-2xl border border-glass-medium p-8 shadow-glass animate-fade-in">
        <div className="mb-8">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-green-glow animate-float">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Admin sign in</h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Access platform analytics, users, and transaction oversight.
          </p>
        </div>

        {error ? (
          <div className="mb-6 glass-heavy rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-slide-up">
            {error}
          </div>
        ) : null}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-300">
              Email
            </span>
            <input
              type="email"
              className="w-full rounded-xl border border-glass-medium glass-heavy px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-300">
              Password
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-glass-medium glass-heavy px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-glass-light hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary inline-flex h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-white shadow-gold-glow transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
