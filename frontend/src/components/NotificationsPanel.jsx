import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, Check, Sparkles, X } from "lucide-react";
import toast from "react-hot-toast";
import { markNotificationRead } from "../api/notifications";
import { formatDate } from "../utils/format";

export default function NotificationsPanel({
  notifications = [],
  onClose,
  onRead,
}) {
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      toast.success("Notification marked as read");
      onRead?.();
    } catch (error) {
      console.error("Failed to mark notification read", error);
      toast.error(
        error?.response?.data?.message || "Could not update notification"
      );
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll on mobile while notification sheet is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    if (window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const content = (
    <div className="relative z-[999999]">
      {/* FULL-SCREEN BACKDROP */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:bg-black/25"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* FLOATING NOTIFICATION PANEL (MOBILE BOTTOM-SHEET / MODAL + DESKTOP POPUP) */}
      <div
        className="fixed inset-x-3 top-16 sm:top-20 sm:right-6 sm:inset-x-auto sm:w-[430px] max-h-[82vh] sm:max-h-[580px] flex flex-col overflow-hidden rounded-[28px] sm:rounded-[32px] border border-emerald-200/80 bg-white/95 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-emerald-900/40 dark:bg-slate-950/95 dark:shadow-black/70 transition-all duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Notifications Panel"
      >
        {/* MOBILE TOP DRAG PILL */}
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-slate-300/80 dark:bg-slate-700 sm:hidden" />

        {/* PANEL HEADER */}
        <div className="relative border-b border-emerald-100/70 px-4 py-3.5 sm:px-5 sm:py-4 dark:border-emerald-900/30">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-md shadow-emerald-500/25">
                <Bell size={20} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    Notifications
                  </h2>

                  {unreadCount > 0 ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      {unreadCount} new
                    </span>
                  ) : null}
                </div>

                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Budget alerts & activity updates
                </p>
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-emerald-100 bg-white/80 text-slate-500 shadow-sm transition-all duration-200 hover:rotate-90 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/30 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300 cursor-pointer"
              aria-label="Close notifications"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS CONTENT / SCROLLABLE LIST */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
          {notifications.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-14 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg shadow-emerald-500/25 text-white">
                <Sparkles size={28} />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                All caught up!
              </h3>

              <p className="mt-1.5 max-w-xs text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Your expense updates, budget alerts, and account activity will appear here.
              </p>
            </div>
          ) : (
            /* LIST OF NOTIFICATIONS */
            <div className="space-y-2.5 sm:space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-3.5 sm:p-4 transition-all duration-200 ${
                    notification.is_read
                      ? "border-slate-200/70 bg-white/70 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                      : "border-emerald-200/90 bg-gradient-to-r from-emerald-50/90 via-green-50/70 to-emerald-100/50 shadow-sm shadow-emerald-500/10 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-emerald-950/30"
                  }`}
                >
                  <div className="relative flex items-start gap-3">
                    {/* NOTIFICATION TYPE ICON */}
                    <div
                      className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl ${
                        notification.is_read
                          ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          : "bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-md shadow-emerald-500/20"
                      }`}
                    >
                      <Bell size={17} />
                    </div>

                    {/* CONTENT BODY */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        {/* TYPE & DATE */}
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              notification.is_read
                                ? "text-slate-400 dark:text-slate-500"
                                : "text-emerald-700 dark:text-emerald-300"
                            }`}
                          >
                            {notification.type || "Update"}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 truncate">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>

                        {/* STATUS ACTION */}
                        {!notification.is_read ? (
                          <button
                            type="button"
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-700 shadow-sm transition hover:scale-105 hover:bg-emerald-50 dark:border-emerald-800/60 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40 cursor-pointer"
                            onClick={() => handleMarkRead(notification.id)}
                            aria-label="Mark notification as read"
                            title="Mark as read"
                          >
                            <Check size={13} />
                          </button>
                        ) : (
                          <span className="shrink-0 rounded-full border border-slate-200/80 bg-slate-100/80 px-2 py-0.5 text-[9px] font-semibold text-slate-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500">
                            Read
                          </span>
                        )}
                      </div>

                      {/* MESSAGE */}
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-100 break-words">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}