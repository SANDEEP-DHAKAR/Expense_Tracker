import { Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { markNotificationRead } from "../api/notifications";
import { formatDate } from "../utils/format";

export default function NotificationsPanel({ notifications = [], onClose, onRead }) {
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      toast.success("Notification marked as read");
      onRead?.();
    } catch (error) {
      console.error("Failed to mark notification read", error);
      toast.error(error?.response?.data?.message || "Could not update notification");
    }
  };

  return (
    <div className="absolute right-4 top-[calc(100%-0.75rem)] z-50 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-950 sm:right-5">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
            Notifications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Budget and account updates
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
          aria-label="Close notifications"
        >
          <X size={16} />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          No notifications yet.
        </div>
      ) : (
        <div className="max-h-[420px] space-y-2 overflow-y-auto pt-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-3 transition ${
                notification.is_read
                  ? "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70"
                  : "border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {notification.type || "Update"}
                  </p>
                  <p className="mt-1 text-sm text-slate-800 dark:text-slate-100">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {formatDate(notification.created_at)}
                  </p>
                </div>

                {!notification.is_read ? (
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-700 shadow-sm transition hover:bg-indigo-100 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800"
                    onClick={() => handleMarkRead(notification.id)}
                    aria-label="Mark notification as read"
                  >
                    <Check size={15} />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
