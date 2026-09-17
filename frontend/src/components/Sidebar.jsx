import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChartNoAxesCombined,
  FolderKanban,
  LogOut,
  Moon,
  PiggyBank,
  ReceiptText,
  Sun,
} from "lucide-react";

import { AuthContext } from "../context/AuthContextValue";
import { ThemeContext } from "../context/ThemeContextValue";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: ReceiptText,
  },
  {
    label: "Budgets",
    path: "/budgets",
    icon: PiggyBank,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: FolderKanban,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const { logout, user } = useContext(AuthContext);

  const { theme, toggleTheme } =
    useContext(ThemeContext);

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  const displayName =
    user?.user?.name ||
    user?.name ||
    "Expense User";

  const displayEmail =
    user?.user?.email ||
    user?.email ||
    "Smart Finance";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 overflow-hidden border-r border-white/20 bg-white/75 px-4 py-5 shadow-[0_10px_60px_-15px_rgba(6,182,212,0.35)] backdrop-blur-2xl xl:flex xl:flex-col dark:border-slate-800/70 dark:bg-[#020617]/85">
      
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl dark:bg-cyan-500/10" />

        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />
      </div>

      {/* Brand */}
      <div className="relative flex items-center gap-3 rounded-2xl border border-white/40 bg-white/60 px-3 py-3 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/60">
        
        {/* Logo */}
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
          <img
            src="/Expense-frontend-logo.png"
            alt="Expense Tracker Logo"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Brand Text */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Expense Tracker
          </h1>

          <p className="truncate text-xs font-medium tracking-wide text-cyan-700 dark:text-cyan-300">
            SMART FINANCE SYSTEM
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex min-h-[52px] items-center gap-3 overflow-hidden rounded-2xl px-4 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900/70 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Glow */}
                  {isActive ? (
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18),transparent)]" />
                  ) : null}

                  <div
                    className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-700 group-hover:bg-cyan-100 group-hover:text-cyan-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-cyan-950/40 dark:group-hover:text-cyan-300"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <span className="relative">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="relative mt-auto space-y-4">
        
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="group flex min-h-[52px] w-full items-center justify-between rounded-2xl border border-white/40 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:bg-white dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          <span className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25">
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </div>

            {theme === "dark"
              ? "Light Mode"
              : "Dark Mode"}
          </span>
        </button>

        {/* User Card */}
        <div className="rounded-3xl border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/70">
          
          <div className="mb-4 flex items-center gap-3">
            
            {/* Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-base font-bold text-white shadow-lg shadow-cyan-500/25">
              {displayName?.charAt(0)?.toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {displayName}
              </p>

              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {displayEmail}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-[1.01] hover:from-rose-600 hover:to-red-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}