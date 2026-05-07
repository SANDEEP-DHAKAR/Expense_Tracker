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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-950">
      <section className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-200/60 backdrop-blur sm:p-8">
        <div className="mb-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
            <ShieldCheck size={21} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Access platform analytics, users, and transaction oversight.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
