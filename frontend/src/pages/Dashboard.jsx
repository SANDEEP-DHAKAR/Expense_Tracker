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

    const dailyData = useMemo(() => {
        const grouped = expenses.reduce((acc, expense) => {
            if (!expense?.expense_date) return acc;
            const date = expense.expense_date.slice(0, 10);
            acc[date] = (acc[date] || 0) + Number(expense.amount || 0);
            return acc;
        }, {});

        return Object.entries(grouped)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [expenses]);

    const safeRecentTransactions = useMemo(() => {
        return (dashboard?.recent_transactions || [])
            .filter((txn) => txn && txn.id != null)
            .map((txn) => {
                const dateValue = txn.expense_date || txn.date || null;
                const normalizedDate = dateValue ? String(dateValue).slice(0, 10) : null;
                return {
                    ...txn,
                    date: normalizedDate,
                };
            })
            .filter((txn) => txn.date && !Number.isNaN(new Date(txn.date).getTime()))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [dashboard?.recent_transactions]);

    const hasRecentTransactions = safeRecentTransactions.length > 0;

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 min-w-0 overflow-x-hidden w-full p-4 sm:p-6 bg-gray-100 dark:bg-slate-950 relative">
                <div className="mx-auto w-full max-w-[1600px]">
                    <MobileNavbar />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

                        {/* LEFT SIDE */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold truncate">
                                Dashboard
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base dark:text-slate-400">
                                Manage your spending, budgets, and alerts in one place.
                            </p>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex items-center justify-end gap-3 w-full sm:w-auto">

                            <div className="relative">

                                {/* 🔔 Bell */}
                                <NotificationBell
                                    count={notificationsCount}
                                    onClick={handleNotificationClick}
                                />

                                {/* 🔔 Panel */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 z-50 w-[95vw] sm:w-auto max-w-[380px]">
                                        <NotificationsPanel
                                            notifications={notifications}
                                            onClose={() => setShowNotifications(false)}
                                            onRead={handleNotificationsUpdate}
                                        />
                                    </div>
                                )}

                            </div>

                            {/* ⏳ Loading */}
                            {loading && (
                                <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                                    Loading...
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800/90 backdrop-blur rounded-2xl shadow-lg p-4 sm:p-5 mb-6 border border-gray-200 dark:border-slate-700">

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                            {/* 🔍 SEARCH */}
                            <div className="lg:col-span-2 w-full">
                                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
                                    Search
                                </label>

                                <input
                                    type="text"
                                    placeholder="Search categories or notes..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="
                    w-full rounded-xl border border-gray-300 dark:border-slate-700
                    bg-white dark:bg-slate-900
                    px-3 py-2.5
                    text-sm text-slate-900 dark:text-slate-100
                    placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    transition
                "
                                />
                            </div>

                            {/* 📂 CATEGORY */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
                                    Category
                                </label>

                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="
                    w-full rounded-xl border border-gray-300 dark:border-slate-700
                    bg-white dark:bg-slate-900
                    px-3 py-2.5 text-sm
                    text-slate-900 dark:text-slate-100
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
                                >
                                    <option value="">All categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 📅 START DATE */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="
                    w-full rounded-xl border border-gray-300 dark:border-slate-700
                    bg-white dark:bg-slate-900
                    px-3 py-2.5 text-sm
                    text-slate-900 dark:text-slate-100
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
                                />
                            </div>

                            {/* 📅 END DATE */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="
                    w-full rounded-xl border border-gray-300 dark:border-slate-700
                    bg-white dark:bg-slate-900
                    px-3 py-2.5 text-sm
                    text-slate-900 dark:text-slate-100
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
                                />
                            </div>

                            {/* 🔘 BUTTONS */}
                            <div className="flex flex-col sm:flex-row gap-2 lg:col-span-5 justify-end mt-2">

                                <button
                                    onClick={handleFilterApply}
                                    className="
                    w-full sm:w-auto
                    rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white
                    hover:bg-indigo-700 transition
                "
                                >
                                    Apply Filters
                                </button>

                                <button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="
                    w-full sm:w-auto
                    rounded-xl bg-green-600 px-4 py-2 text-sm text-white
                    hover:bg-green-700 transition
                    disabled:opacity-50
                "
                                >
                                    {exporting ? "Exporting..." : "Export CSV"}
                                </button>

                            </div>
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
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">₹{totalExpenses}</p>
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
                    <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow dark:bg-slate-800 min-w-0">
                        <h2 className="font-bold mb-4">📈 Monthly Trend</h2>
                        <div className="w-full h-[320px] min-w-0">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
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
                        onUpdate={fetchDashboard}
                    />
                </div>

                {
                    dashboard.budget.alert && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-xl mb-6">
                            {dashboard.budget.alert.message}
                        </div>
                    )
                }

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-2xl shadow dark:bg-slate-800 min-w-0">

                        <h2 className="font-bold text-lg mb-4">
                            🕒 Recent Transactions
                        </h2>

                        {!hasRecentTransactions ? (
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                                No recent transactions yet.
                            </p>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">

                                {safeRecentTransactions.map((txn) => (

                                    <div
                                        key={txn.id}
                                        className="rounded-2xl border border-gray-200 p-3 dark:border-slate-700 dark:bg-slate-900"
                                    >

                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3">

                                            {/* LEFT */}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                    {txn.note || "No description"}
                                                </p>

                                                <p className="text-sm text-gray-500 dark:text-slate-400">
                                                    {txn.category || "No category"}
                                                </p>
                                            </div>

                                            {/* RIGHT */}
                                            <div className="text-left sm:text-right">
                                                <p className="font-bold text-red-500">
                                                    ₹{txn.amount}
                                                </p>

                                                <p className="text-xs text-gray-400 dark:text-slate-500">
                                                    {txn.date
                                                        ? txn.date.slice(0, 10)
                                                        : "No date"}
                                                </p>
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
        </div>
    );
} 
