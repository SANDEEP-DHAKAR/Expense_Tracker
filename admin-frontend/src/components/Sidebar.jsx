import { NavLink } from "react-router-dom";
import { BarChart3, ReceiptText, ShieldCheck, Users } from "lucide-react";

const items = [
  { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { label: "Users", path: "/users", icon: Users },
  { label: "Expenses", path: "/expenses", icon: ReceiptText },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200/80 bg-white/90 px-4 py-5 shadow-sm shadow-slate-200/70 backdrop-blur-xl xl:flex xl:flex-col">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
          <ShieldCheck size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">Expense Admin</p>
          <p className="text-xs text-slate-500">Platform operations</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
