import {
  AlertTriangle,
  CalendarDays,
  Coins,
  Gauge,
  PiggyBank,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency } from "../../utils/format";

export default function StatsCards() {
  const { summary } = useDashboard();

  const totalSpend = Number(summary?.summary?.total_expense || 0);
  const monthlySpend = Number(summary?.summary?.monthly_expense || 0);
  const budgetLimit = Number(
    summary?.budget?.budget || summary?.budget?.monthly_limit || 0
  );
  const spentInBudget = Number(summary?.budget?.spent || 0);
  const remaining = Number(
    summary?.budget?.remaining ?? (budgetLimit > 0 ? budgetLimit - monthlySpend : 0)
  );
  const budgetUsed = Math.round(Number(summary?.budget?.used_percentage || 0));

  const isOverbudget = budgetLimit > 0 && monthlySpend > budgetLimit;
  const isNearLimit = budgetLimit > 0 && budgetUsed >= 80 && !isOverbudget;

  const cards = [
    // 1. THIS MONTH SPENT
    {
      id: "this-month",
      eyebrow: "This Month Spent",
      value: formatCurrency(monthlySpend),
      subtitle:
        budgetLimit > 0
          ? `Budget Target: ${formatCurrency(budgetLimit)}`
          : "Current billing period",
      icon: CalendarDays,
      gradient: "from-emerald-500 to-green-600",
      glowBg: "bg-emerald-500/15",
      border:
        "border-emerald-100/80 hover:border-emerald-300/80 dark:border-emerald-900/30 dark:hover:border-emerald-800/60",
      shadow: "shadow-[0_12px_36px_rgba(16,185,129,0.08)]",
      badge:
        budgetLimit > 0 ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
              isOverbudget
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                : isNearLimit
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
            }`}
          >
            {isOverbudget ? (
              <>
                <TrendingDown size={11} />
                Exceeded
              </>
            ) : (
              <>
                <TrendingUp size={11} />
                {budgetUsed}% Used
              </>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            Current
          </span>
        ),
    },

    // 2. MONTHLY BACHAT (SAVINGS)
    {
      id: "monthly-savings",
      eyebrow: "Monthly Bachat (Savings)",
      value:
        budgetLimit > 0
          ? remaining >= 0
            ? `+${formatCurrency(remaining)}`
            : `-${formatCurrency(Math.abs(remaining))}`
          : "Plan Budget",
      subtitle:
        budgetLimit > 0
          ? remaining >= 0
            ? "Saved from monthly limit"
            : "Spent over target limit"
          : "Set a budget to track savings",
      icon: PiggyBank,
      gradient: "from-cyan-500 to-blue-600",
      glowBg: "bg-cyan-500/15",
      border:
        "border-cyan-100/80 hover:border-cyan-300/80 dark:border-cyan-900/30 dark:hover:border-cyan-800/60",
      shadow: "shadow-[0_12px_36px_rgba(6,182,212,0.08)]",
      badge:
        budgetLimit > 0 ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black ${
              remaining >= 0
                ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
            }`}
          >
            {remaining >= 0 ? (
              <>
                <TrendingUp size={11} />
                {100 - Math.min(budgetUsed, 100)}% Left
              </>
            ) : (
              <>
                <TrendingDown size={11} />
                Overbudget
              </>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Unset
          </span>
        ),
    },

    // 3. BUDGET UTILIZATION
    {
      id: "budget-health",
      eyebrow: "Budget Utilization",
      value: budgetLimit > 0 ? `${budgetUsed}%` : "Not Set",
      subtitle:
        budgetLimit > 0
          ? `${formatCurrency(Math.max(budgetLimit - spentInBudget, 0))} remaining`
          : "No monthly target active",
      icon: Gauge,
      gradient: "from-violet-500 to-indigo-600",
      glowBg: "bg-violet-500/15",
      border:
        "border-violet-100/80 hover:border-violet-300/80 dark:border-violet-900/30 dark:hover:border-violet-800/60",
      shadow: "shadow-[0_12px_36px_rgba(139,92,246,0.08)]",
      showProgressBar: budgetLimit > 0,
      progressPercent: Math.min(budgetUsed, 100),
      badge:
        budgetLimit > 0 ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
              isOverbudget
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                : isNearLimit
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                  : "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300"
            }`}
          >
            {isOverbudget ? (
              <>
                <AlertTriangle size={11} />
                Exceeded
              </>
            ) : isNearLimit ? (
              <>
                <AlertTriangle size={11} />
                Near Limit
              </>
            ) : (
              <>
                <ShieldCheck size={11} />
                Healthy
              </>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Inactive
          </span>
        ),
    },

    // 4. ALL-TIME SPEND
    {
      id: "all-time",
      eyebrow: "All-Time Spend",
      value: formatCurrency(totalSpend),
      subtitle: "Cumulative recorded expenses",
      icon: Coins,
      gradient: "from-amber-500 to-orange-600",
      glowBg: "bg-amber-500/15",
      border:
        "border-amber-100/80 hover:border-amber-300/80 dark:border-amber-900/30 dark:hover:border-amber-800/60",
      shadow: "shadow-[0_12px_36px_rgba(245,158,11,0.08)]",
      badge: (
        <span className="inline-flex items-center rounded-full bg-amber-100/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
          Lifetime
        </span>
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-[28px] border bg-white/80 p-5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/80 ${card.border} ${card.shadow}`}
          >
            {/* AMBIENT RADIAL LIGHT GLOW */}
            <div
              className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-20 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-30 bg-gradient-to-br ${card.gradient}`}
            />

            {/* TOP LINE ACCENT */}
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-70 transition-opacity duration-300 group-hover:opacity-100 ${card.gradient}`}
            />

            {/* HEADER: EYEBROW + ICON */}
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  {card.eyebrow}
                </p>
                <div className="mt-1.5">{card.badge}</div>
              </div>

              {/* ICON SQUIRCLE WITH FINTECH GRADIENT */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${card.gradient}`}
              >
                <Icon size={20} className="stroke-[2.2]" />
              </div>
            </div>

            {/* MIDDLE: BIG VALUE */}
            <div className="relative z-10 mt-4">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {card.value}
              </h3>
            </div>

            {/* FOOTER: PROGRESS BAR OR SUBTITLE */}
            <div className="relative z-10 mt-3 border-t border-slate-100/80 pt-2.5 dark:border-slate-800/80">
              {card.showProgressBar ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Usage</span>
                    <span>{card.subtitle}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverbudget
                          ? "bg-rose-500"
                          : isNearLimit
                            ? "bg-amber-500"
                            : "bg-gradient-to-r from-violet-500 to-indigo-600"
                      }`}
                      style={{ width: `${card.progressPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {card.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}