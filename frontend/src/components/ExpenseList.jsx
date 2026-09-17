import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Search,
  Trash2,
  X,
  ReceiptText,
  Check,
  Tag,
  Calendar,
  RotateCcw,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  deleteExpense,
  updateExpense,
} from "../api/expenses";

import {
  controlClass,
  secondaryButtonClass,
} from "./ui/Primitives";

import {
  formatCurrency,
  formatDate,
  formatInputDate,
} from "../utils/format";

export default function ExpenseList({
  expenses = [],
  categories = [],
  refresh,
}) {
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    note: "",
    amount: "",
    expenseDate: "",
    categoryId: "",
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, dateFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await deleteExpense(id);
      toast.success("Expense deleted");
      await refresh?.();
    } catch (err) {
      console.error("DELETE EXPENSE ERROR:", err);
      toast.error(
        err?.response?.data?.message || "Delete failed"
      );
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditData({
      note: expense.note || expense.description || "",
      amount:
        expense.amount !== undefined ? String(expense.amount) : "",
      expenseDate: formatInputDate(expense.expense_date),
      categoryId:
        expense.category_id || expense.categoryId || "",
    });
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    const amount = Number(editData.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Valid amount is required");
      return;
    }

    if (!editData.expenseDate) {
      toast.error("Expense date is required");
      return;
    }

    try {
      setLoading(true);

      await updateExpense(editingId, {
        note: editData.note?.trim() || null,
        amount,
        expenseDate: editData.expenseDate,
        ...(editData.categoryId
          ? { categoryId: Number(editData.categoryId) }
          : {}),
      });

      setEditingId(null);
      setEditData({
        note: "",
        amount: "",
        expenseDate: "",
        categoryId: "",
      });

      toast.success("Expense updated");
      await refresh?.();
    } catch (err) {
      console.error("UPDATE EXPENSE ERROR:", err?.response?.data || err);
      toast.error(
        err?.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return (expenses || [])
      .filter((expense) => expense && expense.id)
      .filter((expense) => {
        const note = (expense.note || expense.description || "").toLowerCase();
        const categoryName = (
          expense.category_name ||
          expense.category ||
          ""
        ).toLowerCase();
        const searchLower = search.trim().toLowerCase();

        // Search match
        const matchSearch =
          !searchLower ||
          note.includes(searchLower) ||
          categoryName.includes(searchLower) ||
          String(expense.amount || "").includes(searchLower);

        // Category filter match
        const matchCategory =
          !categoryFilter ||
          String(expense.category_id) === String(categoryFilter) ||
          categoryName === categoryFilter.toLowerCase();

        // Date filter match (safe local date comparison)
        const expenseFormattedDate = formatInputDate(expense.expense_date);
        const matchDate =
          !dateFilter || expenseFormattedDate === dateFilter;

        return matchSearch && matchCategory && matchDate;
      });
  }, [expenses, search, categoryFilter, dateFilter]);

  // Total matching amount
  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, exp) => sum + Number(exp.amount || 0),
      0
    );
  }, [filteredExpenses]);

  // Pagination
  const totalPages = Math.max(
    Math.ceil(filteredExpenses.length / itemsPerPage),
    1
  );

  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [filteredExpenses, currentPage]);

  const hasActiveFilters = Boolean(search || categoryFilter || dateFilter);

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setDateFilter("");
  };

  return (
    <section className="overflow-hidden rounded-[30px] border border-emerald-100/70 bg-white/80 shadow-[0_20px_80px_rgba(16,185,129,0.08)] backdrop-blur-2xl dark:border-emerald-900/30 dark:bg-slate-950/70">
      {/* HEADER */}
      <div className="border-b border-emerald-100/60 bg-gradient-to-r from-emerald-50/80 via-emerald-50/40 to-transparent p-5 sm:p-6 dark:border-emerald-900/20 dark:from-emerald-950/20">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* TITLE & SUMMARY */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/30">
              <ReceiptText size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Expense History
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                {filteredExpenses.length}{" "}
                {filteredExpenses.length === 1
                  ? "transaction"
                  : "transactions"}
                {" • "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Total: {formatCurrency(totalFilteredAmount)}
                </span>
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[170px] flex-1 sm:w-64 sm:flex-none">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
              />
              <input
                type="text"
                value={search}
                placeholder="Search note or category..."
                onChange={(e) => setSearch(e.target.value)}
                className={`h-10 w-full rounded-2xl border-emerald-200/70 bg-white/90 pl-9 pr-3 text-xs shadow-sm backdrop-blur dark:border-emerald-900/30 dark:bg-slate-900/80 sm:text-sm ${controlClass}`}
              />
            </div>

            {/* Category Dropdown Filter */}
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`h-10 min-w-[130px] rounded-2xl border-emerald-200/70 bg-white/90 px-3 text-xs shadow-sm backdrop-blur dark:border-emerald-900/30 dark:bg-slate-900/80 sm:text-sm ${controlClass}`}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}

            {/* Date Picker Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`h-10 rounded-2xl border-emerald-200/70 bg-white/90 px-3 text-xs shadow-sm backdrop-blur dark:border-emerald-900/30 dark:bg-slate-900/80 sm:text-sm ${controlClass}`}
            />

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-10 items-center gap-1.5 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-3 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 sm:text-sm"
              >
                <RotateCcw size={13} />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      {paginatedExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 text-emerald-600 shadow-lg shadow-emerald-500/10 dark:text-emerald-400">
            <ReceiptText size={32} />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {hasActiveFilters ? "No matching expenses" : "No expenses yet"}
          </h3>

          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {hasActiveFilters
              ? "Try adjusting or clearing your search and date filters."
              : "Transactions will appear here once you start adding expenses."}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <RotateCcw size={13} />
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* DESKTOP / TABLET TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-emerald-100/60 bg-emerald-50/50 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800 dark:border-emerald-900/20 dark:bg-emerald-950/20 dark:text-emerald-300">
                <tr>
                  <th className="px-6 py-4">Expense</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-emerald-100/60 dark:divide-emerald-900/20">
                {paginatedExpenses.map((expense) => {
                  const isEditing = editingId === expense.id;

                  if (isEditing) {
                    return (
                      <tr
                        key={expense.id}
                        className="bg-emerald-50/40 dark:bg-emerald-950/30"
                      >
                        {/* EDIT NOTE */}
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            placeholder="Expense note"
                            value={editData.note}
                            onChange={(e) =>
                              handleChange("note", e.target.value)
                            }
                            className={`w-full rounded-xl border-emerald-200 bg-white px-3 py-2 text-sm dark:border-emerald-900/40 dark:bg-slate-900 ${controlClass}`}
                          />
                        </td>

                        {/* EDIT CATEGORY */}
                        <td className="px-6 py-4">
                          <select
                            value={editData.categoryId}
                            onChange={(e) =>
                              handleChange("categoryId", e.target.value)
                            }
                            className={`w-full rounded-xl border-emerald-200 bg-white px-3 py-2 text-sm dark:border-emerald-900/40 dark:bg-slate-900 ${controlClass}`}
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* EDIT DATE */}
                        <td className="px-6 py-4">
                          <input
                            type="date"
                            value={editData.expenseDate}
                            onChange={(e) =>
                              handleChange("expenseDate", e.target.value)
                            }
                            className={`w-full rounded-xl border-emerald-200 bg-white px-3 py-2 text-sm dark:border-emerald-900/40 dark:bg-slate-900 ${controlClass}`}
                          />
                        </td>

                        {/* EDIT AMOUNT */}
                        <td className="px-6 py-4 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Amount"
                            value={editData.amount}
                            onChange={(e) =>
                              handleChange("amount", e.target.value)
                            }
                            className={`w-28 rounded-xl border-emerald-200 bg-white px-3 py-2 text-right text-sm dark:border-emerald-900/40 dark:bg-slate-900 ${controlClass}`}
                          />
                        </td>

                        {/* EDIT ACTIONS */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={loading}
                              onClick={handleUpdate}
                              title="Save changes"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20 transition hover:scale-105 disabled:opacity-60"
                            >
                              <Check size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              title="Cancel"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={expense.id}
                      className="group transition-colors duration-150 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10"
                    >
                      {/* EXPENSE NOTE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 text-emerald-700 dark:text-emerald-300">
                            <ReceiptText size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {expense.note ||
                                expense.description ||
                                "No note"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <Tag size={11} />
                          {expense.category_name ||
                            expense.category ||
                            "Uncategorized"}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {formatDate(expense.expense_date)}
                      </td>

                      {/* AMOUNT */}
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-3.5 py-1.5 text-sm font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {formatCurrency(expense.amount)}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(expense)}
                            title="Edit expense"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200/80 bg-white text-emerald-700 shadow-sm transition hover:scale-105 hover:bg-emerald-50 dark:border-emerald-900/30 dark:bg-slate-900 dark:text-emerald-300"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(expense.id)}
                            title="Delete expense"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 shadow-sm transition hover:scale-105 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="space-y-3 p-4 md:hidden">
            {paginatedExpenses.map((expense) => {
              const isEditing = editingId === expense.id;

              if (isEditing) {
                return (
                  <div
                    key={expense.id}
                    className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30"
                  >
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Note
                      </label>
                      <input
                        type="text"
                        value={editData.note}
                        onChange={(e) =>
                          handleChange("note", e.target.value)
                        }
                        className={`w-full rounded-xl bg-white px-3 py-2 text-sm dark:bg-slate-900 ${controlClass}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Amount
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={editData.amount}
                          onChange={(e) =>
                            handleChange("amount", e.target.value)
                          }
                          className={`w-full rounded-xl bg-white px-3 py-2 text-sm dark:bg-slate-900 ${controlClass}`}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Date
                        </label>
                        <input
                          type="date"
                          value={editData.expenseDate}
                          onChange={(e) =>
                            handleChange("expenseDate", e.target.value)
                          }
                          className={`w-full rounded-xl bg-white px-3 py-2 text-sm dark:bg-slate-900 ${controlClass}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Category
                      </label>
                      <select
                        value={editData.categoryId}
                        onChange={(e) =>
                          handleChange("categoryId", e.target.value)
                        }
                        className={`w-full rounded-xl bg-white px-3 py-2 text-sm dark:bg-slate-900 ${controlClass}`}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleUpdate}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={expense.id}
                  className="rounded-2xl border border-emerald-100/80 bg-white/90 p-4 shadow-sm transition dark:border-emerald-900/30 dark:bg-slate-900/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        <ReceiptText size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {expense.note ||
                            expense.description ||
                            "No note"}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {expense.category_name ||
                              expense.category ||
                              "Uncategorized"}
                          </span>
                          <span>•</span>
                          <span>{formatDate(expense.expense_date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => startEdit(expense)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/40 dark:bg-slate-900 dark:text-emerald-300"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(expense.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* PAGINATION */}
      {filteredExpenses.length > itemsPerPage && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-emerald-100/60 p-5 sm:flex-row dark:border-emerald-900/20">
          <span className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of{" "}
            {filteredExpenses.length} entries
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-900/30 dark:bg-slate-900 dark:text-emerald-300 sm:text-sm"
            >
              Previous
            </button>

            <span className="px-2 text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}