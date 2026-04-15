import { useState, useContext } from "react";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event?.preventDefault();

        if (!email || !password) {
            return alert("Please fill all fields");
        }

        try {
            setLoading(true);

            const res = await loginUser({ email, password });

            // 🔐 Save user + token
            login(res.data);

            // 🔁 Redirect
            navigate("/");
        } catch (error) {
            const errorData = error.response?.data;
            const errorMessage =
                errorData?.message ||
                (typeof errorData === "string" ? errorData : null) ||
                error.message ||
                "Login failed";

            alert(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
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

                    <input
                        type="password"
                        className="border p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

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