import { useContext, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContextValue";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!email.trim() || !password) {
      toast.error("Please fill in both email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email: email.trim(),
        password,
      });

      login(res.data);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.message ||
        (typeof errorData === "string" ? errorData : null) ||
        error.message ||
        "Login failed. Please check your credentials.";

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05080d] px-4 py-10 sm:px-6 lg:px-8 text-slate-100">
      {/* AMBIENT CANVAS GLOWS */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[580px] w-[580px] rounded-full bg-emerald-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[580px] w-[580px] rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[700px] rounded-full bg-emerald-500/[0.04] blur-[160px]" />

      {/* SUBTLE MESH GRID OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]" />

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          
          {/* ================= LEFT SHOWCASE PANEL (DESKTOP) ================= */}
          <div className="hidden lg:col-span-6 lg:block xl:col-span-7 space-y-8 pr-4">
            
            {/* BRAND BADGE */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
                Wealth Intelligence OS
              </span>
            </div>

            {/* HERO TYPOGRAPHY */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight xl:text-5xl leading-[1.15]">
                <span className="text-gradient-silver">Master your cashflow with</span>{" "}
                <span className="text-gradient-emerald">predictive clarity.</span>
              </h1>
              <p className="max-w-xl text-base text-slate-400 leading-relaxed font-normal">
                Real-time multi-category ledgers, smart automated monthly limits, and bank-grade privacy designed for uncompromising financial peace of mind.
              </p>
            </div>

            {/* FLOATING GLASS METRIC CARDS */}
            <div className="space-y-4 pt-2 max-w-lg">
              {/* CARD 1: Monthly Spend */}
              <div className="card-showcase animate-float-slow rounded-2xl p-5 transition-all duration-300 hover:border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Monthly Outflow
                      </p>
                      <p className="text-xl font-black text-white tracking-tight">
                        ₹48,250.00
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    +12.4% vs last mo
                  </span>
                </div>

                <div className="mt-3.5 flex items-center gap-2 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Food & Dining (₹14.2k)</span>
                  <span className="text-slate-600">•</span>
                  <span>Rent & Bills (₹22.0k)</span>
                  <span className="text-slate-600">•</span>
                  <span>Travel (₹6.5k)</span>
                </div>
              </div>

              {/* CARD 2: Smart Budget Guard */}
              <div className="card-showcase animate-float-delayed rounded-2xl p-5 transition-all duration-300 hover:border-cyan-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Smart Budget Health
                      </p>
                      <p className="text-sm font-bold text-slate-200">
                        ₹21,750 Available
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cyan-300">
                    68% Utilized
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-1000"
                    style={{ width: "68%" }}
                  />
                </div>
              </div>

              {/* TRUST PILL */}
              <div className="flex items-center gap-3 text-xs text-slate-400 px-1 pt-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] text-slate-300">
                  <Lock size={11} />
                </div>
                <span>Bank-grade 256-bit encryption • Zero data selling • Open API architecture</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT FORM PANEL ================= */}
          <div className="lg:col-span-6 xl:col-span-5 w-full">
            <section className="card-glass-luxury relative overflow-hidden rounded-[32px] p-8 sm:p-10">
              
              {/* TOP BRAND ACCENT BAR */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

              {/* MOBILE LOGO & BADGE (VISIBLE ON MOBILE) */}
              <div className="mb-6 flex flex-col items-center text-center lg:hidden">
                <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-lg shadow-emerald-500/10">
                  <img
                    src="/Expense-frontend-logo.png"
                    alt="Logo"
                    className="h-12 w-12 object-contain drop-shadow-[0_4px_12px_rgba(34,197,94,0.4)]"
                  />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-semibold text-emerald-300">
                  <Sparkles size={11} />
                  Smart Expense Management
                </span>
              </div>

              {/* FORM HEADER */}
              <div className="text-left">
                <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Welcome back
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
                  Sign in to manage budgets, transactions, and analytics.
                </p>
              </div>

              {/* FAST GOOGLE AUTH */}
              <div className="mt-7">
                <GoogleAuthButton mode="signin" text="Sign in with Google" />
              </div>

              {/* ELEGANT DIVIDER */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <div className="relative bg-[#090e15] px-3.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  or continue with email
                </div>
              </div>

              {/* CREDENTIALS FORM */}
              <form className="space-y-4" onSubmit={handleLogin}>
                {/* Email Address */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#0c131c]/70 px-4 py-3 pl-11 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-400/80 focus:bg-[#0f1722] focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-xs font-semibold tracking-wide text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#0c131c]/70 px-4 py-3 pl-11 pr-11 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-400/80 focus:bg-[#0f1722] focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <Lock
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1 text-slate-400 transition hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-emerald-glow relative flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold tracking-tight text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>{loading ? "Verifying Credentials..." : "Sign In to Account"}</span>
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </div>
              </form>

              {/* CARD FOOTER */}
              <div className="mt-8 text-center border-t border-white/[0.06] pt-5">
                <p className="text-xs text-slate-400">
                  New to Expense Tracker?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-bold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </div>

            </section>
          </div>

        </div>
      </div>
    </main>
  );
}