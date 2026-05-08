import { ChartPie } from "lucide-react";
import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency } from "../../utils/format";

export default function CategoryBreakdown() {
  const { summary } = useDashboard();

  const data = summary?.category_breakdown || [];

  const total = data.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-100/70 bg-gradient-to-br from-white via-emerald-50/30 to-green-100/20 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.10)] backdrop-blur-xl dark:border-emerald-900/30 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/10">
      
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between gap-4">
        
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Category Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track where your money goes
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/25">
          <ChartPie size={20} />
        </div>
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200/80 bg-white/50 px-5 py-12 text-center dark:border-emerald-900/30 dark:bg-slate-900/40">
          
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/20">
            <ChartPie size={28} />
          </div>

          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No category data yet
          </h3>

          <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Start adding expenses to see category-wise spending analytics.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          
          {data.map((item, index) => {
            const amount = Number(item.total || 0);

            const percent =
              total > 0
                ? Math.round((amount / total) * 100)
                : 0;

            return (
              <div
                key={item.name}
                className="group rounded-2xl border border-emerald-100/60 bg-white/70 p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-500/10 dark:border-emerald-900/20 dark:bg-slate-900/50"
              >
                
                {/* TOP */}
                <div className="mb-3 flex items-center justify-between gap-3">
                  
                  <div className="flex min-w-0 items-center gap-3">
                    
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {percent}% of total spending
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {formatCurrency(amount)}
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="relative h-3 overflow-hidden rounded-full bg-emerald-100/80 dark:bg-emerald-950/20">
                  
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-green-700 transition-all duration-700"
                    style={{
                      width: `${percent}%`,
                    }}
                  />

                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}