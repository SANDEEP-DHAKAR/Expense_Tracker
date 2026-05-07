import { ReceiptText } from "lucide-react";
import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency, formatDate } from "../../utils/format";

export default function RecentTransactions() {
  const { summary } = useDashboard();
  const data = summary?.recent_transactions || [];

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
            Recent transactions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Latest five expenses
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex min-h-44 flex-col items-center justify-center px-5 py-8 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <ReceiptText size={19} />
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            No transactions yet
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add your first expense to start seeing activity here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {data.slice(0, 5).map((txn) => (
                <tr key={txn.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-950/60">
                  <td className="max-w-[220px] px-5 py-4 font-medium text-slate-900 dark:text-slate-100">
                    <span className="block truncate">{txn.note || "No note"}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                    {txn.category || "Uncategorized"}
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                    {formatDate(txn.date)}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-950 dark:text-white">
                    {formatCurrency(txn.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
