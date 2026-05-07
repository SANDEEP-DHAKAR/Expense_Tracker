import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { addExpense } from "../api/expenses";
import { getCategories } from "../api/categories";
import { controlClass, primaryButtonClass } from "./ui/Primitives";

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
      className={`rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none ${
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
          className={`w-full px-3 py-2.5 ${controlClass}`}
          placeholder="Note"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="number"
            min="1"
            className={`w-full px-3 py-2.5 ${controlClass}`}
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />

          <input
            type="date"
            className={`w-full px-3 py-2.5 ${controlClass}`}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <select
          className={`w-full px-3 py-2.5 ${controlClass}`}
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
          className={`w-full ${primaryButtonClass}`}
        >
          <Plus size={16} />
          {loading ? "Adding..." : "Add expense"}
        </button>
      </div>
    </form>
  );
}
