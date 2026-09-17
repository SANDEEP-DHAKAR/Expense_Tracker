import { useState } from "react";
import { Plus, Sparkles, Wallet } from "lucide-react";
import toast from "react-hot-toast";

import { useDashboard } from "../../context/DashboardContextValue";
import { addExpense } from "../../api/expenses";

const QUICK_SUGGESTIONS = [
  { label: "Food 🍔", note: "Food & Dining", keyword: "food" },
  { label: "Fuel ⛽", note: "Fuel / Petrol", keyword: "fuel" },
  { label: "Grocery 🛒", note: "Groceries", keyword: "grocer" },
  { label: "Shopping 🛍️", note: "Shopping", keyword: "shop" },
  { label: "Bills 💡", note: "Utility Bills", keyword: "bill" },
];

export default function AddExpenseQuick() {
  const { refresh, categories = [] } = useDashboard();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  const handleSuggestionClick = (suggestion) => {
    setTitle(suggestion.note);
    if (categories?.length) {
      const match = categories.find((cat) =>
        cat.name.toLowerCase().includes(suggestion.keyword)
      );
      if (match) {
        setCategoryId(match.id);
      }
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter expense note / title");
      return;
    }

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid expense amount");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);
      await addExpense({
        amount: numAmount,
        expenseDate: date,
        categoryId: Number(categoryId),
        note: title.trim(),
      });

      toast.success("Expense added successfully! 🚀");
      setTitle("");
      setAmount("");
      setCategoryId("");
      setDate(new Date().toISOString().slice(0, 10));
      await refresh?.();
    } catch (err) {
      console.error("QUICK ADD ERROR:", err);
      toast.error(err?.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="quick-add-expense"
      className="group relative overflow-hidden rounded-[32px] border-2 border-emerald-500/25 bg-gradient-to-b from-white via-emerald-50/15 to-white p-5 shadow-[0_20px_50px_rgba(16,185,129,0.08)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_25px_60px_rgba(16,185,129,0.14)] dark:border-emerald-500/30 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-emerald-950/20 sm:p-6"
    >
      {/* BACKGROUND ACCENT GLOW */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-400/15 blur-3xl" />

      {/* HEADER */}
      <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/30">
            <Wallet size={18} />
          </div>

          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Quick Add Expense
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record a transaction instantly
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <Sparkles size={10} />
          Instant Entry
        </span>
      </div>

      {/* QUICK SUGGESTION PILLS */}
      <div className="relative z-10 mb-3.5 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Quick:
        </span>
        {QUICK_SUGGESTIONS.map((sug) => (
          <button
            key={sug.label}
            type="button"
            onClick={() => handleSuggestionClick(sug)}
            className="rounded-lg border border-emerald-100/90 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
          >
            {sug.label}
          </button>
        ))}
      </div>

      {/* FORM CONTROLS */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-3">
        {/* 1. EXPENSE NOTE */}
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Expense Note / Title
          </label>
          <input
            id="quick-add-note"
            type="text"
            placeholder="e.g. Chai, Groceries, Petrol, Shopping..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-white/95 px-3.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500"
          />
        </div>

        {/* 2. AMOUNT & DATE (2 COLS) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* AMOUNT */}
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs font-black text-emerald-600 dark:text-emerald-400">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200/90 bg-white/95 pl-7 pr-3 text-xs font-bold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500"
              />
            </div>
          </div>

          {/* DATE */}
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200/90 bg-white/95 px-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500"
            />
          </div>
        </div>

        {/* 3. CATEGORY */}
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-10 w-full appearance-none rounded-xl border border-slate-200/90 bg-white/95 px-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1.5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 px-4 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>{loading ? "Adding Expense..." : "Add Expense"}</span>
        </button>
      </form>
    </section>
  );
}