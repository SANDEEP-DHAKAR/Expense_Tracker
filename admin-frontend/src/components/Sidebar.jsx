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
    <aside className="sidebar-gradient fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-glass-medium shadow-glass xl:flex xl:flex-col">
      <div className="px-6 py-6">
        <div className="flex items-center gap-4 rounded-2xl glass-heavy p-4 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-green-glow">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-gradient">Expense Admin</p>
            <p className="text-xs text-slate-400">Platform operations</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group relative flex min-h-12 items-center gap-4 rounded-xl px-4 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-primary-600/20 to-primary-700/20 text-primary-100 border border-primary-500/30 shadow-gold-glow"
                  : "text-slate-400 hover:text-white hover:bg-glass-light hover:border hover:border-gold-500/20"
              }`}
            >
              <div className={`transition-all duration-300 ${isActive ? 'text-gold-400' : 'text-slate-500 group-hover:text-gold-400'}`}>
                <Icon size={20} />
              </div>
              <span className="transition-all duration-300">{item.label}</span>
              {isActive && (
                <div className="absolute right-2 w-1 h-6 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full animate-glow" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-heavy rounded-xl p-4 border border-gold-500/10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">System Status</span>
          </div>
          <p className="text-sm font-semibold text-green-400 mt-1">All Systems Operational</p>
        </div>
      </div>
    </aside>
  );
}
