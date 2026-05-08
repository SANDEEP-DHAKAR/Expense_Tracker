import { useEffect, useState } from "react";

import {
  Plus,
  Sparkles,
  Wallet,
} from "lucide-react";

import toast from "react-hot-toast";

import { addExpense } from "../api/expenses";
import { getCategories } from "../api/categories";

import {
  controlClass,
  primaryButtonClass,
} from "./ui/Primitives";

export default function AddExpense({
  refresh,
  categories: providedCategories,
  compact = false,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );

  const [categoryId, setCategoryId] =
    useState("");

  const [categories, setCategories] =
    useState(providedCategories || []);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (providedCategories) {
      setCategories(providedCategories);
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await getCategories();

        setCategories(
          res?.data?.data || []
        );
      } catch (err) {
        console.error(
          "FETCH CATEGORIES ERROR:",
          err?.response?.data ||
            err.message
        );

        toast.error(
          "Could not load categories"
        );
      }
    };

    fetchCategories();
  }, [providedCategories]);

  const handleAdd = async (event) => {
    event?.preventDefault();

    if (
      !title.trim() ||
      !amount ||
      !date ||
      !categoryId
    ) {
      toast.error(
        "Please fill all expense fields"
      );

      return;
    }

    if (Number(amount) <= 0) {
      toast.error(
        "Amount must be greater than 0"
      );

      return;
    }

    try {
      setLoading(true);

      await addExpense({
        amount: Number(amount),
        expenseDate: date,
        categoryId: Number(categoryId),
        note: title.trim(),
      });

      setTitle("");
      setAmount("");
      setDate(
        new Date()
          .toISOString()
          .slice(0, 10)
      );

      setCategoryId("");

      toast.success(
        "Expense added successfully"
      );

      await refresh?.();
    } catch (err) {
      console.error(
        "ADD ERROR:",
        err?.response?.data ||
          err.message
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAdd}
      className={`group relative overflow-hidden rounded-[30px] border border-emerald-200/30 bg-white/80 p-6 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl transition-all duration-500 hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/80 ${
        compact ? "" : "mt-5"
      }`}
    >
      {/* BACKGROUND GLOW */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-lime-400/10 blur-3xl" />

      {/* HEADER */}
      <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-300">
            <Sparkles size={12} />
            Quick Add
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Add Expense
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Capture transactions instantly
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
          <Wallet size={22} />
        </div>
      </div>

      {/* FORM */}
      <div className="relative z-10 space-y-4">
        {/* NOTE */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Expense Note
          </label>

          <input
            type="text"
            placeholder="Dinner, Shopping, Fuel..."
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            className={`h-12 w-full rounded-2xl px-4 ${controlClass}`}
          />
        </div>

        {/* AMOUNT + DATE */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Amount
            </label>

            <input
              type="number"
              min="1"
              placeholder="₹ Enter amount"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              className={`h-12 w-full rounded-2xl px-4 ${controlClass}`}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              className={`h-12 w-full min-w-0 appearance-none rounded-2xl px-4 ${controlClass}`}
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(event) =>
              setCategoryId(
                event.target.value
              )
            }
            className={`h-12 w-full min-w-0 appearance-none rounded-2xl px-4 ${controlClass}`}
          >
            <option value="">
              Select category
            </option>

            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-5 text-sm font-bold text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} />

          {loading
            ? "Adding Expense..."
            : "Add Expense"}
        </button>
      </div>
    </form>
  );
}