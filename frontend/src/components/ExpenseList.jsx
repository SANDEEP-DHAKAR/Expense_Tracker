import { useEffect, useMemo, useState } from "react";
import { Pencil, Search, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { deleteExpense, updateExpense } from "../api/expenses";
import { controlClass, secondaryButtonClass } from "./ui/Primitives";
import { formatCurrency, formatDate } from "../utils/format";

export default function ExpenseList({ expenses = [], refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    note: "",
    amount: "",
    expenseDate: "",
    categoryId: "",
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await deleteExpense(id);
      toast.success("Expense deleted");
      await refresh?.();
    } catch (err) {
      console.error("DELETE EXPENSE ERROR:", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      note: expense.note ?? "",
      amount: expense.amount !== undefined ? String(expense.amount) : "",
      expenseDate: expense.expense_date ? expense.expense_date.slice(0, 10) : "",
      categoryId: expense.category_id || expense.categoryId || "",
    });
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    const amount = Number(editData.amount);

    if (Number.isNaN(amount) || amount <= 0 || !editData.expenseDate) {
      toast.error("Amount and date are required");
      return;
    }

    try {
      setLoading(true);
      await updateExpense(editingId, {
        note: editData.note?.trim(),
        amount,
        expenseDate: editData.expenseDate,
        ...(editData.categoryId ? { categoryId: Number(editData.categoryId) } : {}),
      });

      setEditingId(null);
      setEditData({ note: "", amount: "", expenseDate: "", categoryId: "" });
      toast.success("Expense updated");
      await refresh?.();
    } catch (err) {
      console.error("UPDATE EXPENSE ERROR:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = useMemo(() => {
    return (expenses || [])
      .filter((expense) => expense && expense.id)
      .filter((expense) => {
        const note = expense.note || "";
        const category = expense.category_name || expense.category || "";
        const matchSearch = `${note} ${category}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchDate = dateFilter
          ? (expense.expense_date || "").slice(0, 10) === dateFilter
          : true;

        return matchSearch && matchDate;
      });
  }, [expenses, search, dateFilter]);

  const totalPages = Math.max(Math.ceil(filteredExpenses.length / itemsPerPage), 1);
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [filteredExpenses, currentPage]);

  return (
    <section className="min-w-0 rounded-xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none">
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">
              All expenses
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {filteredExpenses.length} matching transactions
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search note or category"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`h-10 w-full pl-9 pr-3 sm:w-64 ${controlClass}`}
              />
            </label>

            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className={`h-10 px-3 ${controlClass}`}
            />

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDateFilter("");
              }}
              className={secondaryButtonClass}
            >
              <X size={15} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {paginatedExpenses.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          No expenses found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedExpenses.map((expense) => (
                <tr key={expense.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-950/60">
                  {editingId === expense.id ? (
                    <>
                      <td className="px-5 py-3">
                        <input
                          value={editData.note}
                          onChange={(event) => handleChange("note", event.target.value)}
                          className={`w-full px-3 py-2 ${controlClass}`}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="date"
                          value={editData.expenseDate}
                          onChange={(event) => handleChange("expenseDate", event.target.value)}
                          className={`w-full px-3 py-2 ${controlClass}`}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          value={editData.amount}
                          onChange={(event) => handleChange("amount", event.target.value)}
                          className={`ml-auto w-36 px-3 py-2 text-right ${controlClass}`}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={loading}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="max-w-[280px] px-5 py-4">
                        <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                          {expense.note || "No note"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {expense.category_name || expense.category || "Uncategorized"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                        {formatDate(expense.expense_date)}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-slate-950 dark:text-white">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(expense)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                            aria-label="Edit expense"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(expense.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300"
                            aria-label="Delete expense"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredExpenses.length > itemsPerPage ? (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
              className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
