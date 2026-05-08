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

  // INITIAL LOAD (safe unmount handling)
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
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] 2xl:grid-cols-[400px_minmax(0,1fr)]">
          
          {/* ADD EXPENSE */}
          <div className="overflow-hidden rounded-[32px] border border-white/20 bg-white/75 shadow-[0_20px_60px_rgba(16,185,129,0.08)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(16,185,129,0.14)] dark:border-slate-800 dark:bg-slate-900/80">
            <AddExpense
              refresh={fetchExpenses}
              categories={categories}
            />
          </div>

          {/* LIST / SKELETON */}
          <div className="overflow-hidden rounded-[32px] border border-white/20 bg-white/75 shadow-[0_20px_60px_rgba(16,185,129,0.08)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_30px_80px_rgba(16,185,129,0.14)] dark:border-slate-800 dark:bg-slate-900/80">
            {loading ? (
              <div className="p-1">
                <PanelSkeleton rows={8} />
              </div>
            ) : (
              <ExpenseList
                expenses={expenses}
                refresh={fetchExpenses}
              />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}