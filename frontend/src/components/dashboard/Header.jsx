import { useState, useEffect, useRef } from "react";
import {
  Plus,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

import NotificationBell from "../NotificationBell";
import NotificationsPanel from "../NotificationsPanel";

import {
  primaryButtonClass,
} from "../ui/Primitives";

import { useDashboard } from "../../context/DashboardContextValue";

export default function Header() {
  const {
    notifications = [],
    notificationsCount = 0,
    refresh,
    loading,
  } = useDashboard();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const notificationRef = useRef(null);

  const scrollToQuickAdd = () => {
    document
      .getElementById("quick-add-expense")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  /* OUTSIDE CLICK CLOSE */
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="relative z-20 rounded-[32px] border border-emerald-100/70 bg-gradient-to-br from-white via-emerald-50/40 to-green-100/20 p-5 shadow-[0_25px_80px_rgba(16,185,129,0.12)] backdrop-blur-xl dark:border-emerald-900/30 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/10 sm:p-7">
      
      {/* BG EFFECTS */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        
        {/* LEFT */}
        <div className="max-w-2xl">
          
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-900/30 dark:bg-slate-900/60 dark:text-emerald-300">
            <Sparkles size={13} />
            Overview
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Expense Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            Monitor your spending, budgets,
            transactions and financial
            activity with a premium experience.
          </p>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="relative flex flex-wrap items-center gap-3">
          
          {/* NOTIFICATION */}
          <div
            className="relative"
            ref={notificationRef}
          >
            <NotificationBell
              count={notificationsCount}
              onClick={() =>
                setShowNotifications(
                  (current) => !current
                )
              }
            />

            {showNotifications && (
              <div className="absolute right-0 top-14 z-[99999]">
                <NotificationsPanel
                  notifications={notifications}
                  onClose={() =>
                    setShowNotifications(false)
                  }
                  onRead={refresh}
                />
              </div>
            )}
          </div>

          {/* REFRESH */}
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-200/70 bg-white/80 px-5 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-900/30 dark:bg-slate-900/70 dark:text-emerald-300 dark:hover:bg-slate-800"
          >
            <RefreshCcw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {/* ADD */}
          <button
            type="button"
            onClick={scrollToQuickAdd}
            className={`${primaryButtonClass} h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-700 px-5 shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-emerald-500/30`}
          >
            <Plus size={17} />
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
}