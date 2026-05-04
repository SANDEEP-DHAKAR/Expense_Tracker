import { useState, useContext } from "react";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContextValue";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!email || !password) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await loginUser({ email, password });

            login(res.data);

            // 🔥 FIXED REDIRECT
            navigate("/dashboard", { replace: true });

        } catch (error) {
            const errorData = error.response?.data;
            const errorMessage =
                errorData?.message ||
                (typeof errorData === "string" ? errorData : null) ||
                error.message ||
                "Login failed";

            toast.error(typeof errorMessage === "string"
                ? errorMessage
                : JSON.stringify(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="p-6 shadow-xl rounded-2xl w-80 bg-white">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Welcome Back 👋
                </h2>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        className="border p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="relative mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="border p-2 w-full pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 text-white w-full p-2 rounded-lg transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-sm mt-4 text-center">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-blue-500 cursor-pointer hover:underline"
                    >
                        Signup
                    </span>
                </p>
            </div>
        </div>
    );
}