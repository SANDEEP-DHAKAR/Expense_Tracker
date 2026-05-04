import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseChart({ expenses }) {
  // 🔥 GROUP DATA
  const grouped = {};

  expenses.forEach((exp) => {
    const key = exp.category_name || "Other";

    if (!grouped[key]) {
      grouped[key] = 0;
    }

    grouped[key] += Number(exp.amount);
  });

  const data = Object.keys(grouped).map((key) => ({
    name: key,
    value: grouped[key],
  }));

  // 🎨 COLORS (beautiful palette)
  const COLORS = [
    "#4F46E5",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#A855F7",
  ];

  if (!data.length) {
    return <p className="text-gray-500">No data to display</p>;
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-2xl shadow-lg dark:bg-slate-800 min-w-0">
      <h2 className="font-bold text-lg mb-4 text-center text-slate-900 dark:text-slate-100">
        📊 Expense Breakdown
      </h2>

      <div className="w-full h-[320px] sm:h-[360px] min-h-[320px] min-w-0" style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              innerRadius={50} // 🔥 donut style
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                backgroundColor: "rgba(15, 23, 42, 0.96)",
                color: "#ffffff",
              }}
              itemStyle={{ color: "#ffffff" }}
            />

            {/* Legend */}
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}