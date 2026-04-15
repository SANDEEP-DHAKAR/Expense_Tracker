export default function NotificationBell({ count = 0, onClick }) {
    return (
        <button
            onClick={onClick}
            className="relative p-2 sm:p-3 rounded-full bg-white shadow hover:bg-gray-50 transition dark:bg-slate-800 dark:hover:bg-slate-700 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
            aria-label="Open notifications"
        >
            <span className="text-lg sm:text-xl">🔔</span>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] sm:text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {count}
                </span>
            )}
        </button>
    );
}
