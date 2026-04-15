import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

export default function MobileNavbar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="xl:hidden mb-4 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => navigate("/")}
          className="flex-1 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/expenses")}
          className="flex-1 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Expenses
        </button>
        <button
          onClick={() => navigate("/categories")}
          className="flex-1 rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          Categories
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          className="flex-1 rounded-2xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          className="flex-1 rounded-2xl bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
