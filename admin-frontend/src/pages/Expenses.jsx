import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getAdminExpenses } from "../api/admin";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await getAdminExpenses();
        setExpenses(res?.data?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">All User Expenses</h1>

      {loading ? <p>Loading expenses...</p> : null}
      {error ? <p className="text-rose-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{item.user_name}</td>
                  <td className="px-3 py-2">{item.user_email}</td>
                  <td className="px-3 py-2">{item.category_name || "-"}</td>
                  <td className="px-3 py-2">₹{item.amount}</td>
                  <td className="px-3 py-2">{String(item.expense_date).slice(0, 10)}</td>
                  <td className="px-3 py-2">{item.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Layout>
  );
}
