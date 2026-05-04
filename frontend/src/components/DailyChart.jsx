import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function DailyChart({ data = [] }) {

  // 🔥 Safe + sorted data
  const sortedData = [...data]
    .filter((item) => item?.date && item?.amount !== undefined)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="mt-6 p-4 bg-white rounded-2xl shadow-lg dark:bg-slate-800 w-full">

      <h2 className="font-bold mb-4 text-center text-slate-900 dark:text-slate-100">
        📈 Daily Trend
      </h2>

      {/* ❌ No Data */}
      {sortedData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-gray-500 dark:text-slate-400 text-sm">
          No data available
        </div>
      ) : (
        <div className="w-full h-[320px] sm:h-[360px] min-h-[320px] min-w-0" style={{ width: '100%', height: 320 }}>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sortedData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.slice(5)} // 👉 show MM-DD only
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value) => `₹${value}`}
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                }}
              />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={false}          // 👉 cleaner UI
                activeDot={{ r: 6 }}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>
      )}
    </div>
  );
}