import { deleteExpense, updateExpense } from "../api/expenses";
import { useState, useMemo, useEffect } from "react";

export default function ExpenseList({ expenses = [], refresh }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ note: "", amount: "", expenseDate: "" });
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 🔥 reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, dateFilter]);

    // 🗑 DELETE
    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            await refresh();
        } catch (err) {
            console.log(err);
        }
    };

    // ✏️ EDIT START (IMPORTANT FIX)
    const startEdit = (exp) => {
        setEditingId(exp.id);

        setEditData({
            note: exp.note ?? "",
            amount: exp.amount !== undefined ? String(exp.amount) : "",
            expenseDate: exp.expense_date ? exp.expense_date.slice(0, 10) : "",
        });
    };

    // ✏️ SAFE STATE UPDATE
    const handleChange = (field, value) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // 💾 SAVE (FIXED)
    const handleUpdate = async () => {
        try {
            setLoading(true);

            const amount = Number(editData.amount);

            const payload = {
                note: editData.note?.trim(),
                amount: amount,
                expenseDate: editData.expenseDate,
            };

            console.log("PAYLOAD SENT:", payload);

            // 🚨 HARD VALIDATION (IMPORTANT)
            if (isNaN(payload.amount) || !payload.expenseDate) {
                alert("Amount and date are required ❌");
                return;
            }

            const res = await updateExpense(editingId, payload);

            console.log("SUCCESS RESPONSE:", res);

            setEditingId(null);
            setEditData({ note: "", amount: "", expenseDate: "" });

            await refresh();
        } catch (err) {
            console.log("BACKEND ERROR:", err?.response?.data || err);
            alert(err?.response?.data?.message || "Update failed ❌");
        } finally {
            setLoading(false);
        }
    };

    // 🔍 FILTER SAFE
    const filteredExpenses = useMemo(() => {
        return (expenses || [])
            .filter((exp) => exp && exp.id)
            .filter((exp) => {
                const note = exp.note || "";

                const matchSearch = note
                    .toLowerCase()
                    .includes(search.toLowerCase());

                const matchDate = dateFilter
                    ? (exp.expense_date || "").slice(0, 10) === dateFilter
                    : true;

                return matchSearch && matchDate;
            });
    }, [expenses, search, dateFilter]);

    // 📄 PAGINATION
    const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

    const paginatedExpenses = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredExpenses.slice(start, start + itemsPerPage);
    }, [filteredExpenses, currentPage]);

    return (
        <div className="mt-6 bg-white p-5 rounded-3xl shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">

            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">
                📋 Expenses
            </h2>

            {/* FILTERS */}
            <div className="flex flex-col gap-3 md:flex-row mb-4">

                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-3 rounded-3xl w-full dark:bg-slate-900"
                />

                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border px-4 py-3 rounded-3xl w-full md:w-48 dark:bg-slate-900"
                />

                <button
                    onClick={() => {
                        setSearch("");
                        setDateFilter("");
                    }}
                    className="rounded-3xl bg-slate-200 px-4 py-3"
                >
                    Reset
                </button>
            </div>

            {/* LIST */}
            {paginatedExpenses.length === 0 ? (
                <p className="text-center text-gray-500">
                    No expenses found 🚀
                </p>
            ) : (
                paginatedExpenses.map((exp) => (
                    <div key={exp.id} className="py-4 border-b">

                        {editingId === exp.id ? (
                            <div className="grid gap-3">

                                {/* NOTE */}
                                <input
                                    value={editData.note}
                                    onChange={(e) =>
                                        handleChange("note", e.target.value)
                                    }
                                    className="border px-3 py-2 rounded-2xl"
                                    placeholder="Note"
                                />

                                <div className="grid gap-3 sm:grid-cols-[1fr_160px]">

                                    {/* AMOUNT */}
                                    <input
                                        value={editData.amount}
                                        onChange={(e) =>
                                            handleChange("amount", e.target.value)
                                        }
                                        className="border px-3 py-2 w-full rounded-2xl"
                                        placeholder="Amount"
                                    />

                                    {/* DATE */}
                                    <input
                                        type="date"
                                        value={editData.expenseDate}
                                        onChange={(e) =>
                                            handleChange("expenseDate", e.target.value)
                                        }
                                        className="border px-3 py-2 w-full rounded-2xl"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {/* SAVE */}
                                    <button
                                        onClick={handleUpdate}
                                        disabled={loading}
                                        className={`px-4 py-2 rounded-2xl text-white ${loading
                                                ? "bg-gray-400"
                                                : "bg-emerald-500 hover:bg-emerald-600"
                                            }`}
                                    >
                                        {loading ? "Saving..." : "Save"}
                                    </button>

                                    {/* CANCEL */}
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="bg-gray-200 px-4 py-2 rounded-2xl"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between">

                                <div>
                                    <p className="font-medium">
                                        {exp.note || "No note"}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        ₹{exp.amount} ·{" "}
                                        {exp.expense_date?.slice(0, 10) ||
                                            "No date"}
                                    </p>
                                </div>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => startEdit(exp)}
                                        className="bg-yellow-500 px-4 py-2 text-white rounded-2xl"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(exp.id)}
                                        className="bg-red-500 px-4 py-2 text-white rounded-2xl"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-4">

                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Prev
                    </button>

                    <span>
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next
                    </button>

                </div>
            )}
        </div>
    );
}