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
    <div className="mt-6 p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="font-bold mb-4 text-center">📈 Monthly Trend</h2>

      <div className="w-full h-[300px]">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}