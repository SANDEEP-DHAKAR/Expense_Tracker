export default function NotificationBell({ count = 0, onClick }) {
    return (
        <button
            onClick={onClick}
            className="relative p-3 rounded-full bg-white shadow hover:bg-gray-50 transition dark:bg-slate-800 dark:hover:bg-slate-700"
            aria-label="Open notifications"
        >
            <span className="text-xl">🔔</span>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {count}
                </span>
            )}
        </button>
    );
}
