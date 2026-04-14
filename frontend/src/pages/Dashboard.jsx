import { useEffect, useState } from "react";
import { getExpenses } from "../api/expenses";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);

    const fetchExpenses = async () => {
        const res = await getExpenses();
        setExpenses(res.data.data);
    };

    const data = expenses.map((item, index) => ({
        name: `#${index + 1}`,
        amount: item.amount,
    }));

    useEffect(() => {
        fetchExpenses();
    }, []);

    const total = expenses.reduce((acc, item) => acc + Number(item.amount), 0);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <LineChart width={400} height={300} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" />
            </LineChart>

            {/* 🔥 Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow">
                    <h2 className="text-gray-500">Total Expense</h2>
                    <p className="text-xl font-bold">₹ {total}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                    <h2 className="text-gray-500">Total Transactions</h2>
                    <p className="text-xl font-bold">{expenses.length}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                    <h2 className="text-gray-500">Status</h2>
                    <p className="text-xl font-bold text-green-500">Active</p>
                </div>
            </div>

            {/* ➕ Add Expense */}
            <AddExpense refresh={fetchExpenses} />

            {/* 📋 Expense List */}
            <ExpenseList expenses={expenses} refresh={fetchExpenses} />
        </div>
    );
}