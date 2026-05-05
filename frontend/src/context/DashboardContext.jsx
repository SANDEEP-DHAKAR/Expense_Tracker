import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getDashboardSummary } from "../api/dashboard";
import { getExpenses } from "../api/expenses";
import { getCategories } from "../api/categories";

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export default function DashboardProvider({ children }) {
  const [summary, setSummary] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ stable function (no unnecessary re-renders)
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashRes, expRes, catRes] = await Promise.all([
        getDashboardSummary(),
        getExpenses(),
        getCategories(),
      ]);

      // ✅ normalize data
      setSummary(dashRes?.data || {});
      setExpenses(
        (expRes?.data?.data || []).map((e) => ({
          ...e,
          amount: Number(e.amount || 0), // 🔥 FIX
        }))
      );
      setCategories(catRes?.data?.data || []);

    } catch (err) {
      console.error("DASHBOARD FETCH ERROR:", err);
      setError("Failed to load dashboard data");
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
        loading,
        error,
        refresh: fetchAll,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}