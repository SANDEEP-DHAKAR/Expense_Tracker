import { deleteExpense } from "../api/expenses";

export default function ExpenseList({ expenses, refresh }) {
    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            refresh();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="mt-4">
            <h2 className="font-bold mb-2">All Expenses</h2>

            {expenses.map((exp) => (
                <div
                    key={exp.id}
                    className="flex justify-between p-3 shadow mb-2 rounded"
                >
                    <div>
                        {exp.title} - ₹{exp.amount}
                    </div>

                    <button
                        onClick={() => handleDelete(exp.id)}
                        className="bg-red-500 text-white px-3 py-1"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}