import { ArrowDownRight, CalendarDays, Gauge, ReceiptText } from "lucide-react";
import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency } from "../../utils/format";

export default function StatsCards() {
  const { summary } = useDashboard();

  const total = Number(summary?.summary?.total_expense || 0);
  const monthly = Number(summary?.summary?.monthly_expense || 0);
  const transactions = summary?.recent_transactions?.length || 0;
  const budgetUsed = Math.round(summary?.budget?.used_percentage || 0);

  const cards = [
    {
      title: "This month",
      value: formatCurrency(monthly, true),
      detail: "Current month spend",
      icon: CalendarDays,
    },
    {
      title: "All-time spend",
      value: formatCurrency(total, true),
      detail: "Across all expenses",
      icon: ArrowDownRight,
    },
    {
      title: "Recent entries",
      value: transactions,
      detail: "Latest transactions",
      icon: ReceiptText,
    },
    {
      title: "Budget used",
      value: `${budgetUsed}%`,
      detail: "Monthly allocation",
      icon: Gauge,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="group rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[1.7rem]">
                  {card.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-white dark:group-hover:text-slate-950">
                <Icon size={18} />
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              {card.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
