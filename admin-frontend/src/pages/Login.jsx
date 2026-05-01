import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { AdminAuthContext } from "../context/AdminAuthContextValue";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AdminAuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      const payload = response?.data;

      if (!payload?.user || payload.user.role !== "admin") {
        setError("Admin access required for this panel.");
        return;
      }

      login(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in with your admin account.</p>

        {error ? <div className="mb-4 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
