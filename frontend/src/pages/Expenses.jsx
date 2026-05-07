import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppShell from "../components/AppShell";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";
import { PanelSkeleton } from "../components/ui/Skeleton";
import { getCategories } from "../api/categories";
import { getExpenses } from "../api/expenses";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const [expenseRes, categoryRes] = await Promise.all([
        getExpenses({ limit: 1000 }),
        getCategories(),
      ]);
      setExpenses(expenseRes?.data?.data || []);
      setCategories(categoryRes?.data?.data || []);
    } catch (err) {
      console.error("FETCH EXPENSES ERROR:", err);
      toast.error(err?.response?.data?.message || "Unable to load expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Ledger
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Expenses
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search, edit, and manage every transaction without losing context.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <AddExpense refresh={fetchExpenses} categories={categories} />

          {loading ? (
            <PanelSkeleton rows={8} />
          ) : (
            <ExpenseList expenses={expenses} refresh={fetchExpenses} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
