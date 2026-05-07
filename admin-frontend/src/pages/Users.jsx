import { useEffect, useMemo, useState } from "react";
import { Search, UserRound } from "lucide-react";
import Layout from "../components/Layout";
import { PanelSkeleton } from "../components/ui/Skeleton";
import { PageHeader, controlClass } from "../components/ui/Primitives";
import { getAdminUserDetails, getAdminUsers } from "../api/admin";
import { formatCurrency, formatDate } from "../utils/format";

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
        setError("");
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
      setError("");
      const res = await getAdminUserDetails(userId);
      setSelectedUserDetails(res?.data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to fetch user details");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((user) => (
      user?.name?.toLowerCase().includes(q) ||
      user?.email?.toLowerCase().includes(q) ||
      String(user?.id).includes(q)
    ));
  }, [users, search]);

  return (
    <Layout>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Customers"
          title="Users"
          description="Inspect accounts, categories, budgets, and recent spend."
          actions={
            <label className="relative w-full lg:w-96">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, email, or ID"
                className={`h-10 w-full pl-9 pr-3 ${controlClass}`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          }
        />

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <PanelSkeleton rows={8} />
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
            <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-950">All users</h2>
                <p className="text-sm text-slate-500">{filteredUsers.length} matching users</p>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-slate-500">
                  No users found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3 font-medium">User</th>
                        <th className="px-5 py-3 font-medium">Role</th>
                        <th className="px-5 py-3 text-right font-medium">Expenses</th>
                        <th className="px-5 py-3 text-right font-medium">Total spent</th>
                        <th className="px-5 py-3 font-medium">Joined</th>
                        <th className="px-5 py-3 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="transition hover:bg-slate-50">
                          <td className="max-w-[260px] px-5 py-4">
                            <p className="truncate font-medium text-slate-900">{user.name}</p>
                            <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
                          </td>
                          <td className="px-5 py-4 text-slate-500">{user.role || "user"}</td>
                          <td className="px-5 py-4 text-right text-slate-700">{user.expensesCount}</td>
                          <td className="px-5 py-4 text-right font-semibold text-slate-950">
                            {formatCurrency(user.totalSpent)}
                          </td>
                          <td className="px-5 py-4 text-slate-500">{formatDate(user.created_at)}</td>
                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => openUser(user.id)}
                              className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <aside className="h-fit rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur">
              {!selectedUser ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <UserRound size={19} />
                  </div>
                  <p className="text-sm font-medium text-slate-800">No user selected</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Select a user to review details.
                  </p>
                </div>
              ) : null}

              {selectedUser && detailLoading ? <PanelSkeleton rows={6} /> : null}

              {selectedUserDetails && !detailLoading ? (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      {selectedUserDetails.user?.name}
                    </h2>
                    <p className="text-sm text-slate-500">{selectedUserDetails.user?.email}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Role: {selectedUserDetails.user?.role || "user"}
                    </p>
                  </div>

                  <DetailList
                    title="Categories"
                    empty="No categories"
                    items={(selectedUserDetails.categories || []).map((category) => ({
                      key: category.id,
                      label: category.name,
                    }))}
                  />

                  <DetailList
                    title="Budgets"
                    empty="No budgets"
                    items={(selectedUserDetails.budgets || []).map((budget) => ({
                      key: budget.month,
                      label: `${budget.month}: ${formatCurrency(budget.monthly_limit)}`,
                    }))}
                  />

                  <DetailList
                    title="Recent expenses"
                    empty="No recent expenses"
                    items={(selectedUserDetails.recentExpenses || []).slice(0, 8).map((expense) => ({
                      key: expense.id,
                      label: `${formatCurrency(expense.amount)} - ${expense.category_name || "No category"} - ${formatDate(expense.expense_date)}`,
                    }))}
                  />
                </div>
              ) : null}
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}

function DetailList({ title, empty, items }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">{empty}</p>
      ) : (
        <ul className="max-h-40 space-y-1 overflow-y-auto text-sm">
          {items.map((item) => (
            <li key={item.key} className="rounded-lg bg-slate-50 px-3 py-2 text-slate-700">
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
