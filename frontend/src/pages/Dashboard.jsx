import { useEffect, useState } from "react";
import { getExpenses } from "../api/expenses";

import Sidebar from "../components/Sidebar"; // 🔥 ADD THIS

import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import ExpenseBarChart from "../components/ExpenseBarChart";
import MonthlyChart from "../components/MonthlyChart";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);

    // 🔥 FETCH
    const fetchExpenses = async () => {
        try {
            const res = await getExpenses();
            setExpenses(res.data.data || []);
        } catch (err) {
            console.log("FETCH ERROR:", err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // 📈 LINE CHART DATA
    const lineData = {};

    expenses.forEach((item) => {
        const month = item.expense_date?.slice(0, 7) || "Unknown";

        if (!lineData[month]) {
            lineData[month] = 0;
        }

        lineData[month] += Number(item.amount);
    });

    const chartData = Object.keys(lineData).map((key) => ({
        month: key,
        amount: lineData[key],
    }));

    // 💰 TOTAL
    const total = expenses.reduce(
        (acc, item) => acc + Number(item.amount),
        0
    );

    return (
        <div className="flex">

            {/* 🔥 SIDEBAR */}
            <Sidebar />

            {/* 🔥 MAIN CONTENT */}
            <div className="ml-64 w-full p-6 bg-gray-100 min-h-screen">

                {/* HEADER */}
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

                {/* 📈 LINE CHART */}
                <div className="bg-white p-4 rounded-xl shadow mb-6">
                    <h2 className="font-bold mb-4 text-center">📈 Monthly Trend</h2>

                    <div className="w-full h-[300px]">
                        <ResponsiveContainer>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#4F46E5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHARTS */}
                <ExpenseChart expenses={expenses} />
                <ExpenseBarChart expenses={expenses} />
                <MonthlyChart expenses={expenses} />

                {/* ADD */}
                <AddExpense refresh={fetchExpenses} />

                {/* LIST */}
                <ExpenseList expenses={expenses} refresh={fetchExpenses} />

            </div>
        </div>
    );
}