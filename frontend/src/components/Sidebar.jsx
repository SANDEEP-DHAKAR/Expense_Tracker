import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextValue";
import { ThemeContext } from "../context/ThemeContextValue";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.log("Logout failed:", err);
        }
    };

    const menu = [
        { label: "📊 Dashboard", path: "/" },
        { label: "📋 All Expenses", path: "/expenses" },
        { label: "🏷️ Categories", path: "/categories" },
    ];

    return (
        <div className="hidden xl:flex w-[250px] shrink-0 min-h-screen bg-gray-900 text-white p-5 dark:bg-slate-950 flex-col">
            <div className="flex flex-col w-full flex-1">

                <h1 className="text-2xl font-bold mb-8">💰 Expense</h1>

                <ul className="space-y-4 flex-1">

                    {menu.map((item) => (
                        <li
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`cursor-pointer p-2 rounded transition ${location.pathname === item.path
                                    ? "bg-gray-700 dark:bg-slate-800"
                                    : "hover:bg-gray-700 dark:hover:bg-slate-800"
                                }`}
                        >
                            {item.label}
                        </li>
                    ))}

                    <li
                        onClick={toggleTheme}
                        className="cursor-pointer hover:bg-gray-700 p-2 rounded transition dark:hover:bg-slate-800"
                    >
                        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </li>

                    <li
                        onClick={handleLogout}
                        className="cursor-pointer hover:bg-red-600 p-2 rounded transition"
                    >
                        🚪 Logout
                    </li>

                </ul>
            </div>
        </div>
    );
}