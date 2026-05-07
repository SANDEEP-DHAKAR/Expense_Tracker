import { Bell } from "lucide-react";

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Open notifications"
    >
      <Bell size={17} />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold leading-none text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </button>
  );
}
