import { Bell, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { markNotificationRead } from "../api/notifications";
import { formatDate } from "../utils/format";

export default function NotificationsPanel({
  notifications = [],
  onClose,
  onRead,
}) {
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);

      toast.success("Notification marked as read");
      onRead?.();
    } catch (error) {
      console.error(
        "Failed to mark notification read",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Could not update notification"
      );
    }
  };

  return (
    <div className="fixed left-4 right-4 top-24 z-50 overflow-hidden rounded-[30px] border border-emerald-100/80 bg-gradient-to-br from-white via-emerald-50/80 to-green-100/40 shadow-[0_25px_70px_rgba(16,185,129,0.18)] backdrop-blur-2xl dark:border-emerald-900/40 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/20 dark:shadow-black/40 sm:absolute sm:left-auto sm:right-2 sm:top-[calc(100%-0.5rem)] sm:w-[420px]">
      
      {/* HEADER */}
      <div className="relative border-b border-emerald-100/70 px-5 py-4 dark:border-emerald-900/30">
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_45%)]" />

        <div className="relative flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/30">
              <Bell size={22} />
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Notifications
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Budget alerts & account activity
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-white/70 text-slate-500 shadow-sm transition duration-200 hover:rotate-90 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/30 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
            aria-label="Close notifications"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-xl shadow-emerald-500/30">
            <Bell size={34} className="text-white" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            No notifications yet
          </h3>

          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Your expense updates, budget alerts, and account
            activity will appear here.
          </p>
        </div>
      ) : (
        <div className="max-h-[500px] space-y-3 overflow-y-auto p-4">
          
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group relative overflow-hidden rounded-3xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                notification.is_read
                  ? "border-slate-200/70 bg-white/70 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                  : "border-emerald-200 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100/60 shadow-md shadow-emerald-500/10 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:via-green-950/10 dark:to-emerald-950/20"
              }`}
            >
              
              {!notification.is_read && (
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-400/10 blur-3xl" />
              )}

              <div className="relative flex items-start gap-4">
                
                {/* ICON */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    notification.is_read
                      ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                      : "bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/20"
                  }`}
                >
                  <Bell size={20} />
                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                  
                  <div className="flex items-start justify-between gap-3">
                    
                    <div className="min-w-0">
                      
                      <p
                        className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
                          notification.is_read
                            ? "text-slate-400"
                            : "text-emerald-700 dark:text-emerald-300"
                        }`}
                      >
                        {notification.type || "Update"}
                      </p>

                      <p className="mt-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                        {notification.message}
                      </p>

                      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>

                    {!notification.is_read ? (
                      <button
                        type="button"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-md transition duration-200 hover:scale-105 hover:bg-emerald-100 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
                        onClick={() =>
                          handleMarkRead(notification.id)
                        }
                        aria-label="Mark notification as read"
                      >
                        <Check size={17} />
                      </button>
                    ) : (
                      <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300">
                        Read
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}