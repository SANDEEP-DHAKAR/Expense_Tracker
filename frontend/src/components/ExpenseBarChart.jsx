import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function ExpenseBarChart({ expenses }) {
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
        amount: grouped[key],
    }));

    if (!data.length) {
        return <p className="text-gray-500">No data available</p>;
    }

    return (
        <div className="mt-6 p-4 bg-white rounded-2xl shadow-lg dark:bg-slate-800">
            <h2 className="text-lg font-bold mb-4 text-center text-slate-900 dark:text-slate-100">
                📊 Category-wise Expenses
            </h2>

            <div className="w-full h-[320px] sm:h-[360px]">
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />

                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                backgroundColor: "rgba(15, 23, 42, 0.95)",
                                color: "#ffffff",
                            }}
                        />

                        <Bar dataKey="amount" fill="#4F46E5" radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}