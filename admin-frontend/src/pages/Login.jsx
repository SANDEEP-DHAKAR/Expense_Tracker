import { useContext, useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { AdminAuthContext } from "../context/AdminAuthContextValue";

export default function Login() {
  const navigate = useNavigate();
  const { adminUser, login } = useContext(AdminAuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in as admin
  useEffect(() => {
    if (adminUser?.accessToken && adminUser?.user?.role === "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [adminUser, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and security password are required.");
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
        setError("Invalid authentication response received from server.");
        return;
      }

      if (payload.user.role !== "admin") {
        setError("Access Denied: Administrative credentials required.");
        return;
      }

      login(payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Administrative authentication failed. Verify credentials.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05080d] px-4 py-10 sm:px-6 lg:px-8 text-slate-100">
      {/* ================= BACKGROUND GLOW ATMOSPHERE ================= */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.12] blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.09] blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[680px] rounded-full bg-emerald-500/[0.04] blur-[170px]" />

      {/* TECH MESH GRID OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_90%)]" />

      {/* ================= MAIN CONTAINER ================= */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          
          {/* ================= LEFT SHOWCASE PANEL (DESKTOP) ================= */}
          <div className="hidden lg:col-span-6 lg:block xl:col-span-7 space-y-8 pr-4">
            
            {/* SYSTEM STATUS PILL */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/[0.08] px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-300">
                Root Governance Engine • Secure Protocol
              </span>
            </div>

            {/* HERO TYPOGRAPHY */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight xl:text-5xl leading-[1.15]">
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Platform Command &
                </span>{" "}
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Master Financial Oversight.
                </span>
              </h1>
              <p className="max-w-xl text-base text-slate-400 leading-relaxed font-normal">
                Comprehensive executive console for real-time ledger orchestration, user governance, categorical budgets, and transactional telemetry with sub-millisecond precision.
              </p>
            </div>

            {/* TELEMETRY PREVIEW CARDS */}
            <div className="space-y-4 pt-2 max-w-lg">
              {/* CARD 1: Cluster Health */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c131c]/70 p-5 backdrop-blur-xl shadow-lg shadow-black/40 transition-all duration-300 hover:border-emerald-500/30 hover:bg-[#101824]/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
                      <Server size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        MySQL Database Node
                      </p>
                      <p className="text-sm font-bold text-white tracking-tight">
                        Cluster 01 • Active (TLS 1.3)
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    <CheckCircle2 size={12} />
                    99.99% Uptime
                  </span>
                </div>

                <div className="mt-3.5 flex items-center gap-3 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Database size={12} className="text-emerald-400" />
                    Master Pool: Online
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>Latency: ~1.2ms</span>
                  <span className="text-slate-600">•</span>
                  <span>Query Cache: Synchronized</span>
                </div>
              </div>

              {/* CARD 2: Security & RBAC */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c131c]/70 p-5 backdrop-blur-xl shadow-lg shadow-black/40 transition-all duration-300 hover:border-cyan-500/30 hover:bg-[#101824]/80">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Access Control & Audit Gate
                      </p>
                      <p className="text-sm font-bold text-slate-200">
                        Strict Role-Based Enforcement
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cyan-300">
                    Active Sentinel
                  </span>
                </div>

                {/* Simulated Telemetry Line */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1.5">
                    <Activity size={12} className="text-cyan-400" />
                    Session Encryption
                  </span>
                  <span className="font-semibold text-emerald-400">
                    HMAC-SHA256 • 0 Security Flags
                  </span>
                </div>
              </div>

              {/* TRUST FOOTER NOTE */}
              <div className="flex items-center gap-3 text-xs text-slate-400 px-1 pt-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] text-slate-300">
                  <Lock size={11} />
                </div>
                <span>Confidential Platform Interface • All Session Signatures Geocoded & Monitored</span>
              </div>
            </div>

          </div>

          {/* ================= RIGHT FORM CONSOLE ================= */}
          <div className="lg:col-span-6 xl:col-span-5 w-full">
            <section className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-[#0c131c]/80 p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-2xl">
              
              {/* TOP ILLUMINATION ACCENT BAR */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />

              {/* BRAND BADGE & HEADER */}
              <div className="mb-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  <Sparkles size={12} className="text-emerald-400" />
                  Executive Authentication
                </div>

                <div className="flex items-center gap-3.5 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                    <ShieldCheck size={26} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                      Admin Portal
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Expense Tracker Platform Control
                    </p>
                  </div>
                </div>
              </div>

              {/* ERROR NOTIFICATION BANNER */}
              {error ? (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm font-medium text-rose-200 backdrop-blur-md">
                  <AlertCircle size={18} className="shrink-0 text-rose-400 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              ) : null}

              {/* CREDENTIALS FORM */}
              <form className="space-y-4.5" onSubmit={handleSubmit}>
                {/* Admin Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-300">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#070b10]/90 px-4 py-3 pl-11 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-400/80 focus:bg-[#0c121a] focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="admin@example.com"
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
                      Master Passkey
                    </label>
                    <span className="text-[11px] font-medium text-emerald-400/90">
                      Protected Credential
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#070b10]/90 px-4 py-3 pl-11 pr-11 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-400/80 focus:bg-[#0c121a] focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="Enter administrator passkey"
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* SECURITY STATUS ROW */}
                <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck size={14} />
                    <span>Role Verification: Enforced</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    SHA-256 Auth
                  </span>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer text-sm"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Authenticating Clearance...
                      </>
                    ) : (
                      <>
                        Sign In to Master Console
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* QUICK PORTAL SWITCHER LINK */}
              <div className="mt-7 pt-5 border-t border-white/[0.06] text-center">
                <a
                  href="http://localhost:5173"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <span>Switch to User Expense Portal</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}