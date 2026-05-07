import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { addExpense } from "../api/expenses";
import { getCategories } from "../api/categories";

export default function AddExpense({ refresh, categories: providedCategories, compact = false }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState(providedCategories || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (providedCategories) {
      setCategories(providedCategories);
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res?.data?.data || []);
      } catch (err) {
        console.error("FETCH CATEGORIES ERROR:", err?.response?.data || err.message);
        toast.error("Could not load categories");
      }
    };

    fetchCategories();
  }, [providedCategories]);

  const handleAdd = async (event) => {
    event?.preventDefault();

    if (!title.trim() || !amount || !date || !categoryId) {
      toast.error("Please fill all expense fields");
      return;
    }

    if (Number(amount) <= 0) {
      toast.error("Amount must be greater than 0");
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
      setDate(new Date().toISOString().slice(0, 10));
      setCategoryId("");

      toast.success("Expense added");
      await refresh?.();
    } catch (err) {
      console.error("ADD ERROR:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAdd}
      className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${
        compact ? "" : "mt-5"
      }`}
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">
          Add expense
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Capture a transaction quickly.
        </p>
      </div>

      <div className="space-y-3">
        <input
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900"
          placeholder="Note"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="number"
            min="1"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900"
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <input
            type="date"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <select
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus size={16} />
          {loading ? "Adding..." : "Add expense"}
        </button>
      </div>
    </form>
  );
}
