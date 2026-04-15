import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyChart({ expenses }) {
  const grouped = {};

  expenses.forEach((exp) => {
    const month = exp.expense_date?.slice(0, 7); // YYYY-MM

    if (!grouped[month]) {
      grouped[month] = 0;
    }

    grouped[month] += Number(exp.amount);
  });

  const data = Object.keys(grouped).map((key) => ({
    month: key,
    amount: grouped[key],
  }));

  return (
    <div className="mt-6 p-4 bg-white rounded-2xl shadow-lg dark:bg-slate-800">
      <h2 className="font-bold mb-4 text-center text-slate-900 dark:text-slate-100">📈 Monthly Trend</h2>

      <div className="w-full h-[320px] sm:h-[360px] min-w-0 min-h-[320px]" style={{ minWidth: 0, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={0}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                color: "#ffffff",
              }}
            />
            <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}