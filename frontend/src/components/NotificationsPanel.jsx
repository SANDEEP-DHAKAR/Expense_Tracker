import { markNotificationRead } from "../api/notifications";

export default function NotificationsPanel({ notifications = [], onClose, onRead }) {
    const handleMarkRead = async (id) => {
        try {
            await markNotificationRead(id);
            onRead();
        } catch (error) {
            console.error("Failed to mark notification read", error);
        }
    };

    return (
        <div className="absolute right-6 top-24 w-[360px] bg-white shadow-2xl rounded-3xl border border-gray-200 p-4 z-50 dark:bg-slate-900 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white">Close</button>
            </div>

            {notifications.length === 0 ? (
                <div className="text-gray-500 dark:text-slate-400">No notifications yet.</div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-3 rounded-2xl border ${notification.is_read ? 'bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700' : 'bg-white border-indigo-200 dark:bg-slate-950 dark:border-indigo-400'}`}
                        >
                            <div className="flex justify-between items-start gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{notification.type.toUpperCase()}</p>
                                    <p className="text-sm text-gray-700 dark:text-slate-300">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-2 dark:text-slate-500">{new Date(notification.created_at).toLocaleString()}</p>
                                </div>
                                {!notification.is_read && (
                                    <button
                                        className="text-xs text-indigo-600 hover:underline dark:text-indigo-300"
                                        onClick={() => handleMarkRead(notification.id)}
                                    >
                                        Mark read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
