import { useState, useContext } from "react";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await loginUser({ email, password });

            // 🔐 Save user + token
            login(res.data);

            // 🔁 Redirect
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-6 shadow-lg rounded-xl w-80">
                <h2 className="text-xl font-bold mb-4">Login</h2>

                <input
                    className="border p-2 w-full mb-2"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="border p-2 w-full mb-2"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white w-full p-2"
                >
                    Login
                </button>
            </div>
        </div>
    );
}