import NotificationBell from "../NotificationBell";
import { useDashboard } from "../../context/DashboardContext";

export default function Header() {
  const { notificationsCount = 0 } = useDashboard();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      
      {/* LEFT */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Track your spending smartly
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* 🔔 Notification */}
        <NotificationBell count={notificationsCount} />

        {/* ➕ Add Expense Button */}
        <button className="hidden sm:block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm transition">
          + Add Expense
        </button>

      </div>
    </div>
  );
}