import AppShell from "../components/AppShell";

import AddExpenseQuick from "../components/dashboard/AddExpenseQuick";
import BudgetSection from "../components/dashboard/BudgetSection";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import ChartsSection from "../components/dashboard/ChartsSection";
import Header from "../components/dashboard/Header";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import StatsCards from "../components/dashboard/StatsCards";

import { PanelSkeleton } from "../components/ui/Skeleton";

import { useDashboard } from "../context/DashboardContextValue";

export default function DashboardLayout() {
  const { loading, error, refresh } = useDashboard();

  return (
    <AppShell>
      {/* PREMIUM BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute bottom-[-150px] right-[-120px] h-[320px] w-[320px] rounded-full bg-green-400/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-lime-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* HEADER */}
        <Header />

        {/* ERROR */}
        {error ? (
          <div className="overflow-hidden rounded-[32px] border border-rose-200/60 bg-gradient-to-br from-rose-50 via-white to-rose-100/50 p-5 shadow-[0_20px_60px_rgba(244,63,94,0.10)] backdrop-blur-xl dark:border-rose-900/40 dark:from-rose-950/40 dark:via-slate-950 dark:to-slate-900">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-rose-700 dark:text-rose-300">
                  Something went wrong
                </h3>

                <p className="mt-1 text-sm text-rose-600/90 dark:text-rose-200/80">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={refresh}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-rose-700 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/40 active:scale-[0.98]"
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}

        {/* LOADING */}
        {loading ? (
          <>
            {/* STATS SKELETON */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[30px] border border-white/20 bg-white/70 p-1 shadow-[0_20px_50px_rgba(16,185,129,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <PanelSkeleton rows={2} />
                </div>
              ))}
            </div>

            {/* MAIN GRID SKELETON */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
              <div className="overflow-hidden rounded-[30px] border border-white/20 bg-white/70 p-1 shadow-[0_20px_50px_rgba(16,185,129,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                <PanelSkeleton rows={8} />
              </div>

              <div className="space-y-6">
                <div className="overflow-hidden rounded-[30px] border border-white/20 bg-white/70 p-1 shadow-[0_20px_50px_rgba(16,185,129,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                  <PanelSkeleton rows={4} />
                </div>

                <div className="overflow-hidden rounded-[30px] border border-white/20 bg-white/70 p-1 shadow-[0_20px_50px_rgba(16,185,129,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                  <PanelSkeleton rows={4} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* STATS */}
            <div className="animate-[fadeIn_0.5s_ease]">
              <StatsCards />
            </div>

            {/* MAIN CONTENT */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
              
              {/* LEFT SIDE */}
              <section className="min-w-0 space-y-6">
                
                {/* CHARTS */}
                <div className="group overflow-hidden rounded-[32px] border border-white/20 bg-white/75 shadow-[0_20px_60px_rgba(16,185,129,0.08)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(16,185,129,0.14)] dark:border-slate-800 dark:bg-slate-900/80">
                  <ChartsSection />
                </div>

                {/* RECENT TRANSACTIONS */}
                <div className="group overflow-hidden rounded-[32px] border border-white/20 bg-white/75 shadow-[0_20px_60px_rgba(16,185,129,0.08)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(16,185,129,0.14)] dark:border-slate-800 dark:bg-slate-900/80">
                  <RecentTransactions />
                </div>
              </section>

              {/* RIGHT SIDE */}
              <aside className="min-w-0 space-y-6">
                {/* 1. QUICK ADD EXPENSE */}
                <AddExpenseQuick />

                {/* 2. MONTHLY BUDGET */}
                <div className="group overflow-hidden rounded-[32px] border border-white/20 bg-white/75 shadow-[0_20px_60px_rgba(16,185,129,0.08)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(16,185,129,0.14)] dark:border-slate-800 dark:bg-slate-900/80">
                  <BudgetSection />
                </div>

                {/* 3. CATEGORY BREAKDOWN */}
                <div className="group overflow-hidden rounded-[32px] border border-white/20 bg-white/75 shadow-[0_20px_60px_rgba(16,185,129,0.08)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(16,185,129,0.14)] dark:border-slate-800 dark:bg-slate-900/80">
                  <CategoryBreakdown />
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}