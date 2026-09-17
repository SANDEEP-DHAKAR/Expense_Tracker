import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Pencil, X } from "lucide-react";
import toast from "react-hot-toast";
import { setBudget } from "../api/budgets";
import { formatCurrency } from "../utils/format";

export default function BudgetProgress({ spent = 0, budget = 0, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditing) setNewBudget(budget || "");
  }, [budget, isEditing]);

  const percent = useMemo(() => {
    if (!budget || Number(budget) <= 0) return 0;
    return Math.min((Number(spent) / Number(budget)) * 100, 100);
  }, [spent, budget]);

  const statusTone =
    percent >= 100
      ? "bg-rose-500"
      : percent >= 80
        ? "bg-amber-500"
        : "bg-gradient-to-r from-emerald-500 to-green-600";

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const amount = Number(newBudget);

    if (!amount || amount <= 0) {
      toast.error("Enter a valid monthly budget");
      return;
    }

    try {
      setLoading(true);
      const currentMonth = new Date().toISOString().slice(0, 7);
      await setBudget({ monthly_limit: amount, month: currentMonth });
      setIsEditing(false);
      toast.success("Budget updated successfully!");
      await onUpdate?.();
    } catch (err) {
      console.error("Failed to update budget:", err);
      toast.error(err.response?.data?.message || "Failed to update budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/40 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Budget Usage
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {formatCurrency(spent)} spent of {formatCurrency(budget)}
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 px-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Pencil size={12} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            {/* MODERN SAVE BUTTON WITH SLEEK CHECK ICON */}
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition-all duration-200 hover:scale-105 hover:shadow-emerald-500/40 active:scale-95 disabled:opacity-60"
              title="Save budget"
              aria-label="Save budget"
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={14} className="stroke-[2.5]" />
              )}
              <span>{loading ? "Saving..." : "Save"}</span>
            </button>

            {/* CANCEL BUTTON */}
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-60"
              title="Cancel edit"
              aria-label="Cancel budget edit"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs font-bold text-slate-400">
              ₹
            </span>
            <input
              type="number"
              min="1"
              autoFocus
              value={newBudget}
              onChange={(event) => setNewBudget(event.target.value)}
              className="h-9 w-full rounded-xl border border-emerald-300 bg-white pl-7 pr-3 text-xs font-bold text-slate-950 outline-none shadow-sm transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-emerald-700/60 dark:bg-slate-950 dark:text-white"
              placeholder="Enter monthly budget"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-3.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Check size={14} className="stroke-[2.5]" />
            )}
            <span>Save</span>
          </button>
        </form>
      ) : null}

      <div className="mb-3 flex items-end justify-between gap-3">
        <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          {Math.round(percent)}%
        </span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          remaining {formatCurrency(Math.max(Number(budget) - Number(spent), 0))}
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${statusTone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  );
}
