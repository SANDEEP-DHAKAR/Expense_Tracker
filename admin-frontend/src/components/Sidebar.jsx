import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, ReceiptText, ShieldCheck, Users } from "lucide-react";

const items = [
  { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { label: "Users", path: "/users", icon: Users },
  { label: "Expenses", path: "/expenses", icon: ReceiptText },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar-gradient fixed inset-y-0 left-0 z-40 hidden w-72 shadow-glass xl:flex xl:flex-col">
      {/* BRAND HEADER */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3.5 rounded-2xl glass-heavy p-3.5 transition-all duration-300 border border-white/[0.08] hover:border-emerald-500/30">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-emerald-glow">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-gradient">Expense Admin</p>
            <p className="text-[11px] font-medium text-slate-400">Platform operations</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group relative flex min-h-12 items-center gap-3.5 rounded-xl px-4 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent text-emerald-300 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08]"
              }`}
            >
              <div
                className={`transition-colors duration-300 ${
                  isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-400"
                }`}
              >
                <Icon size={19} />
              </div>
              <span>{item.label}</span>
              {isActive && (
                <div className="absolute right-2.5 h-5 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* SYSTEM STATUS CARD */}
      <div className="p-4 mt-auto">
        <div className="glass-heavy rounded-2xl p-3.5 border border-emerald-500/15 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              System Status
            </span>
          </div>
          <p className="text-xs font-bold text-emerald-400 mt-1">
            All Systems Operational
          </p>
        </div>
      </div>
    </aside>
  );
}
