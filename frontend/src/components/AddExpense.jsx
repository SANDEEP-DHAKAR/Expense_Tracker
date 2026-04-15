import { useState, useEffect } from "react";
import { addExpense } from "../api/expenses";
import { getCategories } from "../api/categories";

export default function AddExpense({ refresh }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    // 🔥 Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res?.data?.data || []);
            } catch (err) {
                console.error("FETCH CATEGORIES ERROR:", err?.response?.data || err.message);
            }
        };

        fetchCategories();
    }, []);

    // 🔥 VALIDATION
    const isValid = () => {
        if (!title || !amount || !date || !categoryId) {
            alert("Please fill all fields");
            return false;
        }

        if (Number(amount) <= 0) {
            alert("Amount must be greater than 0");
            return false;
        }

        return true;
    };

    // 🔥 HANDLE ADD
    const handleAdd = async () => {
        if (!isValid()) return;

        try {
            setLoading(true);

            await addExpense({
                amount: Number(amount),
                expenseDate: date,
                categoryId: Number(categoryId),
                note: title,
            });

            // reset fields
            setTitle("");
            setAmount("");
            setDate("");
            setCategoryId("");

            await refresh();
        } catch (err) {
            console.log("ADD ERROR:", err?.response?.data || err.message);
            alert("Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 bg-white shadow-xl rounded-3xl mt-6 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">

            <h2 className="font-bold text-lg mb-4 text-slate-900 dark:text-slate-100">
                ➕ Add New Expense
            </h2>

            {/* Title */}
            <input
                className="border border-slate-300 bg-white px-4 py-3 w-full mb-3 rounded-3xl text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Title (e.g. Food, Rent)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* Amount */}
            <input
                type="number"
                className="border border-slate-300 bg-white px-4 py-3 w-full mb-3 rounded-3xl text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            {/* Date */}
            <input
                type="date"
                className="border border-slate-300 bg-white px-4 py-3 w-full mb-3 rounded-3xl text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            {/* Category */}
            <select
                className="border border-slate-300 bg-white px-4 py-3 w-full mb-4 rounded-3xl text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
            >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            {/* Button */}
            <button
                onClick={handleAdd}
                disabled={loading}
                className={`w-full rounded-3xl py-3 text-white text-sm font-semibold transition ${loading
                        ? "bg-gray-400"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    }`}
            >
                {loading ? "Adding..." : "Add Expense"}
            </button>
        </div>
    );
}