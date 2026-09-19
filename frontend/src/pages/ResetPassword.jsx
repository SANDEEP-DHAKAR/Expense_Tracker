import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing or expired");
      return;
    }

    if (!password) {
      toast.error("Please enter your new password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({ token, password });

      setIsSuccess(true);
      toast.success(
        response.data?.message || "Password reset successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04130d] px-4 py-10 text-white">
        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold">Invalid or Expired Link</h1>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            This password reset link is invalid or has already expired. Please request a fresh reset link.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
          >
            Request New Reset Link
          </button>
        </div>
      </main>
    );
  }

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
              className="relative h-24 w-24 object-contain drop-shadow-[0_10px_30px_rgba(34,197,94,0.45)]"
            />
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Password Updated!</h2>
            <p className="mt-2 text-sm text-slate-300">
              Your password has been reset successfully. Redirecting you to login...
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
            >
              Go to Sign In Now
            </button>
          </div>
        ) : (
          <>
            {/* Heading */}
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-green-300">
                <ShieldCheck size={14} />
                Set New Password
              </div>

              <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Create a strong new password of at least 8 characters for your account.
              </p>
            </div>

            {/* Form */}
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {/* New Password */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  New Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-green-400 focus:bg-white/10 focus:ring-4 focus:ring-green-500/20"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {/* Confirm Password */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Confirm Password
                </span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-green-400 focus:bg-white/10 focus:ring-4 focus:ring-green-500/20"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1 text-slate-400 transition hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {loading ? "Updating Password..." : "Update Password"}
                </span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-7 text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white hover:underline"
              >
                <ArrowLeft size={16} />
                Cancel and Return to Sign In
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
