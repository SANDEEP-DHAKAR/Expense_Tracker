import { Bell } from "lucide-react";

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open notifications"
      className="
        group relative inline-flex
        h-10 w-10 sm:h-11 sm:w-11
        flex-shrink-0
        items-center justify-center
        overflow-hidden rounded-xl sm:rounded-2xl

        border border-cyan-200/60
        bg-white/80
        text-slate-700

        shadow-[0_8px_24px_rgba(6,182,212,0.10)]
        backdrop-blur-xl

        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-cyan-300
        hover:bg-cyan-50/80
        hover:text-cyan-700
        hover:shadow-[0_14px_40px_rgba(6,182,212,0.18)]

        active:scale-[0.96]

        dark:border-cyan-900/50
        dark:bg-slate-950/70
        dark:text-slate-200
        dark:hover:border-cyan-700/60
        dark:hover:bg-cyan-950/20
        dark:hover:text-cyan-300
      "
    >
      {/* Glow Layer */}
      <div
        className="
          absolute inset-0
          opacity-0 transition-opacity duration-300
          group-hover:opacity-100
          bg-gradient-to-br from-cyan-400/10 via-sky-400/5 to-transparent
        "
      />

      {/* Bell Icon */}
      <Bell
        size={18}
        className="
          relative z-10
          transition-transform duration-300
          group-hover:rotate-12
          group-hover:scale-110
        "
      />

      {/* Notification Count */}
      {count > 0 && (
        <span
          className="
            absolute
            -right-1 -top-1 sm:-right-1.5 sm:-top-1.5
            z-20

            flex min-h-[18px] min-w-[18px]
            sm:min-h-[22px] sm:min-w-[22px]

            items-center justify-center
            rounded-full

            border-2 border-white
            bg-gradient-to-r from-cyan-500 to-sky-500

            px-1
            text-[9px] sm:text-[10px]
            font-bold leading-none text-white

            shadow-lg shadow-cyan-500/30
            animate-pulse

            dark:border-slate-950
          "
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}