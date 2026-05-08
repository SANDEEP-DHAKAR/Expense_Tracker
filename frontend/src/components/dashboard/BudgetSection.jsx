import { Wallet, TrendingUp } from "lucide-react";
import { useDashboard } from "../../context/DashboardContextValue";
import BudgetProgress from "../BudgetProgress";

export default function BudgetSection() {
  const { summary, refresh } = useDashboard();

  const spent = Number(summary?.budget?.spent || 0);
  const total = Number(
    summary?.budget?.budget ||
      summary?.budget?.monthly_limit ||
      0
  );

  const percent =
    total > 0 ? Math.min(Math.round((spent / total) * 100), 100) : 0;

  return (
    <section className="relative overflow-hidden rounded-[28px]">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 dark:from-cyan-400/10 dark:via-blue-400/5 dark:to-indigo-400/10" />

      {/* Blur Effect */}
      <div className="absolute -top-20 left-0 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/10" />

      <div className="relative rounded-[28px] border border-white/60 bg-white/80 p-5 shadow-[0_20px_60px_-20px_rgba(6,182,212,0.30)] backdrop-blur-2xl dark:border-slate-800/70 dark:bg-slate-900/85">
        
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
                <Wallet size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Monthly Budget
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Control your monthly spending
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-cyan-200/70 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300 sm:flex">
            <TrendingUp size={13} />
            {percent}% Used
          </div>
        </div>

        {/* Budget Progress Component */}
        <div className="rounded-2xl border border-slate-100 bg-white/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
          <BudgetProgress
            spent={spent}
            budget={total}
            onUpdate={refresh}
          />
        </div>
      </div>
    </section>
  );
}