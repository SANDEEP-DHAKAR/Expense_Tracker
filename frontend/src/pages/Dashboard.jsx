import { useEffect, useState, useMemo } from "react";
import { getExpenses, exportExpenses } from "../api/expenses";
import { getCategories } from "../api/categories";
import { getDashboardSummary } from "../api/dashboard";
import { getNotifications, getUnreadNotificationCount } from "../api/notifications";

import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import ExpenseBarChart from "../components/ExpenseBarChart";
import DailyChart from "../components/DailyChart";
import BudgetProgress from "../components/BudgetProgress";
import NotificationBell from "../components/NotificationBell";
import NotificationsPanel from "../components/NotificationsPanel";

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
    const [dashboard, setDashboard] = useState({
        summary: { total_expense: 0, monthly_expense: 0 },
        category_breakdown: [],
        monthly_graph: [],
        recent_transactions: [],
        budget: { budget: 0, spent: 0, remaining: 0, used_percentage: 0, alert: null }
    });

    const [notificationsCount, setNotificationsCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [exporting, setExporting] = useState(false);

    // 🔥 FETCH EXPENSES
    const fetchExpenses = async (filters = {}) => {
        try {
            setLoading(true);
            const res = await getExpenses(filters);
            setExpenses(res?.data?.data || []);
        } catch (err) {
            console.error("FETCH EXPENSES ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterApply = async () => {
        await fetchExpenses({ search, categoryId, startDate, endDate });
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            const res = await exportExpenses({ search, categoryId, startDate, endDate });

            const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "expenses_export.csv");
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("EXPORT ERROR:", err);
        } finally {
            setExporting(false);
        }
    };

    // 🔥 DASHBOARD
    const fetchDashboard = async () => {
        try {
            const res = await getDashboardSummary();
            const data = res?.data;

            if (data?.success) {
                setDashboard({
                    summary: data.summary || { total_expense: 0, monthly_expense: 0 },
                    category_breakdown: data.category_breakdown || [],
                    monthly_graph: data.monthly_graph || [],
                    recent_transactions: data.recent_transactions || [],
                    budget: data.budget || { budget: 0, spent: 0, remaining: 0, used_percentage: 0, alert: null }
                });
            }
        } catch (err) {
            console.error("DASHBOARD ERROR:", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res?.data?.data || []);
        } catch (err) {
            console.error("CATEGORIES ERROR:", err);
        }
    };

    const fetchNotificationCount = async () => {
        try {
            const res = await getUnreadNotificationCount();
            setNotificationsCount(res?.data?.count || 0);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDashboard();
        fetchExpenses();
        fetchCategories();
        fetchNotificationCount();
    }, []);

    // 🔥 SAFE MONTHLY CHART
    const chartData = useMemo(() => {
        return (dashboard?.monthly_graph || []).map((item) => ({
            month: item.month,
            amount: item.total
        }));
    }, [dashboard?.monthly_graph]);

    const dailyData = useMemo(() => {
        const grouped = expenses.reduce((acc, expense) => {
            const date = expense.expense_date?.slice(0, 10);
            if (!date) return acc;
            acc[date] = (acc[date] || 0) + Number(expense.amount || 0);
            return acc;
        }, {});

        return Object.entries(grouped)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [expenses]);

    const totalExpenses = useMemo(() => {
        return expenses.reduce((acc, item) => acc + Number(item?.amount || 0), 0);
    }, [expenses]);

    return (
        <div className="flex">
            <Sidebar />

            <div className="ml-0 xl:ml-64 w-full p-6 bg-gray-100 min-h-screen">

                <MobileNavbar />

                {/* HEADER */}
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <p>Monthly</p>
                        <h2 className="text-xl font-bold">₹{dashboard.summary.monthly_expense}</h2>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow">
                        <p>Total</p>
                        <h2 className="text-xl font-bold">₹{dashboard.summary.total_expense}</h2>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow">
                        <p>Transactions</p>
                        <h2 className="text-xl font-bold">{expenses.length}</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow dark:bg-slate-800">
                            <h2 className="font-bold mb-4">📈 Monthly Trend</h2>
                            <div className="w-full h-[320px] min-w-0 min-h-[320px]" style={{ minWidth: 0, minHeight: 0 }}>
                                <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={0}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#4F46E5"
                                            strokeWidth={3}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <BudgetProgress
                            spent={dashboard.budget.spent}
                            budget={dashboard.budget.budget}
                        />
                    </div>

                    {dashboard.budget.alert && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-xl mb-6">
                            {dashboard.budget.alert.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-5 rounded-2xl shadow dark:bg-slate-800">
                            <h2 className="font-bold text-lg mb-4">🕒 Recent Transactions</h2>
                            {dashboard.recent_transactions.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-slate-400">No recent transactions yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {dashboard.recent_transactions.map((txn) => (
                                        <div key={txn.id} className="rounded-2xl border border-gray-200 p-3 dark:border-slate-700 dark:bg-slate-900">
                                            <div className="flex justify-between items-start gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{txn.note || "No description"}</p>
                                                    <p className="text-sm text-gray-500 dark:text-slate-400">{txn.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-red-500">₹{txn.amount}</p>
                                                    <p className="text-xs text-gray-400 dark:text-slate-500">{txn.date?.slice(0, 10)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow dark:bg-slate-800 xl:col-span-2">
                            <h2 className="font-bold text-lg mb-4">📌 Category Breakdown</h2>
                            {dashboard.category_breakdown.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-slate-400">Add expenses to start seeing category totals.</p>
                            ) : (
                                <div className="space-y-3">
                                    {dashboard.category_breakdown.map((item) => (
                                        <div key={item.name} className="flex justify-between items-center rounded-2xl border border-gray-200 p-3 dark:border-slate-700 dark:bg-slate-900">
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">{((item.total / (dashboard.summary.total_expense || 1)) * 100).toFixed(1)}% of total</p>
                                            </div>
                                            <p className="font-semibold">₹{item.total}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
                        <ExpenseChart expenses={expenses} />
                        <ExpenseBarChart expenses={expenses} />
                        <DailyChart data={dailyData} />
                    </div>

                    <AddExpense refresh={fetchExpenses} />

                    <ExpenseList expenses={expenses} refresh={fetchExpenses} />
                </div>

                {/* 📈 MONTHLY CHART */}
                <div className="bg-white p-4 rounded-xl shadow mb-6">
                    <h2 className="font-bold mb-2">Monthly Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="amount" stroke="#4F46E5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* 🔥 NEW: DAILY TREND (REPLACED CHART) */}
                <div className="bg-white p-4 rounded-xl shadow mb-6">
                    <h2 className="font-bold mb-2">Daily Expense Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="amount" stroke="#10B981" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <BudgetProgress
                    spent={dashboard.budget.spent}
                    budget={dashboard.budget.budget}
                />

                {/* CHARTS */}
                <ExpenseChart expenses={expenses} />
                <ExpenseBarChart expenses={expenses} />

                {/* ADD */}
                <AddExpense refresh={fetchExpenses} />

                {/* LIST */}
                <ExpenseList expenses={expenses} refresh={fetchExpenses} />
            </div>
        </div>
    );
}