import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BarChart3, LogOut, ReceiptText, ShieldCheck, Users, User } from "lucide-react";
import { AdminAuthContext } from "../context/AdminAuthContextValue";

const mobileItems = [
  { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { label: "Users", path: "/users", icon: Users },
  { label: "Expenses", path: "/expenses", icon: ReceiptText },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, adminUser } = useContext(AdminAuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar-glass sticky top-0 z-30 border-b border-glass-medium shadow-glass-sm px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-green-glow xl:hidden">
            <ShieldCheck size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-gradient sm:text-xl">
              Admin Panel
            </h2>
            <p className="truncate text-sm text-slate-400">
              {adminUser?.user?.email || "Administrator"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 glass-heavy rounded-xl px-4 py-2 border border-gold-500/10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 text-white">
              <User size={16} />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-gold-400">Admin</p>
              <p className="text-xs text-slate-400">Online</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn-secondary inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium text-red-400 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <nav className="mt-4 grid grid-cols-3 gap-2 overflow-hidden xl:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl px-3 text-xs font-medium transition-all duration-300 ${isActive
                  ? "bg-gradient-to-r from-primary-600/20 to-primary-700/20 text-primary-100 border border-primary-500/30 shadow-gold-glow"
                  : "glass-light text-slate-400 hover:text-white hover:bg-glass-light hover:border hover:border-gold-500/20"
                }`
              }
            >
              <div className={`transition-all duration-300 ${isActive ? 'text-gold-400' : 'text-slate-500 group-hover:text-gold-400'}`}>
                <Icon size={16} />
              </div>
              <span className="truncate font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
