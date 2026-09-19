import { useState } from "react";
import { ArrowLeft, Check, Copy, ExternalLink, KeyRound, Mail, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your registered email");
      return;
    }

    try {
      setLoading(true);
      setResetLink("");
      setResetToken("");
      setCopied(false);

      const response = await forgotPassword({ email: email.trim() });
      const data = response.data;

      if (data.resetLink) {
        setResetLink(data.resetLink);
        setResetToken(data.resetToken);
        setEmailSent(Boolean(data.emailSent));
        toast.success(
          data.emailSent
            ? "Reset link sent to your email!"
            : "Password reset link generated successfully!"
        );
      } else {
        toast.success(data.message || "Reset link generated.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate password reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resetLink) return;
    navigator.clipboard.writeText(resetLink);
    setCopied(true);
    toast.success("Reset link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenReset = () => {
    if (resetToken) {
      navigate(`/reset-password?token=${resetToken}`);
    } else if (resetLink) {
      try {
        const url = new URL(resetLink);
        navigate(`${url.pathname}${url.search}`);
      } catch {
        navigate("/login");
      }
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
              className="relative h-24 w-24 object-contain drop-shadow-[0_10px_30px_rgba(34,197,94,0.45)]"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-green-300">
            <KeyRound size={13} />
            Account Recovery
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Enter your registered email address and we&apos;ll create a secure password reset link for you.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Registered Email
            </span>

            <div className="relative">
              <input
                type="email"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-green-400 focus:bg-white/10 focus:ring-4 focus:ring-green-500/20"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={16} />
              {loading ? "Generating Link..." : "Send Reset Link"}
            </span>
          </button>
        </form>

        {/* Reset Link Display Card */}
        {resetLink && (
          <div className="mt-6 animate-fade-in rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Check size={14} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {emailSent ? "Email Sent!" : "Reset Link Ready"}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {emailSent
                ? "A password reset link has been dispatched to your email address."
                : "Your password reset token is active. Click below to reset your password directly:"}
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleOpenReset}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-sm font-bold text-slate-950 shadow-md transition hover:scale-[1.01] active:scale-[0.99]"
              >
                <ExternalLink size={16} />
                Reset Password Now
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? "Link Copied!" : "Copy Reset Link"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-7 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </button>
        </div>
      </section>
    </main>
  );
}
