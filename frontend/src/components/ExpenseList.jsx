import { useEffect, useMemo, useState } from "react";
import {
  Pencil,
  Search,
  Trash2,
  X,
  ReceiptText,
  Check,
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
} from "../utils/format";

export default function ExpenseList({
  expenses = [],
  refresh,
}) {
  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({
      note: "",
      amount: "",
      expenseDate: "",
      categoryId: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?"))
      return;

    try {
      await deleteExpense(id);

      toast.success("Expense deleted");

      await refresh?.();
    } catch (err) {
      console.error(
        "DELETE EXPENSE ERROR:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);

    setEditData({
      note: expense.note ?? "",
      amount:
        expense.amount !== undefined
          ? String(expense.amount)
          : "",

      expenseDate: expense.expense_date
        ? expense.expense_date.slice(0, 10)
        : "",

      categoryId:
        expense.category_id ||
        expense.categoryId ||
        "",
    });
  };

  const handleChange = (
    field,
    value
  ) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    const amount = Number(
      editData.amount
    );

    if (
      Number.isNaN(amount) ||
      amount <= 0 ||
      !editData.expenseDate
    ) {
      toast.error(
        "Amount and date are required"
      );

      return;
    }

    try {
      setLoading(true);

      await updateExpense(editingId, {
        note:
          editData.note?.trim(),

        amount,

        expenseDate:
          editData.expenseDate,

        ...(editData.categoryId
          ? {
            categoryId: Number(
              editData.categoryId
            ),
          }
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
      console.error(
        "UPDATE EXPENSE ERROR:",
        err?.response?.data || err
      );

      toast.error(
        err?.response?.data?.message ||
        "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses =
    useMemo(() => {
      return (expenses || [])
        .filter(
          (expense) =>
            expense && expense.id
        )

        .filter((expense) => {
          const note =
            expense.note || "";

          const category =
            expense.category_name ||
            expense.category ||
            "";

          const matchSearch = `${note} ${category}`
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

          const matchDate = dateFilter
            ? (
              expense.expense_date || ""
            ).slice(0, 10) ===
            dateFilter
            : true;

          return (
            matchSearch && matchDate
          );
        });
    }, [expenses, search, dateFilter]);

  const totalPages = Math.max(
    Math.ceil(
      filteredExpenses.length /
      itemsPerPage
    ),
    1
  );

  const paginatedExpenses =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      return filteredExpenses.slice(
        start,
        start + itemsPerPage
      );
    }, [
      filteredExpenses,
      currentPage,
    ]);

  return (
    <section className="overflow-hidden rounded-[30px] border border-emerald-100/70 bg-white/70 shadow-[0_20px_80px_rgba(16,185,129,0.08)] backdrop-blur-2xl dark:border-emerald-900/30 dark:bg-slate-950/70">

      {/* HEADER */}
      <div className="border-b border-emerald-100/60 bg-gradient-to-r from-emerald-50/70 to-transparent px-5 py-5 dark:border-emerald-900/20 dark:from-emerald-950/10">

        <div className="flex flex-col gap-0 lg:flex-row lg:items-center lg:justify-between">

          {/* TITLE */}
          <div className="flex items-center gap-0">

            <div className="flex h-14 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg shadow-emerald-500/30">
              <ReceiptText
                size={28}
                className="text-white"
              />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                History
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {
                  filteredExpenses.length
                }{" "}
                matching transactions
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col gap-0 w-full lg:flex-row lg:items-center lg:justify-end lg:w-auto">

            <label className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
              />

              <input
                type="text"
                value={search}
                placeholder="Search expenses..."
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className={`h-11 w-full max-w-[420px] rounded-2xl border-emerald-200/70 bg-white/80 pl-10 pr-4 shadow-sm backdrop-blur lg:w-72 dark:border-emerald-900/30 dark:bg-slate-900/70 ${controlClass}`}
              />
            </label>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
              className={`h-11 w-full max-w-[160px] rounded-2xl border-emerald-200/70 bg-white/80 px-4 shadow-sm backdrop-blur lg:w-40 dark:border-emerald-900/30 dark:bg-slate-900/70 ${controlClass}`}
            />

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDateFilter("");
              }}
              className={`${secondaryButtonClass} h-11 shrink-0 rounded-2xl border-emerald-200 bg-white/80 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/30 dark:bg-slate-900 dark:text-emerald-300`}
            >
              <X size={15} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {paginatedExpenses.length ===
        0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-20 text-center">

          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-xl shadow-emerald-500/30">
            <ReceiptText
              size={34}
              className="text-white"
            />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No expenses found
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Your transactions will
            appear here once you
            start tracking expenses.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full min-w-full table-fixed">

            <thead className="bg-emerald-50/60 dark:bg-emerald-950/10">
              <tr className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">

                <th className="px-6 py-4 text-left font-bold">
                  Expense
                </th>

                <th className="px-6 py-4 text-left font-bold">
                  Date
                </th>

                <th className="px-6 py-4 text-right font-bold">
                  Amount
                </th>

                <th className="px-6 py-4 text-right font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-emerald-100/60 dark:divide-emerald-900/20">

              {paginatedExpenses.map(
                (expense) => (
                  <tr
                    key={expense.id}
                    className="group transition-all duration-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10"
                  >
                    {editingId ===
                      expense.id ? (
                      <>
                        <td className="px-6 py-5">
                          <input
                            value={
                              editData.note
                            }
                            onChange={(
                              e
                            ) =>
                              handleChange(
                                "note",
                                e.target
                                  .value
                              )
                            }
                            className={`w-full rounded-2xl border-emerald-200 bg-white/80 px-4 py-2.5 dark:border-emerald-900/30 dark:bg-slate-900/70 ${controlClass}`}
                          />
                        </td>

                        <td className="px-6 py-5">
                          <input
                            type="date"
                            value={
                              editData.expenseDate
                            }
                            onChange={(
                              e
                            ) =>
                              handleChange(
                                "expenseDate",
                                e.target
                                  .value
                              )
                            }
                            className={`rounded-2xl border-emerald-200 bg-white/80 px-4 py-2.5 dark:border-emerald-900/30 dark:bg-slate-900/70 ${controlClass}`}
                          />
                        </td>

                        <td className="px-6 py-5">
                          <input
                            value={
                              editData.amount
                            }
                            onChange={(
                              e
                            ) =>
                              handleChange(
                                "amount",
                                e.target
                                  .value
                              )
                            }
                            className={`ml-auto w-36 rounded-2xl border-emerald-200 bg-white/80 px-4 py-2.5 text-right dark:border-emerald-900/30 dark:bg-slate-900/70 ${controlClass}`}
                          />
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              disabled={
                                loading
                              }
                              onClick={
                                handleUpdate
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/25 transition hover:scale-105 disabled:opacity-60"
                            >
                              <Check
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setEditingId(
                                  null
                                )
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                            >
                              <X
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="max-w-[320px] min-w-0 px-6 py-5">

                          <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 text-emerald-700 dark:text-emerald-300">
                              <ReceiptText
                                size={18}
                              />
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                {expense.note ||
                                  "No note"}
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                {expense.category_name ||
                                  expense.category ||
                                  "Uncategorized"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                          {formatDate(
                            expense.expense_date
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">

                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            {formatCurrency(
                              expense.amount
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                startEdit(
                                  expense
                                )
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-white text-emerald-700 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-emerald-50 dark:border-emerald-900/30 dark:bg-slate-900 dark:text-emerald-300"
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  expense.id
                                )
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {filteredExpenses.length >
        itemsPerPage ? (
        <div className="flex flex-col gap-4 border-t border-emerald-100/60 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-900/20">

          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {currentPage} of{" "}
            {totalPages}
          </span>

          <div className="flex gap-3">

            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      1
                    )
                )
              }
              className="rounded-2xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-900/30 dark:bg-slate-900 dark:text-emerald-300"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                )
              }
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}