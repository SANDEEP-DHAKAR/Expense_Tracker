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
import MonthlyChart from "../components/MonthlyChart";
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
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("EXPORT ERROR:", err);
        } finally {
            setExporting(false);
        }
    };

    const fetchDashboard = async () => {
        try {
            const res = await getDashboardSummary();
            if (res?.data?.success) {
                setDashboard(res.data);
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
            console.error("NOTIFICATIONS ERROR:", err);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res?.data?.data || []);
        } catch (err) {
            console.error("FETCH NOTIFICATIONS ERROR:", err);
        }
    };

    useEffect(() => {
        fetchDashboard();
        fetchNotificationCount();
        fetchExpenses();
        fetchCategories();
    }, []);

    const handleNotificationClick = async () => {
        setShowNotifications((prev) => !prev);
        if (!showNotifications) {
            await fetchNotifications();
        }
    };

    const handleNotificationsUpdate = async () => {
        await fetchNotifications();
        await fetchNotificationCount();
        await fetchDashboard();
    };

    const chartData = useMemo(() => {
        return dashboard.monthly_graph.map((item) => ({
            month: item.month,
            amount: item.total
        }));
    }, [dashboard.monthly_graph]);

    const totalExpenses = useMemo(() => {
        return expenses.reduce((acc, item) => acc + Number(item?.amount || 0), 0);
    }, [expenses]);

    return (
        <div className="flex">
            <Sidebar />

            <div className="ml-0 xl:ml-64 w-full p-4 sm:p-6 bg-gray-100 dark:bg-slate-950 min-h-screen relative">
                <div className="mx-auto w-full max-w-[1600px]">
                    <MobileNavbar />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="text-gray-500 mt-1 dark:text-slate-400">Manage your spending, budgets, and alerts in one place.</p>
                        </div>

                        <div className="flex items-center gap-3 relative">
                            <NotificationBell count={notificationsCount} onClick={handleNotificationClick} />
                            {loading && <span className="text-sm text-gray-500">Loading...</span>}
                            {showNotifications && (
                                <NotificationsPanel
                                    notifications={notifications}
                                    onClose={() => setShowNotifications(false)}
                                    onRead={handleNotificationsUpdate}
                                />
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-5 mb-6 dark:bg-slate-800/95 dark:border dark:border-slate-700">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Search</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full rounded-xl border-gray-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                        placeholder="Search categories or notes"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Category</label>
                                    <select
                                        className="mt-1 block w-full rounded-xl border-gray-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                    >
                                        <option value="">All categories</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Start Date</label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-xl border-gray-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">End Date</label>
                                    <input
                                        type="date"
                                        className="mt-1 block w-full rounded-xl border-gray-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                    onClick={handleFilterApply}
                                >
                                    Apply Filters
                                </button>
                                <button
                                    className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                    onClick={handleExport}
                                    disabled={exporting}
                                >
                                    {exporting ? "Exporting..." : "Export CSV"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-5 rounded-3xl shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                            <h3 className="text-sm text-gray-500 dark:text-slate-400">Monthly Spend</h3>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">₹{dashboard.summary.monthly_expense}</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                            <h3 className="text-sm text-gray-500 dark:text-slate-400">Total Spend</h3>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">₹{dashboard.summary.total_expense}</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                            <h3 className="text-sm text-gray-500 dark:text-slate-400">Tracked Expenses</h3>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{expenses.length}</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                            <h3 className="text-sm text-gray-500 dark:text-slate-400">Budget Used</h3>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{dashboard.budget.used_percentage}%</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow dark:bg-slate-800">
                            <h2 className="font-bold mb-4">📈 Monthly Trend</h2>
                            <div className="w-full h-[320px]">
                                <ResponsiveContainer>
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
                        <MonthlyChart expenses={expenses} />
                    </div>

                    <AddExpense refresh={fetchExpenses} />

                    <ExpenseList expenses={expenses} refresh={fetchExpenses} />
                </div>
            </div>
        </div>
    );
}