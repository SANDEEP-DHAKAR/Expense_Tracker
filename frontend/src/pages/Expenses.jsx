import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppShell from "../components/AppShell";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";
import { PanelSkeleton } from "../components/ui/Skeleton";
import { PageHeader } from "../components/ui/Primitives";
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
        <PageHeader
          eyebrow="Ledger"
          title="Expenses"
          description="Search, edit, and manage every transaction without losing context."
        />

        <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[380px_minmax(0,1fr)]">
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
