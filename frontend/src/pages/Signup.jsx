import { useContext, useState } from "react";
import { signupUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContextValue";
import { Eye, EyeOff } from "lucide-react"; // 👈 icon

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 state

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignup = async () => {
    try {
      const res = await signupUser({ name, email, password });
      const data = res.data;

      toast.success("Signup successful");

      const authData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      };

      login(authData);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 shadow-lg rounded-xl w-80">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

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

        {/* 🔥 Password with icon */}
        <div className="relative mb-2">
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

        <button
          onClick={handleSignup}
          className="bg-green-500 hover:bg-green-600 text-white w-full p-2 rounded-lg transition"
        >
          Signup
        </button>

        <p className="text-sm mt-2">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}