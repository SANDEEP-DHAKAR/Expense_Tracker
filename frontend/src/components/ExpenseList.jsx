import { deleteExpense, updateExpense } from "../api/expenses";
import { useState } from "react";

export default function ExpenseList({ expenses, refresh }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ title: "", amount: "" });

    const handleDelete = async (id) => {
        await deleteExpense(id);
        refresh();
    };

    const startEdit = (exp) => {
        setEditingId(exp.id);
        setEditData({ title: exp.title, amount: exp.amount });
    };

    const handleUpdate = async () => {
        try {
            await updateExpense(editingId, {
                title: editData.title,
                amount: Number(editData.amount), 
            });

            setEditingId(null);
            refresh(); // 🔁 data reload
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="mt-4">
            <h2 className="font-bold mb-2">All Expenses</h2>

            {expenses.map((exp) => (
                <div key={exp.id} className="p-3 shadow mb-2 rounded">

                    {editingId === exp.id ? (
                        <>
                            <input
                                value={editData.title}
                                onChange={(e) =>
                                    setEditData({ ...editData, title: e.target.value })
                                }
                                className="border p-1 mr-2"
                            />

                            <input
                                value={editData.amount}
                                onChange={(e) =>
                                    setEditData({ ...editData, amount: e.target.value })
                                }
                                className="border p-1 mr-2"
                            />

                            <button
                                onClick={handleUpdate}
                                className="bg-green-500 text-white px-2"
                            >
                                Save
                            </button>
                        </>
                    ) : (
                        <div className="flex justify-between">
                            <span>
                                {exp.title} - ₹{exp.amount}
                            </span>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEdit(exp)}
                                    className="bg-yellow-500 text-white px-2"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    className="bg-red-500 text-white px-2"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}