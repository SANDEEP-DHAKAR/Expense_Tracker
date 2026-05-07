import { useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import NotificationBell from "../NotificationBell";
import NotificationsPanel from "../NotificationsPanel";
import { useDashboard } from "../../context/DashboardContextValue";

export default function Header() {
  const {
    notifications = [],
    notificationsCount = 0,
    refresh,
    loading,
  } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);

  const scrollToQuickAdd = () => {
    document.getElementById("quick-add-expense")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="relative flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Overview
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track spend, budget usage, and recent activity in one clean view.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <NotificationBell
          count={notificationsCount}
          onClick={() => setShowNotifications((current) => !current)}
        />
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
        <button
          type="button"
          onClick={scrollToQuickAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus size={16} />
          Add expense
        </button>
      </div>

      {showNotifications ? (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onRead={refresh}
        />
      ) : null}
    </div>
  );
}
