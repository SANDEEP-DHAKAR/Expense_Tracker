import { useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import NotificationBell from "../NotificationBell";
import NotificationsPanel from "../NotificationsPanel";
import { PageHeader, primaryButtonClass, secondaryButtonClass } from "../ui/Primitives";
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
    <div className="relative">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Track spend, budget usage, and recent activity in one clean view."
        actions={
          <>
            <NotificationBell
              count={notificationsCount}
              onClick={() => setShowNotifications((current) => !current)}
            />
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className={secondaryButtonClass}
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={scrollToQuickAdd}
              className={primaryButtonClass}
            >
              <Plus size={16} />
              Add expense
            </button>
          </>
        }
      />

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
