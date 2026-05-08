import {
  ArrowUpRight,
  ReceiptText,
} from "lucide-react";

import { useDashboard } from "../../context/DashboardContextValue";

import {
  formatCurrency,
  formatDate,
} from "../../utils/format";

export default function RecentTransactions() {
  const { summary } = useDashboard();

  const data =
    summary?.recent_transactions || [];

  return (
    <section className="group relative overflow-hidden rounded-[30px] border border-emerald-200/30 bg-white/80 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl transition-all duration-500 hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/80">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-lime-400/10 blur-3xl" />

      {/* HEADER */}
      <div className="relative z-10 flex flex-col gap-4 border-b border-slate-200/70 px-6 py-5 dark:border-slate-800">
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-300">
              Activity
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your latest financial activity
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <ReceiptText size={22} />
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 ? (
        <div className="relative z-10 flex min-h-[320px] flex-col items-center justify-center px-6 py-10 text-center">
          
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <ReceiptText size={28} />
          </div>

          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            No transactions yet
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
            Add your first expense and start
            tracking your financial journey.
          </p>
        </div>
      ) : (
        <div className="relative z-10 overflow-hidden">
          
          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-slate-200/70 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/40">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    Note
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {data
                  .slice(0, 5)
                  .map((txn, index) => (
                    <tr
                      key={txn.id}
                      className="group/row transition-all duration-300 hover:bg-emerald-50/40 dark:hover:bg-slate-950/40"
                    >
                      {/* NOTE */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {txn.note ||
                                "No note"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Expense entry
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center rounded-full border border-emerald-200/50 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-300">
                          {txn.category ||
                            "Uncategorized"}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {formatDate(txn.date)}
                      </td>

                      {/* AMOUNT */}
                      <td className="px-6 py-5 text-right">
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                          
                          <ArrowUpRight
                            size={15}
                          />

                          {formatCurrency(
                            txn.amount
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="space-y-4 p-5 lg:hidden">
            {data
              .slice(0, 5)
              .map((txn, index) => (
                <div
                  key={txn.id}
                  className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-lg shadow-black/[0.02] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    
                    <div className="flex min-w-0 items-start gap-3">
                      
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {txn.note ||
                            "No note"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(
                            txn.date
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(
                        txn.amount
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-emerald-200/50 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-300">
                      {txn.category ||
                        "Uncategorized"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}