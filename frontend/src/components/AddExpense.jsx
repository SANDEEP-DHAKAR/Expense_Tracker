import { useState } from "react";
import { addExpense } from "../api/expenses";

export default function AddExpense({ refresh }) {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");

    const handleAdd = async () => {
        try {
            await addExpense({ title, amount });

            setTitle("");
            setAmount("");

            refresh(); // 🔁 reload list
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="p-4 shadow rounded mt-4">
            <h2 className="font-bold mb-2">Add Expense</h2>

            <input
                className="border p-2 w-full mb-2"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                className="border p-2 w-full mb-2"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <button
                onClick={handleAdd}
                className="bg-green-500 text-white p-2 w-full"
            >
                Add
            </button>
        </div>
    );
}