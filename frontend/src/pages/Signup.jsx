import { useContext, useState } from "react";
import { Eye, EyeOff, WalletCards } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupUser } from "../api/auth";
import { AuthContext } from "../context/AuthContextValue";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
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
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none sm:p-8">
        <div className="mb-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <WalletCards size={21} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Start tracking spending with a clean personal dashboard.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </span>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </span>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-slate-950 transition hover:underline dark:text-white"
          >
            Sign in
          </button>
        </p>
      </section>
    </main>
  );
}
