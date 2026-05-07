import { useEffect, useMemo, useState } from "react";
import { Pencil, Save, X } from "lucide-react";
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
      ? "bg-rose-600"
      : percent >= 80
        ? "bg-amber-500"
        : "bg-blue-600";

  const handleSave = async () => {
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
      toast.success("Budget updated");
      await onUpdate?.();
    } catch (err) {
      console.error("Failed to update budget:", err);
      toast.error(err.response?.data?.message || "Failed to update budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
            Budget usage
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formatCurrency(spent)} spent of {formatCurrency(budget)}
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Pencil size={15} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-60"
              aria-label="Save budget"
            >
              <Save size={15} />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:opacity-60 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Cancel budget edit"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <input
          type="number"
          min="1"
          value={newBudget}
          onChange={(event) => setNewBudget(event.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900"
          placeholder="Monthly budget"
        />
      ) : null}

      <div className="mb-3 flex items-end justify-between gap-3">
        <span className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {Math.round(percent)}%
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
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
