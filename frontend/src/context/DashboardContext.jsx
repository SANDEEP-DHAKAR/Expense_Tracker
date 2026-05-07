import { useCallback, useEffect, useState } from "react";
import { getCategories } from "../api/categories";
import { getDashboardSummary } from "../api/dashboard";
import { getExpenses } from "../api/expenses";
import { getNotifications, getUnreadNotificationCount } from "../api/notifications";
import { DashboardContext } from "./DashboardContextValue";

export default function DashboardProvider({ children }) {
  const [summary, setSummary] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashRes, expRes, catRes, notificationsRes, unreadRes] =
        await Promise.all([
          getDashboardSummary(),
          getExpenses({ limit: 1000 }),
          getCategories(),
          getNotifications().catch(() => ({ data: { data: [] } })),
          getUnreadNotificationCount().catch(() => ({ data: { count: 0 } })),
        ]);

      setSummary(dashRes?.data || {});
      setExpenses(
        (expRes?.data?.data || []).map((expense) => ({
          ...expense,
          amount: Number(expense.amount || 0),
        }))
      );
      setCategories(catRes?.data?.data || []);
      setNotifications(notificationsRes?.data?.data || []);
      setNotificationsCount(
        Number(unreadRes?.data?.count || unreadRes?.data?.data?.count || 0)
      );
    } catch (err) {
      console.error("DASHBOARD FETCH ERROR:", err);
      setError(err?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <DashboardContext.Provider
      value={{
        summary,
        expenses,
        categories,
        notifications,
        notificationsCount,
        loading,
        error,
        refresh: fetchAll,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
