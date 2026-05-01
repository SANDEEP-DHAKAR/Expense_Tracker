import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { getAdminUserDetails, getAdminUsers } from "../api/admin";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await getAdminUsers();
        setUsers(res?.data?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to fetch users");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const openUser = async (userId) => {
    try {
      setDetailLoading(true);
      setSelectedUser(userId);
      const res = await getAdminUserDetails(userId);
      setSelectedUserDetails(res?.data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to fetch user details");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user?.name?.toLowerCase().includes(q) ||
      user?.email?.toLowerCase().includes(q) ||
      String(user?.id).includes(q)
    );
  });

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Users</h1>
        <input
          type="text"
          placeholder="Search by name/email/id"
          className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? <p>Loading users...</p> : null}
      {error ? <p className="mb-3 text-rose-600">{error}</p> : null}

      {!loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Expenses</th>
                  <th className="px-3 py-2">Total Spent</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{user.id}</td>
                    <td className="px-3 py-2">{user.name}</td>
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.role || "user"}</td>
                    <td className="px-3 py-2">{user.expensesCount}</td>
                    <td className="px-3 py-2">₹{Number(user.totalSpent || 0).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => openUser(user.id)}
                        className="rounded-md bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {!selectedUser ? <p className="text-sm text-slate-500">Select a user to view complete information.</p> : null}

            {selectedUser && detailLoading ? <p className="text-sm">Loading user details...</p> : null}

            {selectedUserDetails && !detailLoading ? (
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-lg">{selectedUserDetails.user?.name}</h2>
                  <p className="text-sm text-slate-500">{selectedUserDetails.user?.email}</p>
                  <p className="text-xs text-slate-400 mt-1">Role: {selectedUserDetails.user?.role || "user"}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Categories</h3>
                  <ul className="space-y-1 text-sm max-h-32 overflow-y-auto">
                    {(selectedUserDetails.categories || []).map((category) => (
                      <li key={category.id} className="rounded-md bg-slate-50 px-2 py-1">
                        {category.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Budgets (Last 12 Months)</h3>
                  <ul className="space-y-1 text-sm max-h-32 overflow-y-auto">
                    {(selectedUserDetails.budgets || []).map((budget) => (
                      <li key={budget.month} className="rounded-md bg-slate-50 px-2 py-1">
                        {budget.month}: ₹{budget.monthly_limit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Recent Expenses</h3>
                  <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
                    {(selectedUserDetails.recentExpenses || []).map((expense) => (
                      <li key={expense.id} className="rounded-md bg-slate-50 px-2 py-1">
                        ₹{expense.amount} | {expense.category_name || "No category"} | {String(expense.expense_date).slice(0, 10)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Layout>
  );
}