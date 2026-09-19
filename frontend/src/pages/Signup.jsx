import { useContext, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Layers,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signupUser } from "../api/auth";
import { AuthContext } from "../context/AuthContextValue";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // REAL-TIME PASSWORD STRENGTH CALCULATION
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
      case 3:
        return { score: 3, label: "Good", color: "bg-cyan-500", text: "text-cyan-400" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
      default:
        return { score: 1, label: "Too Short", color: "bg-rose-500", text: "text-rose-400" };
    }
  }, [password]);

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
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

      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed. Please try again."
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
                Next-Gen Financial Freedom
              </span>
            </div>

            {/* HERO TYPOGRAPHY */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight xl:text-5xl leading-[1.15]">
                <span className="text-gradient-silver">Join thousands taking</span>{" "}
                <span className="text-gradient-emerald">command of their wealth.</span>
              </h1>
              <p className="max-w-xl text-base text-slate-400 leading-relaxed font-normal">
                Set up in 30 seconds. Get intelligent category organization, budget guard alerts, and actionable financial summaries instantly.
              </p>
            </div>

            {/* FLOATING FEATURE HIGHLIGHTS */}
            <div className="space-y-4 pt-2 max-w-lg">
              {/* HIGHLIGHT 1: Instant Categories */}
              <div className="card-showcase animate-float-slow rounded-2xl p-5 transition-all duration-300 hover:border-emerald-500/30">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Instant Smart Categorization
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      Pre-loaded with foundational categories — Food, Travel, Shopping, and Bills. Customize anytime.
                    </p>
                  </div>
                </div>
              </div>

              {/* HIGHLIGHT 2: Predictive Budgeting */}
              <div className="card-showcase animate-float-delayed rounded-2xl p-5 transition-all duration-300 hover:border-cyan-500/30">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Zero-Overspend Guarantee
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      Set monthly expenditure boundaries and receive visual warnings before you overshoot your savings goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* TRUST PILL */}
              <div className="flex items-center gap-3 text-xs text-slate-400 px-1 pt-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Check size={12} />
                </div>
                <span>Free forever • No credit card required • Instant access</span>
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
                  Get Started Free
                </span>
              </div>

              {/* FORM HEADER */}
              <div className="text-left">
                <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Create account
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
                  Start tracking and optimizing your expenses in seconds.
                </p>
              </div>

              {/* FAST GOOGLE AUTH */}
              <div className="mt-7">
                <GoogleAuthButton mode="signup" text="Sign up with Google" />
              </div>

              {/* ELEGANT DIVIDER */}
              <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <div className="relative bg-[#090e15] px-3.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  or register with email
                </div>
              </div>

              {/* CREDENTIALS FORM */}
              <form className="space-y-4" onSubmit={handleSignup}>
                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#0c131c]/70 px-4 py-3 pl-11 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-400/80 focus:bg-[#0f1722] focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="Sandeep Dhakar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                    <User
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

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
                  <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full rounded-2xl border border-white/[0.08] bg-[#0c131c]/70 px-4 py-3 pl-11 pr-11 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-emerald-400/80 focus:bg-[#0f1722] focus:ring-4 focus:ring-emerald-500/15"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
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

                  {/* INTERACTIVE PASSWORD STRENGTH METER */}
                  {password.length > 0 && (
                    <div className="mt-2.5 animate-fade-in space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Strength:</span>
                        <span className={`font-bold ${passwordStrength.text}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              step <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-white/[0.08]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-emerald-glow relative flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold tracking-tight text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>{loading ? "Creating Account..." : "Create Free Account"}</span>
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </div>
              </form>

              {/* CARD FOOTER */}
              <div className="mt-8 text-center border-t border-white/[0.06] pt-5">
                <p className="text-xs text-slate-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-bold text-emerald-400 transition hover:text-emerald-300 hover:underline"
                  >
                    Sign in
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