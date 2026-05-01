import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getAdminDashboard } from "../api/admin";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await getAdminDashboard();
        setData(res.data.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading ? <p>Loading dashboard...</p> : null}
      {error ? <p className="text-rose-600 mb-4">{error}</p> : null}

      {data && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-gray-500">Total Users</h2>
              <p className="text-2xl font-bold">{data.totalUsers}</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-gray-500">Total Expenses</h2>
              <p className="text-2xl font-bold">₹ {data.totalExpenses}</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-gray-500">Categories</h2>
              <p className="text-2xl font-bold">{data.totalCategories}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
            <div className="px-4 py-3 border-b border-slate-100 font-semibold">Recent Platform Expenses</div>
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Note</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {(data.recentExpenses || []).map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{item.user_name}</td>
                    <td className="px-3 py-2">₹{item.amount}</td>
                    <td className="px-3 py-2">{item.note || "-"}</td>
                    <td className="px-3 py-2">{String(item.created_at).slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
}