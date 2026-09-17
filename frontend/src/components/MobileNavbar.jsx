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
  { label: "Dashboard", path: "/dashboard", icon: ChartNoAxesCombined },
  { label: "Expenses", path: "/expenses", icon: ReceiptText },
  { label: "Budgets", path: "/budgets", icon: PiggyBank },
  { label: "Categories", path: "/categories", icon: FolderKanban },
];

export default function MobileNavbar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="
        sticky top-0 z-40
        -mx-4 mb-5
        border-b border-emerald-100/60
        bg-white/75
        px-4 py-3
        shadow-[0_8px_30px_rgba(16,185,129,0.08)]
        backdrop-blur-2xl
        sm:-mx-6 sm:px-6
        xl:hidden
        dark:border-emerald-900/30
        dark:bg-slate-950/80
      "
    >
      {/* TOP */}
      <div className="flex items-center justify-between gap-3">
        {/* BRAND */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              relative flex h-11 w-11 shrink-0 items-center justify-center
              overflow-hidden rounded-2xl
              border border-emerald-200/60
              bg-gradient-to-br from-emerald-500 to-green-700
              shadow-lg shadow-emerald-500/25
            "
          >
            {/* ✅ PUBLIC FOLDER IMAGE */}
            <img
              src="/Expense-frontend-logo.png"
              alt="Expense Tracker"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-white/10" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-wide text-slate-900 dark:text-white">
              Expense Tracker
            </h1>

            <p className="truncate text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Smart Finance Manager
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {/* THEME */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="
              group inline-flex h-10 w-10 items-center justify-center
              rounded-xl border border-emerald-100
              bg-white text-slate-700 shadow-sm
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-emerald-300
              hover:bg-emerald-50
              hover:text-emerald-700

              dark:border-slate-800
              dark:bg-slate-900
              dark:text-slate-200
              dark:hover:border-emerald-800
              dark:hover:bg-emerald-950/30
              dark:hover:text-emerald-300
            "
          >
            {theme === "dark" ? (
              <Sun
                size={17}
                className="transition-transform group-hover:rotate-12"
              />
            ) : (
              <Moon
                size={17}
                className="transition-transform group-hover:-rotate-12"
              />
            )}
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="
              group inline-flex h-10 w-10 items-center justify-center
              rounded-xl border border-rose-100
              bg-rose-50 text-rose-700 shadow-sm
              transition-all duration-300
              hover:-translate-y-0.5 hover:bg-rose-100

              dark:border-rose-950
              dark:bg-rose-950/30
              dark:text-rose-300
              dark:hover:bg-rose-950/50
            "
          >
            <LogOut
              size={17}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="mt-4 grid grid-cols-4 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                  relative flex min-h-[54px] min-w-0 flex-col
                  items-center justify-center gap-1
                  overflow-hidden rounded-2xl
                  px-2 py-2 text-[11px] font-semibold
                  transition-all duration-300

                  ${
                    isActive
                      ? `
                        border border-emerald-200
                        bg-gradient-to-br from-emerald-500 to-green-700
                        text-white
                        shadow-lg shadow-emerald-500/25
                        dark:border-emerald-700
                      `
                      : `
                        border border-slate-200/80
                        bg-white/80
                        text-slate-600
                        hover:-translate-y-0.5
                        hover:border-emerald-200
                        hover:bg-emerald-50
                        hover:text-emerald-700

                        dark:border-slate-800
                        dark:bg-slate-900/70
                        dark:text-slate-300
                        dark:hover:border-emerald-900
                        dark:hover:bg-emerald-950/20
                        dark:hover:text-emerald-300
                      `
                  }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-0 bg-white/5" />
                  )}

                  <Icon
                    size={18}
                    className={`relative z-10 transition-transform duration-300 ${
                      isActive ? "scale-110" : ""
                    }`}
                  />

                  <span className="relative z-10 truncate">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}