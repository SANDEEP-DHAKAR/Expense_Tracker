import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  Check,
  ExternalLink,
  Filter,
  LayoutGrid,
  List,
  Pencil,
  PiggyBank,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { getBudgetHistory, setBudget } from "../../api/budgets";
import { formatCurrency } from "../../utils/format";
import { controlClass } from "../ui/Primitives";

function formatMonthTitle(monthStr) {
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

export default function MonthlyBudgetModal({ isOpen, onClose, onRefresh }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'saved' | 'over' | 'unset'
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'

  // Quick budget setter form state
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [formMonth, setFormMonth] = useState(currentMonthStr);
  const [formLimit, setFormLimit] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);

  // Inline editing state in table/card
  const [editingMonth, setEditingMonth] = useState(null);
  const [editingLimit, setEditingLimit] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBudgetHistory({ limit: 48 });
      setHistory(res?.data?.data || []);
    } catch (err) {
      console.error("LOAD BUDGET HISTORY ERROR:", err);
      toast.error("Could not load budget history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, loadHistory]);

  const handleSaveBudget = async (month, amount) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Enter a valid positive budget amount");
      return;
    }

    try {
      setSavingBudget(true);
      await setBudget({
        month,
        monthly_limit: numericAmount,
      });

      toast.success(`Budget for ${formatMonthTitle(month)} updated!`);
      setEditingMonth(null);
      setFormLimit("");
      await loadHistory();
      await onRefresh?.();
    } catch (err) {
      console.error("SAVE BUDGET ERROR:", err);
      toast.error(err?.response?.data?.message || "Failed to set budget");
    } finally {
      setSavingBudget(false);
    }
  };

  // Quick summary statistics
  const summaryStats = useMemo(() => {
    let totalSavings = 0;
    let savedCount = 0;
    let totalBudget = 0;

    history.forEach((item) => {
      const budget = Number(item.monthly_limit || 0);
      const spent = Number(item.spent || 0);
      if (budget > 0) {
        totalBudget += budget;
        const diff = budget - spent;
        if (diff >= 0) {
          totalSavings += diff;
          savedCount += 1;
        }
      }
    });

    return { totalSavings, savedCount, totalBudget };
  }, [history]);

  // Filtered history list
  const filteredList = useMemo(() => {
    return history.filter((item) => {
      const budget = Number(item.monthly_limit || 0);
      const spent = Number(item.spent || 0);
      const monthText = formatMonthTitle(item.month).toLowerCase();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[32px] border border-emerald-200/50 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/95 sm:p-7">
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
        >
          <X size={17} />
        </button>

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/30">
              <PiggyBank size={24} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                <TrendingUp size={11} />
                Financial Analysis
              </div>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Monthly Budget History
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Review target budgets, actual spendings, and net savings across all months.
              </p>
            </div>
          </div>

          {/* OPEN FULL PAGE LINK */}
          <Link
            to="/budgets"
            onClick={onClose}
            className="mr-10 inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300 sm:mr-0"
          >
            <ExternalLink size={13} />
            Full Budgets Page
          </Link>
        </div>

        {/* QUICK STATS CHIPS */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span>Total Bachat:</span>
            <span className="text-sm font-black">+{formatCurrency(summaryStats.totalSavings)}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-1.5 text-xs font-bold text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
            <span>Total Budget:</span>
            <span className="text-sm font-black">{formatCurrency(summaryStats.totalBudget)}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
            <span>Months Under Budget:</span>
            <span className="text-sm font-black">{summaryStats.savedCount}</span>
          </div>
        </div>

        {/* QUICK SET BUDGET FORM */}
        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Plan Ahead: Set Budget for Any Month
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveBudget(formMonth, formLimit);
            }}
            className="mt-2.5 flex flex-wrap items-center gap-2.5"
          >
            <div className="min-w-[140px] flex-1 sm:flex-none">
              <input
                type="month"
                value={formMonth}
                onChange={(e) => setFormMonth(e.target.value)}
                className={`h-9 w-full rounded-xl bg-white px-3 text-xs dark:bg-slate-900 ${controlClass}`}
              />
            </div>

            <div className="min-w-[150px] flex-1 sm:flex-none">
              <input
                type="number"
                min="1"
                placeholder="Budget (e.g. 6000)"
                value={formLimit}
                onChange={(e) => setFormLimit(e.target.value)}
                className={`h-9 w-full rounded-xl bg-white px-3 text-xs dark:bg-slate-900 ${controlClass}`}
              />
            </div>

            <button
              type="submit"
              disabled={savingBudget}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:scale-105 disabled:opacity-60"
            >
              <Plus size={14} />
              {savingBudget ? "Saving..." : "Set Budget"}
            </button>
          </form>
        </div>

        {/* FILTER BAR & VIEW TOGGLE */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {/* SEARCH */}
          <div className="relative min-w-[180px] flex-1 sm:flex-none">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search month..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`h-8 w-full rounded-xl bg-white pl-8 pr-3 text-xs dark:bg-slate-900 ${controlClass}`}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* FILTER BUTTONS */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/80 p-0.5 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
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

            {/* VIEW SWITCH */}
            <div className="flex items-center gap-0.5 rounded-xl border border-slate-200/80 bg-white/80 p-0.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "table"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "cards"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* MONTHLY HISTORY CONTENT */}
        <div className="mt-4">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Loading budget history...
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
              <Filter size={28} className="text-slate-400" />
              <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                No matching budget records found
              </p>
              <p className="text-xs text-slate-400">
                Use the box above to plan your budget for this or upcoming months!
              </p>
            </div>
          ) : viewMode === "table" ? (
            /* TABLE VIEW */
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                  <tr>
                    <th className="px-3.5 py-3">Month</th>
                    <th className="px-3.5 py-3">Target Budget</th>
                    <th className="px-3.5 py-3">Actual Spent</th>
                    <th className="px-3.5 py-3">Bachat (Savings)</th>
                    <th className="px-3.5 py-3">Budget Used</th>
                    <th className="px-3.5 py-3">Status</th>
                    <th className="px-3.5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredList.map((item) => {
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
                        <td className="px-3.5 py-3 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-emerald-600 dark:text-emerald-400" />
                            <span>{formatMonthTitle(item.month)}</span>
                          </div>
                        </td>

                        <td className="px-3.5 py-3 font-semibold text-slate-800 dark:text-slate-200">
                          {isEditingThis ? (
                            <div className="flex items-center gap-1">
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
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white"
                              >
                                <Check size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingMonth(null)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : budget > 0 ? (
                            formatCurrency(budget)
                          ) : (
                            <span className="italic text-slate-400">Not set</span>
                          )}
                        </td>

                        <td className="px-3.5 py-3 font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(spent)}
                        </td>

                        <td className="px-3.5 py-3 font-bold">
                          {budget > 0 ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-black ${
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

                        <td className="px-3.5 py-3">
                          {budget > 0 ? (
                            <div className="w-24 space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                <span>{percent}%</span>
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

                        <td className="px-3.5 py-3">
                          {budget === 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              <AlertCircle size={10} />
                              Unplanned
                            </span>
                          ) : isOver ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                              Exceeded
                            </span>
                          ) : percent >= 80 ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                              Near Limit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                              Safe
                            </span>
                          )}
                        </td>

                        <td className="px-3.5 py-3 text-right">
                          {!isEditingThis && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMonth(item.month);
                                setEditingLimit(String(budget || ""));
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
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
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredList.map((item) => {
                const budget = Number(item.monthly_limit || 0);
                const spent = Number(item.spent || 0);
                const savings = Number(item.savings || 0);
                const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
                const isOver = spent > budget && budget > 0;
                const isEditingThis = editingMonth === item.month;

                return (
                  <div
                    key={item.month}
                    className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    {/* TOP ROW: MONTH TITLE + SAVINGS PILL */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={15} className="text-emerald-600 dark:text-emerald-400" />
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {formatMonthTitle(item.month)}
                        </h4>
                      </div>

                      {/* SAVINGS BADGE */}
                      {budget > 0 ? (
                        <div
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black ${
                            !isOver
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                          }`}
                        >
                          {!isOver ? (
                            <>
                              <TrendingUp size={12} />
                              +{formatCurrency(savings)}
                            </>
                          ) : (
                            <>
                              <TrendingDown size={12} />
                              -{formatCurrency(Math.abs(savings))}
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          No budget set
                        </span>
                      )}
                    </div>

                    {/* STATS GRID */}
                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-950/40">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Target Budget
                          </p>
                          {!isEditingThis && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMonth(item.month);
                                setEditingLimit(String(budget || ""));
                              }}
                              className="text-slate-400 hover:text-emerald-600"
                            >
                              <Pencil size={11} />
                            </button>
                          )}
                        </div>

                        {isEditingThis ? (
                          <div className="mt-1 flex items-center gap-1">
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
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingMonth(null)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white">
                            {budget > 0 ? formatCurrency(budget) : "Not Set"}
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-950/40">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Actual Spent
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white">
                          {formatCurrency(spent)}
                        </p>
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    {budget > 0 && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                          <span>{percent}% Used</span>
                          <span>{isOver ? "Over budget" : `${100 - Math.min(percent, 100)}% left`}</span>
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
