import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DailyChart({ data }) {
  const sortedData = [...(data || [])].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="mt-6 p-4 bg-white rounded-2xl shadow-lg dark:bg-slate-800 min-w-0">
      <h2 className="font-bold mb-4 text-center text-slate-900 dark:text-slate-100">📈 Daily Trend</h2>

      <div className="w-full h-[320px] sm:h-[360px] min-h-[320px] min-w-0" style={{ minWidth: 0, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={0}>
          <LineChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
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
