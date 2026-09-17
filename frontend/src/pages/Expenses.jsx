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

  // FETCH DATA (safe + optimized)
  const fetchExpenses = useCallback(async () => {
    setLoading(true);

    try {
      const [expenseRes, categoryRes] = await Promise.all([
        getExpenses({ limit: 1000 }),
        getCategories(),
      ]);

      setExpenses(expenseRes?.data?.data || []);
      setCategories(categoryRes?.data?.data || []);
    } catch (err) {
      console.error("FETCH EXPENSES ERROR:", err);

      toast.error(
        err?.response?.data?.message || "Unable to load expenses"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // INITIAL LOAD
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const [expenseRes, categoryRes] = await Promise.all([
          getExpenses({ limit: 1000 }),
          getCategories(),
        ]);

        if (!mounted) return;
        setExpenses(expenseRes?.data?.data || []);
        setCategories(categoryRes?.data?.data || []);
      } catch (err) {
        if (mounted) {
          toast.error(
            err?.response?.data?.message || "Unable to load expenses"
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppShell>
      {/* PREMIUM BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-[-150px] right-[-120px] h-[320px] w-[320px] rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-lime-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* HEADER */}
        <PageHeader
          eyebrow="Expense Management"
          title="Expenses"
          description="Track, manage, search, and organize every transaction with a premium experience."
        />

        {/* CONTENT */}
        <div className="grid items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)] 2xl:grid-cols-[420px_minmax(0,1fr)]">
          {/* ADD EXPENSE */}
          <div className="w-full">
            <AddExpense
              refresh={fetchExpenses}
              categories={categories}
              compact
            />
          </div>

          {/* LIST / SKELETON */}
          <div className="min-w-0">
            {loading ? (
              <div className="overflow-hidden rounded-[30px] border border-emerald-100/70 bg-white/70 p-6 shadow-[0_20px_80px_rgba(16,185,129,0.08)] backdrop-blur-2xl dark:border-emerald-900/30 dark:bg-slate-950/70">
                <PanelSkeleton rows={8} />
              </div>
            ) : (
              <ExpenseList
                expenses={expenses}
                categories={categories}
                refresh={fetchExpenses}
              />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}