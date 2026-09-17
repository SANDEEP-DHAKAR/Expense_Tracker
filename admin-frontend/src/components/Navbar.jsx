import { useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { BarChart3, LogOut, ReceiptText, ShieldCheck, Users, User } from "lucide-react";
import { AdminAuthContext } from "../context/AdminAuthContextValue";

const mobileItems = [
  { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { label: "Users", path: "/users", icon: Users },
  { label: "Expenses", path: "/expenses", icon: ReceiptText },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, adminUser } = useContext(AdminAuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar-glass sticky top-0 z-30 px-4 py-3.5 sm:px-6 lg:px-8 border-b border-white/[0.06] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        {/* LEFT BRAND FOR MOBILE / SCREEN TITLE */}
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-glow xl:hidden">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gradient sm:text-xl">
              Admin Panel
            </h2>
            <p className="truncate text-xs text-slate-400">
              {adminUser?.user?.email || "admin@example.com"}
            </p>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          {/* ADMIN BADGE */}
          <div className="hidden sm:flex items-center gap-2.5 glass-heavy rounded-xl px-3.5 py-1.5 border border-emerald-500/20 bg-slate-900/60">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <User size={14} />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-emerald-400 leading-none">Super Admin</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Online</p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-3.5 text-xs font-semibold text-rose-400 border border-rose-500/20 bg-rose-500/[0.06] hover:border-rose-500/40 hover:bg-rose-500/15 transition-all duration-300"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION TABS */}
      <nav className="mt-3 grid grid-cols-3 gap-2 overflow-hidden xl:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-xl px-2.5 text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-glow"
                  : "glass-light text-slate-400 hover:text-white hover:bg-white/[0.04] border border-white/[0.06]"
              }`}
            >
              <Icon size={15} className={isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-400"} />
              <span className="truncate font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
