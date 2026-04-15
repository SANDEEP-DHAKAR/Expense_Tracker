import { deleteExpense, updateExpense } from "../api/expenses";
import { useState, useMemo } from "react";

export default function ExpenseList({ expenses = [], refresh }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ note: "", amount: "" });
    const [loading, setLoading] = useState(false);

    // 🔍 FILTER
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    // 📄 PAGINATION STATES
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 🗑 DELETE
    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            await refresh();
        } catch (err) {
            console.log(err);
        }
    };

    // ✏️ EDIT START
    const startEdit = (exp) => {
        setEditingId(exp.id);
        setEditData({
            note: exp.note || "",
            amount: exp.amount?.toString() || "",
        });
    };

    // 💾 UPDATE
    const handleUpdate = async () => {
        try {
            setLoading(true);

            await updateExpense(editingId, {
                amount: Number(editData.amount),
                note: editData.note,
            });

            setEditingId(null);
            await refresh();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // 🔍 FILTER LOGIC
    const filteredExpenses = useMemo(() => {
        return expenses.filter((exp) => {
            const matchSearch =
                exp.note?.toLowerCase().includes(search.toLowerCase());

            const matchDate = dateFilter
                ? exp.expense_date?.slice(0, 10) === dateFilter
                : true;

            return matchSearch && matchDate;
        });
    }, [expenses, search, dateFilter]);

    // 📄 PAGINATION LOGIC
    const totalPages = Math.ceil(
        filteredExpenses.length / itemsPerPage
    );

    const paginatedExpenses = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        return filteredExpenses.slice(start, end);
    }, [filteredExpenses, currentPage]);

    return (
        <div className="mt-6 bg-white p-5 rounded-3xl shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">

            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">
                📋 Expenses
            </h2>

            {/* 🔍 FILTERS */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center mb-4">

                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1); // reset page
                    }}
                    className="border border-slate-300 bg-white px-4 py-3 rounded-3xl w-full text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />

                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => {
                        setDateFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="border border-slate-300 bg-white px-4 py-3 rounded-3xl w-full md:w-48 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />

                <button
                    onClick={() => {
                        setSearch("");
                        setDateFilter("");
                        setCurrentPage(1);
                    }}
                    className="inline-flex items-center justify-center rounded-3xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                >
                    Reset
                </button>
            </div>

            {/* LIST */}
            {paginatedExpenses.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-slate-400">
                    No expenses found 🚀
                </p>
            ) : (
                paginatedExpenses.map((exp) => (
                    <div
                        key={exp.id}
                        className="flex flex-col gap-3 py-4 border-b border-slate-200 last:border-b-0 dark:border-slate-700"
                    >
                        {editingId === exp.id ? (
                            <div className="grid gap-3 sm:grid-cols-[1fr_120px] w-full">
                                <input
                                    value={editData.note}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            note: e.target.value,
                                        })
                                    }
                                    className="border border-slate-300 bg-white px-3 py-2 rounded-2xl text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                />

                                <div className="flex gap-2">
                                    <input
                                        value={editData.amount}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                amount: e.target.value,
                                            })
                                        }
                                        className="border border-slate-300 bg-white px-3 py-2 w-full rounded-2xl text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                    />
                                    <button
                                        onClick={handleUpdate}
                                        className="rounded-2xl bg-emerald-500 px-4 py-2 text-white transition hover:bg-emerald-600"
                                    >
                                        Save
                                    </button>
                                </div>

                                <button
                                    onClick={() => setEditingId(null)}
                                    className="rounded-2xl bg-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{exp.note || "No note"}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">₹{exp.amount} · {exp.expense_date?.slice(0, 10)}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => startEdit(exp)}
                                            className="rounded-2xl bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className="rounded-2xl bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))
            )}

            {/* 📄 PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-4">

                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((p) => p - 1)
                        }
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((p) => p + 1)
                        }
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}