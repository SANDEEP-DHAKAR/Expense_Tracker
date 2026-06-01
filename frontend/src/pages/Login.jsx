import { useContext, useState } from "react";

import {
  Eye,
  EyeOff,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { loginUser } from "../api/auth";

import { AuthContext } from "../context/AuthContextValue";

export default function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const { login } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email: email.trim(),
        password,
      });

      login(res.data);

      toast.success("Welcome back");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      const errorData =
        error.response?.data;

      const errorMessage =
        errorData?.message ||
        (typeof errorData === "string"
          ? errorData
          : null) ||
        error.message ||
        "Login failed";

      toast.error(
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04130d] px-4 py-10 text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-100px] top-[-100px] h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-120px] h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Card */}
      <section className="relative z-10 w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl" />

            <img
              src="/Expense-frontend-logo.png"
              alt="Expense Tracker Logo"
              className="relative h-28 w-28 object-contain drop-shadow-[0_10px_30px_rgba(34,197,94,0.45)]"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-green-300">
            <TrendingUp size={14} />
            Smart Expense Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Login to continue tracking your
            expenses, monitor your budgets,
            and manage your financial journey
            with ease.
          </p>
        </div>

        {/* Form */}
        <form
          className="mt-8 space-y-5"
          onSubmit={handleLogin}
        >
          {/* Email */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Email Address
            </span>

            <input
              type="email"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-green-400 focus:bg-white/10 focus:ring-4 focus:ring-green-500/20"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
            />
          </label>

          {/* Password */}
          <label className="block">
            <div className="mb-2 flex items-center justify-between">
              <span className="block text-sm font-medium text-slate-200">
                Password
              </span>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs font-medium text-green-300 transition hover:text-green-200 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-green-400 focus:bg-white/10 focus:ring-4 focus:ring-green-500/20"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 transition hover:opacity-100" />

            <span className="relative z-10">
              {loading
                ? "Signing In..."
                : "Sign In"}
            </span>
          </button>
        </form>

        {/* Footer */}
        <p className="mt-7 text-center text-sm text-slate-300">
          New here?{" "}
          <button
            type="button"
            onClick={() =>
              navigate("/signup")
            }
            className="font-semibold text-green-300 transition hover:text-green-200 hover:underline"
          >
            Create an account
          </button>
        </p>
      </section>
    </main>
  );
}