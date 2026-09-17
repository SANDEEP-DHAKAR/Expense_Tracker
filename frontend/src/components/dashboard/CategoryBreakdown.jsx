import { ChartPie } from "lucide-react";
import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency } from "../../utils/format";

const CATEGORY_STYLES = [
  { bar: "from-emerald-500 to-green-600", dot: "#10b981", badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" },
  { bar: "from-cyan-500 to-blue-600", dot: "#06b6d4", badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300" },
  { bar: "from-violet-500 to-purple-600", dot: "#8b5cf6", badge: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300" },
  { bar: "from-amber-500 to-orange-600", dot: "#f59e0b", badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300" },
  { bar: "from-rose-500 to-pink-600", dot: "#f43f5e", badge: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300" },
  { bar: "from-blue-500 to-indigo-600", dot: "#3b82f6", badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300" },
];

export default function CategoryBreakdown() {
  const { summary } = useDashboard();

  const data = summary?.category_breakdown || [];

  const total = data.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  return (
    <section className="overflow-hidden rounded-[30px] border border-emerald-100/70 bg-white/80 p-5 shadow-[0_20px_80px_rgba(16,185,129,0.08)] backdrop-blur-2xl dark:border-emerald-900/30 dark:bg-slate-950/70">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Category Breakdown
          </h2>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {data.length} categories tracked
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/25">
          <ChartPie size={20} />
        </div>
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200/80 bg-emerald-50/20 px-5 py-12 text-center dark:border-emerald-900/30 dark:bg-slate-900/40">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/20">
            <ChartPie size={24} />
          </div>

          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No category data yet
          </h3>

          <p className="mt-1.5 max-w-xs text-xs text-slate-500 dark:text-slate-400">
            Start recording expenses to see category analytics.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => {
            const amount = Number(item.total || 0);
            const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
            const style = CATEGORY_STYLES[index % CATEGORY_STYLES.length];

            return (
              <div
                key={item.name}
                className="group rounded-2xl border border-slate-200/60 bg-white/60 p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
              >
                {/* TOP ROW */}
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: style.dot }}
                    />

                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </p>

                    <span className="text-xs font-semibold text-slate-400">
                      {percent}%
                    </span>
                  </div>

                  <div
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}
                  >
                    {formatCurrency(amount)}
                  </div>
                </div>

                {/* PROGRESS BAR TRACK */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-700`}
                    style={{
                      width: `${Math.max(percent, 2)}%`,
                    }}
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