import { useEffect, useState } from "react";
import { getExpenses } from "../api/expenses";
import ExpenseList from "../components/ExpenseList";
import MobileNavbar from "../components/MobileNavbar";
import Sidebar from "../components/Sidebar";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpenses({ limit: 1000 });
      setExpenses(res?.data?.data || []);
    } catch (err) {
      console.error("FETCH EXPENSES ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-x-hidden w-full p-4 sm:p-6 bg-gray-100 dark:bg-slate-950 relative">
        <MobileNavbar />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Review and manage all your expenses in one place.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 dark:bg-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Expenses</h2>
          {loading && <span className="text-sm text-gray-500 dark:text-slate-400">Loading...</span>}
        </div>
        <ExpenseList expenses={expenses} refresh={fetchExpenses} />
      </div>
      </div>
    </div>
  );
}
