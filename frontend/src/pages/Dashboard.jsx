import { useEffect, useState } from "react";
import { getExpenses } from "../api/expenses";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);

    const fetchExpenses = async () => {
        try {
            const res = await getExpenses();
            setExpenses(res.data.data); // backend format
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            {/* ➕ Add Expense */}
            <AddExpense refresh={fetchExpenses} />

            {/* 📋 Expense List */}
            <ExpenseList expenses={expenses} refresh={fetchExpenses} />
        </div>
    );
}