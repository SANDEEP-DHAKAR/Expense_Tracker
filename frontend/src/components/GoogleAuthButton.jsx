import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signInWithGooglePopup } from "../config/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { googleAuth } from "../api/auth";
import { AuthContext } from "../context/AuthContextValue";

export default function GoogleAuthButton({ mode = "signin", text }) {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGooglePopup();
      const user = result.user;

      // Extract Google OAuth credential or Firebase ID token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken || (await user.getIdToken());

      const res = await googleAuth({
        idToken,
        email: user.email,
        name: user.displayName,
      });

      login(res.data);
      toast.success(`Welcome, ${res.data.user?.name || user.displayName || "User"}!`);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error?.code === "auth/popup-closed-by-user") {
        toast("Sign-in cancelled", { icon: "ℹ️" });
        return;
      }
      if (error?.code === "auth/popup-blocked") {
        toast.error("Popup blocked by browser. Please allow popups for localhost.");
        return;
      }
      if (error?.code === "auth/cancelled-popup-request") {
        return;
      }
      if (error?.code === "auth/unauthorized-domain") {
        toast.error("Domain unauthorized in Firebase Console. Add localhost to Authorized domains.");
        return;
      }

      console.error("Google Auth Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Google authentication failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const defaultButtonLabel =
    text || (mode === "signup" ? "Sign up with Google" : "Sign in with Google");

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#131b26]/70 px-4 shadow-md shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#172231]/90 hover:shadow-emerald-500/10 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      {/* Visual Branded Content (Always perfectly styled & visible) */}
      <div className="pointer-events-none flex items-center justify-center gap-3">
        <svg
          className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span className="text-sm font-semibold tracking-tight text-slate-200 transition-colors group-hover:text-white">
          {loading ? "Authenticating with Google..." : defaultButtonLabel}
        </span>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/80 backdrop-blur-sm text-xs font-bold text-emerald-400">
          <svg
            className="mr-2 h-4 w-4 animate-spin text-emerald-400"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Signing in with Google...
        </div>
      )}
    </button>
  );
}
