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

import {
  Activity,
  BarChart3,
  TrendingUp,
} from "lucide-react";

import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency } from "../../utils/format";

function EmptyChart({ icon: Icon, title, description }) {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center rounded-[28px] border border-dashed border-emerald-200/70 bg-gradient-to-br from-emerald-50/70 to-white text-center dark:border-emerald-900/30 dark:from-emerald-950/10 dark:to-slate-950">
      
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg shadow-emerald-500/20">
        <Icon size={28} className="text-white" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default function ChartsSection() {
  const { summary } = useDashboard();

  const monthlyData = summary?.monthly_graph || [];
  const categoryData = summary?.category_breakdown || [];

  return (
    <div className="grid gap-6 2xl:grid-cols-2">
      
      {/* MONTHLY TREND */}
      <section className="overflow-hidden rounded-[32px] border border-white/20 bg-gradient-to-br from-white/90 via-emerald-50/50 to-green-100/30 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.10)] backdrop-blur-2xl dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900 dark:to-emerald-950/10">
        
        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between gap-4">
          
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
              <TrendingUp size={13} />
              Analytics
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Monthly Trend
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Visual overview of your monthly expenses
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-xl shadow-emerald-500/20">
            <Activity size={24} className="text-white" />
          </div>
        </div>

        {/* CHART */}
        {monthlyData.length === 0 ? (
          <EmptyChart
            icon={TrendingUp}
            title="No monthly data"
            description="Your monthly expense analytics will appear here once you start tracking spending."
          />
        ) : (
          <div className="h-[320px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{
                  left: -18,
                  right: 10,
                  top: 12,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="premiumArea"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#10b981"
                      stopOpacity={0.45}
                    />

                    <stop
                      offset="100%"
                      stopColor="#10b981"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#d1fae5"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                  tickFormatter={(value) =>
                    formatCurrency(value, true)
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(value)
                  }
                  contentStyle={{
                    borderRadius: 18,
                    border: "1px solid #d1fae5",
                    backdropFilter: "blur(14px)",
                    background:
                      "rgba(255,255,255,0.88)",
                    boxShadow:
                      "0 15px 40px rgba(16,185,129,0.10)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#premiumArea)"
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    fill: "#10b981",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* CATEGORY SPEND */}
      <section className="overflow-hidden rounded-[32px] border border-white/20 bg-gradient-to-br from-white/90 via-emerald-50/40 to-green-100/20 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.10)] backdrop-blur-2xl dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900 dark:to-emerald-950/10">
        
        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between gap-4">
          
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
              <BarChart3 size={13} />
              Spending
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Category Spend
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Understand where your money goes
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-xl shadow-emerald-500/20">
            <BarChart3 size={24} className="text-white" />
          </div>
        </div>

        {/* CHART */}
        {categoryData.length === 0 ? (
          <EmptyChart
            icon={BarChart3}
            title="No category insights"
            description="Your category-wise spending insights will show up here once expenses are added."
          />
        ) : (
          <div className="h-[320px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{
                  left: -18,
                  right: 10,
                  top: 12,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke="#d1fae5"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                  tickFormatter={(value) =>
                    formatCurrency(value, true)
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(value)
                  }
                  contentStyle={{
                    borderRadius: 18,
                    border: "1px solid #d1fae5",
                    backdropFilter: "blur(14px)",
                    background:
                      "rgba(255,255,255,0.88)",
                    boxShadow:
                      "0 15px 40px rgba(16,185,129,0.10)",
                  }}
                />

                <Bar
                  dataKey="total"
                  fill="#10b981"
                  radius={[12, 12, 0, 0]}
                  maxBarSize={54}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}