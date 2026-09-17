import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Check,
  Filter,
  LayoutGrid,
  List,
  Pencil,
  PiggyBank,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import toast from "react-hot-toast";

import AppShell from "../components/AppShell";
import { PageHeader, controlClass } from "../components/ui/Primitives";
import { PanelSkeleton } from "../components/ui/Skeleton";
import { getBudgetHistory, setBudget } from "../api/budgets";
import { formatCurrency } from "../utils/format";

function formatMonthLabel(monthStr) {
  if (!monthStr) return "";
  const parts = String(monthStr).split("-");
  if (parts.length === 2) {
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    const d = new Date(year, month, 1);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    }
  }
  return monthStr;
}

function formatShortMonth(monthStr) {
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

// Custom Glassmorphic Chart Tooltip
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const current = payload[0]?.payload;
  const budget = Number(current?.monthly_limit || 0);
  const spent = Number(current?.spent || 0);
  const diff = budget - spent;
  const isSaved = diff >= 0;

  return (
    <div className="min-w-[210px] overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/95 p-4 shadow-[0_16px_36px_rgba(16,185,129,0.15)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/95">
      <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {formatMonthLabel(label || current?.month)}
        </p>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50" />
            Budget Target:
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {budget > 0 ? formatCurrency(budget) : "Not Set"}
          </span>
        </div>

        <div className="flex items-center justify-between">
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
            <div className="flex items-center justify-between font-black">
              <span className={isSaved ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                {isSaved ? "Bachat (Saved):" : "Over Budget:"}
              </span>
              <span className={isSaved ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                {isSaved ? `+${formatCurrency(diff)}` : `-${formatCurrency(Math.abs(diff))}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Budgets() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'saved' | 'over' | 'unset'
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'

  // Quick budget setter form state
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [formMonth, setFormMonth] = useState(currentMonthStr);
  const [formLimit, setFormLimit] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);

  // Inline editing state
  const [editingMonth, setEditingMonth] = useState(null);
  const [editingLimit, setEditingLimit] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBudgetHistory({ limit: 48 });
      setHistory(res?.data?.data || []);
    } catch (err) {
      console.error("LOAD BUDGET HISTORY ERROR:", err);
      toast.error("Failed to load budget history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveBudget = async (month, amount) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid positive budget amount");
      return;
    }

    try {
      setSavingBudget(true);
      await setBudget({
        month,
        monthly_limit: numericAmount,
      });

      toast.success(`Budget for ${formatMonthLabel(month)} updated!`);
      setEditingMonth(null);
      setFormLimit("");
      await loadData();
    } catch (err) {
      console.error("SAVE BUDGET ERROR:", err);
      toast.error(err?.response?.data?.message || "Failed to set budget");
    } finally {
      setSavingBudget(false);
    }
  };

  // High-level overview statistics
  const summaryStats = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    let totalSavings = 0;
    let overbudgetCount = 0;
    let savedCount = 0;
    let budgetCount = 0;

    history.forEach((item) => {
      const budget = Number(item.monthly_limit || 0);
      const spent = Number(item.spent || 0);
      if (budget > 0) {
        budgetCount += 1;
        totalBudget += budget;
        totalSpent += spent;
        const diff = budget - spent;
        if (diff >= 0) {
          totalSavings += diff;
          savedCount += 1;
        } else {
          overbudgetCount += 1;
        }
      }
    });

    const efficiency =
      totalBudget > 0
        ? Math.round(((totalBudget - totalSpent) / totalBudget) * 100)
        : 0;

    return {
      totalBudget,
      totalSpent,
      totalSavings,
      overbudgetCount,
      savedCount,
      budgetCount,
      efficiency,
    };
  }, [history]);

  // Chart data sorted chronologically (ascending)
  const chartData = useMemo(() => {
    return [...history]
      .reverse()
      .map((item) => ({
        ...item,
        displayMonth: formatShortMonth(item.month),
        budget: Number(item.monthly_limit || 0),
        total: Number(item.spent || 0),
      }));
  }, [history]);

  // Filtered history list
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const budget = Number(item.monthly_limit || 0);
      const spent = Number(item.spent || 0);
      const monthText = formatMonthLabel(item.month).toLowerCase();
      const matchesSearch =
        monthText.includes(search.toLowerCase()) ||
        item.month.includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filterMode === "saved") {
        return budget > 0 && spent <= budget;
      }
      if (filterMode === "over") {
        return budget > 0 && spent > budget;
      }
      if (filterMode === "unset") {
        return budget === 0;
      }
      return true;
    });
  }, [history, search, filterMode]);

  return (
    <AppShell>
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* PAGE HEADER */}
        <PageHeader
          eyebrow="SMART FINANCIAL PLANNING"
          title="Monthly Budgets & Analysis"
          description="Track your monthly budget limits, analyze actual spending, and review your savings (bachat) month-by-month."
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadData}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-100 hover:shadow dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                <RotateCcw size={14} />
                Refresh Data
              </button>
            </div>
          }
        />

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[28px] border border-white/20 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <PanelSkeleton rows={2} />
                </div>
              ))}
            </div>
            <div className="rounded-[28px] border border-white/20 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <PanelSkeleton rows={6} />
            </div>
          </div>
        ) : (
          <>
            {/* 1. TOP OVERVIEW STAT CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* TOTAL SAVINGS (BACHAT) */}
              <div className="group relative overflow-hidden rounded-[26px] border border-emerald-100/70 bg-gradient-to-br from-emerald-500/10 via-white to-emerald-50/40 p-5 shadow-[0_15px_40px_rgba(16,185,129,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-md dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-slate-950 dark:to-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Total Bachat (Savings)
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/25">
                    <PiggyBank size={18} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  +{formatCurrency(summaryStats.totalSavings)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight size={14} />
                  {summaryStats.savedCount} months under budget
                </p>
              </div>

              {/* TOTAL BUDGET PLANNED */}
              <div className="group relative overflow-hidden rounded-[26px] border border-blue-100/70 bg-gradient-to-br from-blue-500/10 via-white to-blue-50/40 p-5 shadow-[0_15px_40px_rgba(59,130,246,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-md dark:border-blue-900/40 dark:from-blue-950/30 dark:via-slate-950 dark:to-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                    Total Budget Planned
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                    <Wallet size={18} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {formatCurrency(summaryStats.totalBudget)}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Across {summaryStats.budgetCount} budgeted months
                </p>
              </div>

              {/* TOTAL SPENT */}
              <div className="group relative overflow-hidden rounded-[26px] border border-amber-100/70 bg-gradient-to-br from-amber-500/10 via-white to-amber-50/40 p-5 shadow-[0_15px_40px_rgba(245,158,11,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-md dark:border-amber-900/40 dark:from-amber-950/30 dark:via-slate-950 dark:to-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Total Actual Spent
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25">
                    <TrendingDown size={18} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {formatCurrency(summaryStats.totalSpent)}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {summaryStats.overbudgetCount > 0 ? (
                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                      <ArrowDownRight size={14} />
                      {summaryStats.overbudgetCount} months over budget
                    </span>
                  ) : (
                    "0 months over budget 🎯"
                  )}
                </p>
              </div>

              {/* OVERALL EFFICIENCY */}
              <div className="group relative overflow-hidden rounded-[26px] border border-cyan-100/70 bg-gradient-to-br from-cyan-500/10 via-white to-cyan-50/40 p-5 shadow-[0_15px_40px_rgba(6,182,212,0.06)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-md dark:border-cyan-900/40 dark:from-cyan-950/30 dark:via-slate-950 dark:to-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                    Net Savings Rate
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-md shadow-cyan-500/25">
                    <Sparkles size={18} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {summaryStats.efficiency >= 0
                    ? `${summaryStats.efficiency}%`
                    : "0%"}
                </p>
                <p className="mt-1 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                  Average budget retained as savings
                </p>
              </div>
            </div>

            {/* 2. CHART & PLANNER ROW */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              {/* COMPARISON CHART */}
              <section className="relative overflow-hidden rounded-[30px] border border-emerald-100/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.06)] backdrop-blur-2xl sm:p-6 dark:border-emerald-900/30 dark:bg-slate-950/70">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <TrendingUp size={12} />
                      Visual Comparison
                    </div>
                    <h3 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Budget vs Actual Spent
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      <span>Target Budget</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span>Actual Spent</span>
                    </div>
                  </div>
                </div>

                {chartData.length === 0 ? (
                  <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400">
                    No timeline data recorded yet
                  </div>
                ) : (
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        barGap={6}
                      >
                        <defs>
                          <linearGradient id="budgetBarGrad2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#2563eb" />
                          </linearGradient>
                          <linearGradient id="spentBarGrad2" x1="0" y1="0" x2="0" y2="1">
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

                        <Tooltip content={<ChartTooltip />} />

                        <Bar
                          name="Target Budget"
                          dataKey="budget"
                          fill="url(#budgetBarGrad2)"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={28}
                        />
                        <Bar
                          name="Actual Spent"
                          dataKey="total"
                          fill="url(#spentBarGrad2)"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={28}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              {/* QUICK PLANNER CARD */}
              <section className="relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-emerald-100/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.06)] backdrop-blur-2xl sm:p-6 dark:border-emerald-900/30 dark:bg-slate-950/70">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                    <Calendar size={12} />
                    Plan Ahead
                  </div>

                  <h3 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Set Budget for Any Month
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Specify your target budget limit for current or upcoming months (e.g. Next Month).
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveBudget(formMonth, formLimit);
                    }}
                    className="mt-4 space-y-3"
                  >
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Target Month
                      </label>
                      <input
                        type="month"
                        value={formMonth}
                        onChange={(e) => setFormMonth(e.target.value)}
                        className={`mt-1.5 h-11 w-full rounded-xl bg-white px-3.5 text-sm dark:bg-slate-900 ${controlClass}`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Monthly Budget Limit (₹)
                      </label>
                      <div className="relative mt-1.5">
                        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-bold text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 6000"
                          value={formLimit}
                          onChange={(e) => setFormLimit(e.target.value)}
                          className={`h-11 w-full rounded-xl bg-white pl-8 pr-3.5 text-sm dark:bg-slate-900 ${controlClass}`}
                        />
                      </div>
                    </div>

                    {/* Quick amount chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[3000, 5000, 8000, 10000, 15000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormLimit(String(amt))}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-800 dark:hover:text-emerald-300"
                        >
                          ₹{amt.toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={savingBudget}
                      className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:scale-[1.01] disabled:opacity-60"
                    >
                      <Plus size={16} />
                      {savingBudget ? "Saving Budget..." : "Save Budget Limit"}
                    </button>
                  </form>
                </div>
              </section>
            </div>

            {/* 3. COMPREHENSIVE MONTHLY HISTORY BREAKDOWN */}
            <section className="relative overflow-hidden rounded-[30px] border border-emerald-100/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.06)] backdrop-blur-2xl sm:p-6 dark:border-emerald-900/30 dark:bg-slate-950/70">
              {/* CONTROLS HEADER */}
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <List size={12} />
                    Complete Timeline
                  </div>
                  <h3 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Monthly Budget Breakdown
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Showing {filteredHistory.length} of {history.length} months
                  </p>
                </div>

                {/* SEARCH & FILTERS & VIEW TOGGLE */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* SEARCH */}
                  <div className="relative min-w-[180px] flex-1 sm:flex-none">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search month..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={`h-9 w-full rounded-xl bg-white pl-8 pr-3 text-xs dark:bg-slate-900 ${controlClass}`}
                    />
                  </div>

                  {/* FILTER DROPDOWN OR PILLS */}
                  <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/80 p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <button
                      type="button"
                      onClick={() => setFilterMode("all")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        filterMode === "all"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode("saved")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        filterMode === "saved"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      Bachat
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode("over")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        filterMode === "over"
                          ? "bg-rose-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      Over
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode("unset")}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        filterMode === "unset"
                          ? "bg-slate-700 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      No Budget
                    </button>
                  </div>

                  {/* VIEW TOGGLE */}
                  <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/80 p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <button
                      type="button"
                      onClick={() => setViewMode("table")}
                      title="Table View"
                      className={`rounded-lg p-1.5 transition ${
                        viewMode === "table"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      }`}
                    >
                      <List size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("cards")}
                      title="Cards View"
                      className={`rounded-lg p-1.5 transition ${
                        viewMode === "cards"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                      }`}
                    >
                      <LayoutGrid size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* TABLE OR CARDS DISPLAY */}
              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
                  <Filter size={32} className="text-slate-400" />
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    No matching records found
                  </p>
                  <p className="text-xs text-slate-400">
                    Try adjusting your search or filter settings.
                  </p>
                </div>
              ) : viewMode === "table" ? (
                /* TABLE VIEW */
                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                      <tr>
                        <th className="px-4 py-3.5">Month</th>
                        <th className="px-4 py-3.5">Target Budget</th>
                        <th className="px-4 py-3.5">Actual Spent</th>
                        <th className="px-4 py-3.5">Bachat (Savings)</th>
                        <th className="px-4 py-3.5">Budget Usage</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {filteredHistory.map((item) => {
                        const budget = Number(item.monthly_limit || 0);
                        const spent = Number(item.spent || 0);
                        const savings = Number(item.savings || 0);
                        const percent =
                          budget > 0 ? Math.round((spent / budget) * 100) : 0;
                        const isOver = spent > budget && budget > 0;
                        const isEditingThis = editingMonth === item.month;

                        return (
                          <tr
                            key={item.month}
                            className="transition hover:bg-emerald-50/30 dark:hover:bg-slate-800/40"
                          >
                            {/* MONTH */}
                            <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-emerald-600 dark:text-emerald-400" />
                                <span>{formatMonthLabel(item.month)}</span>
                              </div>
                            </td>

                            {/* TARGET BUDGET */}
                            <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                              {isEditingThis ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    min="1"
                                    value={editingLimit}
                                    onChange={(e) => setEditingLimit(e.target.value)}
                                    className="h-7 w-20 rounded-lg border border-emerald-300 bg-white px-2 text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveBudget(item.month, editingLimit)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                  >
                                    <Check size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingMonth(null)}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              ) : budget > 0 ? (
                                formatCurrency(budget)
                              ) : (
                                <span className="italic text-slate-400">Not set</span>
                              )}
                            </td>

                            {/* ACTUAL SPENT */}
                            <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">
                              {formatCurrency(spent)}
                            </td>

                            {/* BACHAT (SAVINGS) */}
                            <td className="px-4 py-3.5 font-bold">
                              {budget > 0 ? (
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                                    !isOver
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                      : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                                  }`}
                                >
                                  {!isOver ? (
                                    <>
                                      <TrendingUp size={11} />
                                      +{formatCurrency(savings)}
                                    </>
                                  ) : (
                                    <>
                                      <TrendingDown size={11} />
                                      -{formatCurrency(Math.abs(savings))}
                                    </>
                                  )}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>

                            {/* BUDGET USAGE PROGRESS */}
                            <td className="px-4 py-3.5">
                              {budget > 0 ? (
                                <div className="w-28 space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                    <span>{percent}%</span>
                                    <span>
                                      {100 - Math.min(percent, 100)}% left
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        isOver
                                          ? "bg-rose-500"
                                          : percent >= 80
                                            ? "bg-amber-500"
                                            : "bg-emerald-500"
                                      }`}
                                      style={{ width: `${Math.min(percent, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>

                            {/* STATUS */}
                            <td className="px-4 py-3.5">
                              {budget === 0 ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                  <AlertCircle size={11} />
                                  Unplanned
                                </span>
                              ) : isOver ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                  Exceeded
                                </span>
                              ) : percent >= 80 ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                  Near Limit
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                  Safe (Bachat)
                                </span>
                              )}
                            </td>

                            {/* ACTIONS */}
                            <td className="px-4 py-3.5 text-right">
                              {!isEditingThis && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMonth(item.month);
                                    setEditingLimit(String(budget || ""));
                                  }}
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                  <Pencil size={11} />
                                  {budget > 0 ? "Edit" : "Set"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* CARDS VIEW */
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredHistory.map((item) => {
                    const budget = Number(item.monthly_limit || 0);
                    const spent = Number(item.spent || 0);
                    const savings = Number(item.savings || 0);
                    const percent =
                      budget > 0 ? Math.round((spent / budget) * 100) : 0;
                    const isOver = spent > budget && budget > 0;
                    const isEditingThis = editingMonth === item.month;

                    return (
                      <div
                        key={item.month}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70"
                      >
                        <div>
                          {/* TOP: MONTH TITLE & BADGE */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <Calendar size={16} />
                              </div>
                              <h4 className="font-bold text-slate-900 dark:text-white">
                                {formatMonthLabel(item.month)}
                              </h4>
                            </div>

                            {budget > 0 ? (
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                                  !isOver
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                    : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                                }`}
                              >
                                {!isOver ? (
                                  <>
                                    <TrendingUp size={11} />
                                    +{formatCurrency(savings)}
                                  </>
                                ) : (
                                  <>
                                    <TrendingDown size={11} />
                                    -{formatCurrency(Math.abs(savings))}
                                  </>
                                )}
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                Unplanned
                              </span>
                            )}
                          </div>

                          {/* STATS GRID */}
                          <div className="mt-4 grid grid-cols-2 gap-2.5">
                            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-950/50">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Target Budget
                              </p>
                              <p className="mt-0.5 font-bold text-slate-900 dark:text-white">
                                {budget > 0 ? formatCurrency(budget) : "Not set"}
                              </p>
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-950/50">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Actual Spent
                              </p>
                              <p className="mt-0.5 font-bold text-slate-900 dark:text-white">
                                {formatCurrency(spent)}
                              </p>
                            </div>
                          </div>

                          {/* PROGRESS BAR */}
                          {budget > 0 && (
                            <div className="mt-3.5 space-y-1">
                              <div className="flex justify-between text-xs font-semibold text-slate-500">
                                <span>{percent}% Used</span>
                                <span>
                                  {isOver
                                    ? "Overbudget"
                                    : `${formatCurrency(Math.max(budget - spent, 0))} remaining`}
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isOver
                                      ? "bg-rose-500"
                                      : percent >= 80
                                        ? "bg-amber-500"
                                        : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${Math.min(percent, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* EDIT / SET BUTTON */}
                        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                          {isEditingThis ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="1"
                                value={editingLimit}
                                onChange={(e) => setEditingLimit(e.target.value)}
                                className="h-8 flex-1 rounded-lg border border-emerald-300 bg-white px-2.5 text-xs font-bold text-slate-900 dark:bg-slate-900 dark:text-white"
                                placeholder="Budget amount"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveBudget(item.month, editingLimit)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingMonth(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMonth(item.month);
                                setEditingLimit(String(budget || ""));
                              }}
                              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              <Pencil size={12} />
                              {budget > 0 ? "Edit Budget Limit" : "+ Set Monthly Budget"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

