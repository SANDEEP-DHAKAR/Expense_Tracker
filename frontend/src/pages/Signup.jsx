import { useContext, useState } from "react";
import {
  Eye,
  EyeOff,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signupUser } from "../api/auth";
import { AuthContext } from "../context/AuthContextValue";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login } =
    useContext(AuthContext);

  const handleSignup = async (event) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await signupUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const data = res.data;

      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      toast.success("Account created");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Signup failed"
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

      {/* Grid Effect */}
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
            Smart Expense Tracking
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Create Account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Track your daily expenses,
            manage your spending,
            and build better financial habits
            with your personal dashboard.
          </p>
        </div>

        {/* Form */}
        <form
          className="mt-8 space-y-5"
          onSubmit={handleSignup}
        >
          {/* Name */}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Full Name
            </span>

            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-green-400 focus:bg-white/10 focus:ring-4 focus:ring-green-500/20"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoComplete="name"
            />
          </label>

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
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </span>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-green-400 focus:bg-white/10 focus:ring-4 focus:ring-green-500/20"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
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
                ? "Creating Account..."
                : "Create Account"}
            </span>
          </button>
        </form>

        {/* Footer */}
        <p className="mt-7 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="font-semibold text-green-300 transition hover:text-green-200 hover:underline"
          >
            Sign in
          </button>
        </p>
      </section>
    </main>
  );
}