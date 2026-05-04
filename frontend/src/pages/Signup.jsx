import { useContext, useState } from "react";
import { signupUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContextValue";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await signupUser({ name, email, password });
      const data = res.data;

      toast.success("Signup successful");

      const authData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      };

      login(authData);

      // ✅ safe redirect
      navigate("/dashboard", { replace: true });

    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 shadow-lg rounded-xl w-80 bg-white">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        {/* 🔥 FORM ADDED */}
        <form onSubmit={handleSignup}>

          <input
            className="border p-2 w-full mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="border p-2 w-full pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* 🔥 BUTTON TYPE FIX */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-lg text-white transition ${loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
              }`}
          >
            {loading ? "Processing..." : "Signup"}
          </button>

        </form>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}