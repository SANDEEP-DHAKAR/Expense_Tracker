import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BarChart3, LogOut, ReceiptText, ShieldCheck, Users } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-50/90 px-4 py-3 shadow-sm shadow-slate-200/50 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white xl:hidden">
            <ShieldCheck size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-950 sm:text-base">
              Admin Panel
            </h2>
            <p className="truncate text-xs text-slate-500">
              {adminUser?.user?.email || "Administrator"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <nav className="mt-3 grid grid-cols-3 gap-2 overflow-hidden xl:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition duration-200 ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
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
