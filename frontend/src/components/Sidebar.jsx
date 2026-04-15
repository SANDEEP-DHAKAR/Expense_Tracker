import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="hidden xl:flex w-64 h-screen bg-gray-900 text-white p-5 fixed dark:bg-slate-950">
            <div className="flex flex-col w-full">
                <h1 className="text-2xl font-bold mb-8">💰 Expense</h1>

                <ul className="space-y-4">
                    <li
                        onClick={() => navigate("/")}
                        className="cursor-pointer hover:bg-gray-700 p-2 rounded dark:hover:bg-slate-800"
                    >
                        📊 Dashboard
                    </li>

                    <li
                        onClick={() => navigate("/expenses")}
                        className="cursor-pointer hover:bg-gray-700 p-2 rounded dark:hover:bg-slate-800"
                    >
                        📋 All Expenses
                    </li>

                    <li
                        onClick={() => navigate("/categories")}
                        className="cursor-pointer hover:bg-gray-700 p-2 rounded dark:hover:bg-slate-800"
                    >
                        🏷️ Categories
                    </li>

                    <li
                        onClick={toggleTheme}
                        className="cursor-pointer hover:bg-gray-700 p-2 rounded dark:hover:bg-slate-800"
                    >
                        {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                    </li>

                    <li
                        onClick={handleLogout}
                        className="cursor-pointer hover:bg-red-600 p-2 rounded"
                    >
                        🚪 Logout
                    </li>
                </ul>
            </div>
        </div>
    );
}                       