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

export default function MobileNavbar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-5 border-b border-slate-200/80 bg-slate-50/90 px-4 py-3 shadow-sm shadow-slate-200/50 backdrop-blur-xl sm:-mx-6 sm:px-6 xl:hidden dark:border-slate-800/80 dark:bg-slate-950/90 dark:shadow-none">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <WalletCards size={18} />
          </div>
          <span className="text-sm font-semibold">Expense</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300"
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>

      <nav className="mt-3 grid grid-cols-3 gap-2 overflow-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition duration-200 ${
                  isActive
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon size={15} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
