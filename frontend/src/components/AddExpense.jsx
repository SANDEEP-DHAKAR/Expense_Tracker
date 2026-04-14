import { useState, useEffect } from "react";
import { addExpense } from "../api/expenses";
import api from "../api/axios";

export default function AddExpense({ refresh }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);

    // 🔥 Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/categories");
                setCategories(res.data.data);
            } catch (err) {
                console.error("FETCH CATEGORIES ERROR:", err.response?.data || err.message);
            }
        };

        fetchCategories();
    }, []);

    // 🔥 HANDLE ADD
    const handleAdd = async () => {
        try {
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
            console.log("ADD ERROR:", err.response?.data || err.message);
        }
    };

    return (
        <div className="p-4 shadow rounded mt-4">
            <h2 className="font-bold mb-2">Add Expense</h2>

            {/* Title */}
            <input
                className="border p-2 w-full mb-2"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* Amount */}
            <input
                type="number"
                className="border p-2 w-full mb-2"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            {/* Date */}
            <input
                type="date"
                className="border p-2 w-full mb-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            {/* Category */}
            <select
                className="border p-2 w-full mb-2"
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

            <button
                onClick={handleAdd}
                className="bg-green-500 text-white p-2 w-full"
            >
                Add Expense
            </button>
        </div>
    );
}