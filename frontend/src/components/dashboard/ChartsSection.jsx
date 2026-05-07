import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency } from "../../utils/format";

function EmptyChart() {
  return (
    <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      No expense data to visualize yet.
    </div>
  );
}

export default function ChartsSection() {
  const { summary } = useDashboard();
  const monthlyData = summary?.monthly_graph || [];
  const categoryData = summary?.category_breakdown || [];

  return (
    <div className="grid gap-5 2xl:grid-cols-2">
      <section className="rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">
              Monthly trend
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Spend grouped by month
            </p>
          </div>
        </div>

        {monthlyData.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-[280px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ left: -18, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="spendArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, true)} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="total" stroke="#0f172a" strokeWidth={2.5} fill="url(#spendArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
            Category spend
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Where your money is going
          </p>
        </div>

        {categoryData.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-[280px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, true)} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={54} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
