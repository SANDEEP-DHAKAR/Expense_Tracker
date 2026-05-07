import { ChartPie } from "lucide-react";
import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency } from "../../utils/format";

export default function CategoryBreakdown() {
  const { summary } = useDashboard();
  const data = summary?.category_breakdown || [];
  const total = data.reduce((sum, item) => sum + Number(item.total || 0), 0);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
            Category breakdown
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ranked by spend
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <ChartPie size={18} />
        </div>
      </div>

      {data.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No category data yet.
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const amount = Number(item.total || 0);
            const percent = total > 0 ? Math.round((amount / total) * 100) : 0;

            return (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate font-medium text-slate-800 dark:text-slate-100">
                    {item.name}
                  </span>
                  <span className="shrink-0 text-slate-500 dark:text-slate-400">
                    {formatCurrency(amount)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
