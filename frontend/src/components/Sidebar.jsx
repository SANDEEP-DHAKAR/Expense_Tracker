import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChartNoAxesCombined,
  FolderKanban,
  LogOut,
  Moon,
  ReceiptText,
  Sun,
  WalletCards,
} from "lucide-react";
import { AuthContext } from "../context/AuthContextValue";
import { ThemeContext } from "../context/ThemeContextValue";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: ChartNoAxesCombined },
  { label: "Expenses", path: "/expenses", icon: ReceiptText },
  { label: "Categories", path: "/categories", icon: FolderKanban },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.user?.name || user?.name || "Expense user";
  const displayEmail = user?.user?.email || user?.email || "Personal finance";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200/80 bg-white/90 px-4 py-5 shadow-sm shadow-slate-200/70 backdrop-blur-xl xl:flex xl:flex-col dark:border-slate-800/80 dark:bg-slate-950/85 dark:shadow-none">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <WalletCards size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
            Expense
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            Smart tracker
          </p>
        </div>
      </div>

      <nav className="mt-8 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex min-h-10 w-full items-center justify-between rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <span className="flex items-center gap-3">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-900/50">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
            {displayName}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {displayEmail}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
