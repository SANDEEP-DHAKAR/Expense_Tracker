import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  BarChart3,
  Layers,
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
} from "lucide-react";

import { useDashboard } from "../../context/DashboardContextValue";
import { formatCurrency } from "../../utils/format";

// Vibrant, modern fintech palette
const PALETTE = [
  { main: "#10b981", light: "#34d399", dark: "#059669", bg: "bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-300" },
  { main: "#06b6d4", light: "#22d3ee", dark: "#0891b2", bg: "bg-cyan-500/15", text: "text-cyan-700 dark:text-cyan-300" },
  { main: "#8b5cf6", light: "#a78bfa", dark: "#7c3aed", bg: "bg-violet-500/15", text: "text-violet-700 dark:text-violet-300" },
  { main: "#f59e0b", light: "#fbbf24", dark: "#d97706", bg: "bg-amber-500/15", text: "text-amber-700 dark:text-amber-300" },
  { main: "#f43f5e", light: "#fb7185", dark: "#e11d48", bg: "bg-rose-500/15", text: "text-rose-700 dark:text-rose-300" },
  { main: "#3b82f6", light: "#60a5fa", dark: "#2563eb", bg: "bg-blue-500/15", text: "text-blue-700 dark:text-blue-300" },
  { main: "#14b8a6", light: "#2dd4bf", dark: "#0d9488", bg: "bg-teal-500/15", text: "text-teal-700 dark:text-teal-300" },
  { main: "#ec4899", light: "#f472b6", dark: "#db2777", bg: "bg-pink-500/15", text: "text-pink-700 dark:text-pink-300" },
];

function formatMonthDisplay(monthStr) {
  if (!monthStr) return "";
  const parts = String(monthStr).split("-");
  if (parts.length === 2) {
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    const d = new Date(year, month, 1);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    }
  }
  return monthStr;
}

// Glassmorphic modern tooltip
function CustomTooltip({ active, payload, label, isPercent = false }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const value = item.value;
  const title = item.payload?.name || formatMonthDisplay(label || item.payload?.month);
  const color = item.color || item.payload?.fill || "#10b981";

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/95 px-4 py-3 shadow-[0_16px_36px_rgba(16,185,129,0.15)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900"
          style={{ backgroundColor: color }}
        />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </p>
      </div>

      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-base font-black text-slate-900 dark:text-white">
          {formatCurrency(value)}
        </p>
        {isPercent && item.payload?.percent ? (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ({item.payload.percent}%)
          </span>
        ) : null}
      </div>
    </div>
  );
}

// Comparison Tooltip: Budget vs Spent + Bachat / Overbudget
function ComparisonTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const currentData = payload[0]?.payload;
  const monthName = formatMonthDisplay(label || currentData?.month);
  const budget = Number(currentData?.budget || 0);
  const spent = Number(currentData?.total || 0);
  const diff = budget - spent;
  const isSaved = diff >= 0;

  return (
    <div className="min-w-[210px] overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/95 p-4 shadow-[0_16px_36px_rgba(16,185,129,0.15)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/95">
      <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {monthName} Analysis
        </p>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50" />
            Budget Target:
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {budget > 0 ? formatCurrency(budget) : "Not Set"}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900/50" />
            Actual Spent:
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {formatCurrency(spent)}
          </span>
        </div>

        {budget > 0 && (
          <div className="mt-2.5 border-t border-dashed border-slate-200 pt-2 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-black">
              <span className={isSaved ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                {isSaved ? "Bachat (Saved):" : "Over Budget:"}
              </span>
              <span className={isSaved ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                {isSaved ? `+${formatCurrency(diff)}` : `-${formatCurrency(Math.abs(diff))}`}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Usage:</span>
              <span>{Math.round((spent / budget) * 100)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyChart({ icon, title, description }) {
  const IconComponent = icon;
  return (
    <div className="flex h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-emerald-200/70 bg-emerald-50/20 p-6 text-center dark:border-emerald-900/30 dark:bg-emerald-950/10">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/20">
        {IconComponent ? <IconComponent size={28} /> : null}
      </div>

      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1.5 max-w-xs text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        {description}
      </p>
    </div>
  );
}

export default function ChartsSection() {
  const { summary } = useDashboard();

  // Toggle states for chart modes
  const [monthlyChartType, setMonthlyChartType] = useState("area"); // 'area' | 'bar'
  const [categoryChartType, setCategoryChartType] = useState("donut"); // 'donut' | 'bar'

  // Prepared monthly data
  const monthlyData = useMemo(() => {
    const raw = summary?.monthly_graph || [];
    return raw.map((item) => ({
      ...item,
      displayMonth: formatMonthDisplay(item.month),
      total: Number(item.total || 0),
      budget: Number(item.budget || 0),
      savings: Number(item.savings || 0),
    }));
  }, [summary?.monthly_graph]);

  // Monthly summary stats
  const monthlyStats = useMemo(() => {
    if (!monthlyData.length) return { total: 0, peakMonth: "", peakVal: 0, avg: 0 };
    const total = monthlyData.reduce((acc, d) => acc + d.total, 0);
    const avg = total / monthlyData.length;
    let peak = monthlyData[0];
    monthlyData.forEach((d) => {
      if (d.total > peak.total) peak = d;
    });
    return {
      total,
      avg,
      peakMonth: peak.displayMonth,
      peakVal: peak.total,
    };
  }, [monthlyData]);

  // Prepared category data with percentages & colors
  const categoryData = useMemo(() => {
    const raw = summary?.category_breakdown || [];
    const total = raw.reduce((acc, c) => acc + Number(c.total || 0), 0);
    return raw.map((item, idx) => {
      const amount = Number(item.total || 0);
      const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
      const color = PALETTE[idx % PALETTE.length];
      return {
        ...item,
        total: amount,
        percent,
        color: color.main,
        colorObj: color,
      };
    });
  }, [summary?.category_breakdown]);

  const totalCategorySpend = useMemo(() => {
    return categoryData.reduce((acc, c) => acc + c.total, 0);
  }, [categoryData]);

  return (
    <div className="grid gap-6 2xl:grid-cols-2">
      {/* 1. MONTHLY SPENDING TREND */}
      <section className="group relative overflow-hidden rounded-[30px] border border-emerald-100/70 bg-white/80 p-5 shadow-[0_20px_80px_rgba(16,185,129,0.08)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_25px_85px_rgba(16,185,129,0.12)] sm:p-6 dark:border-emerald-900/30 dark:bg-slate-950/70">
        {/* Glow ambient decoration */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-lime-400/5 blur-3xl" />

        {/* HEADER */}
        <div className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
              <TrendingUp size={12} />
              Analytics
            </div>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Monthly Trend
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {monthlyChartType === "comparison"
                ? "Compare monthly budget targets against actual spendings"
                : monthlyStats.peakMonth
                  ? `Peak: ${monthlyStats.peakMonth} (${formatCurrency(monthlyStats.peakVal)}) • Avg: ${formatCurrency(monthlyStats.avg)}/mo`
                  : "Visual timeline of your expenses"}
            </p>
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex items-center gap-1 rounded-2xl border border-emerald-200/60 bg-white/70 p-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <button
              type="button"
              onClick={() => setMonthlyChartType("area")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                monthlyChartType === "area"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Activity size={13} />
              Area
            </button>

            <button
              type="button"
              onClick={() => setMonthlyChartType("bar")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                monthlyChartType === "bar"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <BarChart3 size={13} />
              Bar
            </button>

            <button
              type="button"
              onClick={() => setMonthlyChartType("comparison")}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                monthlyChartType === "comparison"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Layers size={13} />
              Vs Budget
            </button>
          </div>
        </div>

        {/* COMPARISON LEGEND */}
        {monthlyChartType === "comparison" && (
          <div className="relative z-10 mb-3 flex items-center justify-end gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span>Budget Target</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Actual Spent</span>
            </div>
          </div>
        )}

        {/* CHART BODY */}
        {monthlyData.length === 0 ? (
          <EmptyChart
            icon={TrendingUp}
            title="No monthly data yet"
            description="Your monthly spending graph will visualize your expenses as soon as you record transactions."
          />
        ) : (
          <div className="relative z-10 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {monthlyChartType === "area" ? (
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    {/* Glowing gradient */}
                    <linearGradient id="modernAreaGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="60%" stopColor="#059669" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="rgba(148, 163, 184, 0.15)"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="displayMonth"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(val) => formatCurrency(val, true)}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#10b981"
                    strokeWidth={3.5}
                    fill="url(#modernAreaGlow)"
                    activeDot={{
                      r: 7,
                      stroke: "#ffffff",
                      strokeWidth: 3,
                      fill: "#10b981",
                      className: "shadow-lg",
                    }}
                  />
                </AreaChart>
              ) : monthlyChartType === "bar" ? (
                <BarChart
                  data={monthlyData}
                  margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="modernMonthlyBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="rgba(148, 163, 184, 0.15)"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="displayMonth"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(val) => formatCurrency(val, true)}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Bar
                    dataKey="total"
                    fill="url(#modernMonthlyBar)"
                    radius={[10, 10, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              ) : (
                <BarChart
                  data={monthlyData}
                  margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
                  barGap={6}
                >
                  <defs>
                    <linearGradient id="modernBudgetBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="modernSpentBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="rgba(148, 163, 184, 0.15)"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="displayMonth"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(val) => formatCurrency(val, true)}
                  />

                  <Tooltip content={<ComparisonTooltip />} />

                  <Bar
                    name="Budget Target"
                    dataKey="budget"
                    fill="url(#modernBudgetBar)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    name="Actual Spent"
                    dataKey="total"
                    fill="url(#modernSpentBar)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* 2. CATEGORY BREAKDOWN & DISTRIBUTION */}
      <section className="group relative overflow-hidden rounded-[30px] border border-emerald-100/70 bg-white/80 p-5 shadow-[0_20px_80px_rgba(16,185,129,0.08)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_25px_85px_rgba(16,185,129,0.12)] sm:p-6 dark:border-emerald-900/30 dark:bg-slate-950/70">
        {/* Glow ambient decoration */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-emerald-400/5 blur-3xl" />

        {/* HEADER */}
        <div className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/60 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-300">
              <Sparkles size={12} />
              Distribution
            </div>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Category Spend
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              {categoryData.length > 0
                ? `${categoryData.length} categories • Total: ${formatCurrency(totalCategorySpend)}`
                : "Understand where your money goes"}
            </p>
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex items-center gap-1 rounded-2xl border border-emerald-200/60 bg-white/70 p-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <button
              type="button"
              onClick={() => setCategoryChartType("donut")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                categoryChartType === "donut"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <PieIcon size={13} />
              Donut
            </button>

            <button
              type="button"
              onClick={() => setCategoryChartType("bar")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                categoryChartType === "bar"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <BarChart3 size={13} />
              Bar
            </button>
          </div>
        </div>

        {/* CHART BODY */}
        {categoryData.length === 0 ? (
          <EmptyChart
            icon={BarChart3}
            title="No category insights yet"
            description="Category-wise distribution and insights will display here once you add categorized expenses."
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            {categoryChartType === "donut" ? (
              <div className="w-full">
                <div className="relative h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<CustomTooltip isPercent />} />
                      <Pie
                        data={categoryData}
                        dataKey="total"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                        cornerRadius={6}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            className="transition-all duration-300 hover:opacity-80"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* CENTER DONUT STAT */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Total Spend
                    </span>
                    <span className="mt-0.5 text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                      {formatCurrency(totalCategorySpend, true)}
                    </span>
                  </div>
                </div>

                {/* MODERN CATEGORY CHIPS */}
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {categoryData.map((item) => (
                    <div
                      key={item.name}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-1.5 text-xs font-semibold backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-700 dark:text-slate-300">
                        {item.name}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="rgba(148, 163, 184, 0.15)"
                      strokeDasharray="4 4"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                      tickFormatter={(val) => formatCurrency(val, true)}
                    />

                    <Tooltip content={<CustomTooltip isPercent />} />

                    <Bar
                      dataKey="total"
                      radius={[10, 10, 0, 0]}
                      maxBarSize={48}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={entry.color}
                          className="transition-all duration-300 hover:opacity-85"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}