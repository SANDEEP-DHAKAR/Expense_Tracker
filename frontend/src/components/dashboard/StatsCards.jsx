import { useDashboard } from "../../context/DashboardContext";

export default function StatsCards() {
  const { summary } = useDashboard();

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-IN").format(Number(num || 0));

  const cards = [
    {
      title: "Monthly",
      value: `₹${formatCurrency(summary?.summary?.monthly_expense)}`,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Total",
      value: `₹${formatCurrency(summary?.summary?.total_expense)}`,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Entries",
      value: summary?.recent_transactions?.length || 0,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Budget Used",
      value: `${Math.round(summary?.budget?.used_percentage || 0)}%`,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`rounded-2xl p-4 text-white shadow-lg bg-gradient-to-r ${card.color}`}
        >
          <p className="text-sm opacity-80">{card.title}</p>
          <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
        </div>
      ))}
    </div>
  );
}