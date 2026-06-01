import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setResetLink("");

      const response = await forgotPassword({ email });

      // Show the reset link for development (in production, this would be sent via email)
      if (response.data.resetLink) {
        setResetLink(response.data.resetLink);
        toast.success("Password reset link generated! Check below.");
      } else {
        toast.success(response.data.message || "If an account exists, a reset link has been sent.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8"
      >
        <h1 className="mb-5 text-3xl font-bold">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-green-500 py-3 font-semibold"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {resetLink && (
          <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <p className="mb-2 text-sm text-green-400">
              🔗 Click the link below to reset your password:
            </p>
            <a
              href={resetLink}
              className="break-all text-sm text-green-300 hover:text-green-200 hover:underline"
            >
              {resetLink}
            </a>
            <button
              type="button"
              onClick={() => {
                const url = new URL(resetLink, window.location.origin);
                navigate(`${url.pathname}${url.search}`);
              }}
              className="mt-4 w-full rounded-xl bg-green-500 py-3 font-semibold text-black"
            >
              Open Reset Page
            </button>
            <p className="mt-2 text-xs text-gray-400">
              (In production, this link would be sent to your email)
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
