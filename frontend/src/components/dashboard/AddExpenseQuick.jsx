import { Sparkles } from "lucide-react";
import AddExpense from "../AddExpense";
import { useDashboard } from "../../context/DashboardContextValue";

export default function AddExpenseQuick() {
  const { refresh, categories } = useDashboard();

  return (
    <section
      id="quick-add-expense"
      className="relative overflow-hidden rounded-[28px]"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 dark:from-cyan-400/10 dark:via-blue-400/5 dark:to-indigo-400/10" />

      {/* Top Blur */}
      <div className="absolute -top-24 right-0 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/10" />

      <div className="relative">
        {/* Premium Header */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-cyan-100/70 bg-white/70 px-5 py-4 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
                <Sparkles size={17} />
              </div>

              <div>
                <h2 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-white">
                  Quick Expense
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add a transaction instantly
                </p>
              </div>
            </div>
          </div>

          <div className="hidden rounded-full border border-cyan-200/70 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300 sm:block">
            Fast Entry
          </div>
        </div>

        {/* Expense Form */}
        <div className="rounded-[26px] border border-white/60 bg-white/80 p-[1px] shadow-[0_20px_60px_-20px_rgba(6,182,212,0.35)] backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
          <div className="rounded-[25px] bg-white/95 dark:bg-slate-950/95">
            <AddExpense
              refresh={refresh}
              categories={categories}
              compact
            />
          </div>
        </div>
      </div>
    </section>
  );
}