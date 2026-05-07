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
      <div className="space-y-5">
        <Header />

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={refresh}
                className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <PanelSkeleton key={index} rows={2} />
              ))}
            </div>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
              <PanelSkeleton rows={7} />
              <div className="space-y-5">
                <PanelSkeleton rows={4} />
                <PanelSkeleton rows={4} />
              </div>
            </div>
          </>
        ) : (
          <>
            <StatsCards />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
              <section className="min-w-0 space-y-5">
                <ChartsSection />
                <RecentTransactions />
              </section>

              <aside className="min-w-0 space-y-5">
                <BudgetSection />
                <CategoryBreakdown />
                <AddExpenseQuick />
              </aside>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
