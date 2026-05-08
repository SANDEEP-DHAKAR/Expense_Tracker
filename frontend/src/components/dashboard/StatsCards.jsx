import {
  ArrowDownRight,
  CalendarDays,
  Gauge,
  ReceiptText,
} from "lucide-react";

import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency } from "../../utils/format";

export default function StatsCards() {
  const { summary } = useDashboard();

  const total = Number(
    summary?.summary?.total_expense || 0
  );

  const monthly = Number(
    summary?.summary?.monthly_expense || 0
  );

  const transactions =
    summary?.recent_transactions?.length || 0;

  const budgetUsed = Math.round(
    summary?.budget?.used_percentage || 0
  );

  const cards = [
    {
      title: "This month",
      value: formatCurrency(monthly, true),
      detail: "Current month spend",
      icon: CalendarDays,

      gradient:
        "from-emerald-500 via-green-500 to-emerald-600",

      glow:
        "shadow-emerald-500/20",

      iconBg:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",

      border:
        "border-emerald-200/40 dark:border-emerald-900/30",
    },

    {
      title: "All-time spend",
      value: formatCurrency(total, true),
      detail: "Across all expenses",
      icon: ArrowDownRight,

      gradient:
        "from-green-500 via-lime-500 to-emerald-500",

      glow:
        "shadow-green-500/20",

      iconBg:
        "bg-green-500/15 text-green-700 dark:text-green-300",

      border:
        "border-green-200/40 dark:border-green-900/30",
    },

    {
      title: "Recent entries",
      value: transactions,
      detail: "Latest transactions",
      icon: ReceiptText,

      gradient:
        "from-yellow-400 via-amber-400 to-orange-400",

      glow:
        "shadow-yellow-500/20",

      iconBg:
        "bg-yellow-400/15 text-yellow-700 dark:text-yellow-300",

      border:
        "border-yellow-200/40 dark:border-yellow-900/30",
    },

    {
      title: "Budget used",
      value: `${budgetUsed}%`,
      detail: "Monthly allocation",
      icon: Gauge,

      gradient:
        "from-teal-500 via-emerald-500 to-green-600",

      glow:
        "shadow-teal-500/20",

      iconBg:
        "bg-teal-500/15 text-teal-700 dark:text-teal-300",

      border:
        "border-teal-200/40 dark:border-teal-900/30",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-3xl border bg-white/75 p-5 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl dark:bg-slate-900/80 ${card.border} ${card.glow}`}
          >
            {/* TOP GRADIENT */}
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.gradient}`}
            />

            {/* GLOW EFFECT */}
            <div
              className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-10 blur-3xl ${card.gradient}`}
            />

            {/* CONTENT */}
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>

                <h3 className="mt-3 truncate text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {card.value}
                </h3>
              </div>

              {/* ICON */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${card.iconBg}`}
              >
                <Icon size={20} />
              </div>
            </div>

            {/* FOOTER */}
            <div className="relative z-10 mt-5 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.detail}
              </p>

              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}