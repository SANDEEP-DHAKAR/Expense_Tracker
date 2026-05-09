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
          <div className="glass-heavy rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 animate-slide-up">
            {error}
          </div>
        ) : null}

        {loading ? (
          <PanelSkeleton rows={8} />
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
            <section className="card-glass rounded-2xl border border-glass-medium animate-slide-up">
              <div className="border-b border-glass-medium px-6 py-5">
                <h2 className="text-lg font-bold text-gradient">All users</h2>
                <p className="text-sm text-slate-400 mt-1">{filteredUsers.length} matching users</p>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full glass-heavy flex items-center justify-center">
                      <UserRound size={24} className="text-slate-500" />
                    </div>
                    <span>No users found.</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="glass-light border-b border-glass-medium">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">User</th>
                        <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">Role</th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-300 uppercase tracking-wider text-xs">Expenses</th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-300 uppercase tracking-wider text-xs">Total spent</th>
                        <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">Joined</th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-300 uppercase tracking-wider text-xs">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-medium">
                      {filteredUsers.map((user, index) => (
                        <tr 
                          key={user.id} 
                          className="transition-all duration-200 hover:bg-glass-light hover:border-l-2 hover:border-l-gold-400"
                          style={{ animationDelay: `${100 + index * 50}ms` }}
                        >
                          <td className="max-w-[300px] px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                  {(user.name || "U").charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="truncate font-semibold text-white">{user.name}</p>
                                <p className="mt-1 truncate text-xs text-slate-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-lg bg-glass-light px-2 py-1 text-xs font-medium text-slate-300">
                              {user.role || "user"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-slate-300">{user.expensesCount}</td>
                          <td className="px-6 py-4 text-right font-bold text-gold-400">
                            {formatCurrency(user.totalSpent)}
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">{formatDate(user.created_at)}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => openUser(user.id)}
                              className="btn-primary inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs font-semibold text-white transition-all duration-300 hover:scale-[1.05]"
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

            <aside className="card-glass h-fit rounded-2xl border border-glass-medium p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
              {!selectedUser ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl glass-heavy">
                    <UserRound size={28} className="text-slate-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">No user selected</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Select a user to review details.
                  </p>
                </div>
              ) : null}

              {selectedUser && detailLoading ? <PanelSkeleton rows={6} /> : null}

              {selectedUserDetails && !detailLoading ? (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-gradient">
                      {selectedUserDetails.user?.name}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">{selectedUserDetails.user?.email}</p>
                    <div className="mt-2 inline-flex items-center rounded-lg bg-glass-light px-3 py-1">
                      <span className="text-xs font-medium text-gold-400">
                        Role: {selectedUserDetails.user?.role || "user"}
                      </span>
                    </div>
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
      <h3 className="mb-3 text-sm font-bold text-gold-400 uppercase tracking-wider">{title}</h3>
      {items.length === 0 ? (
        <div className="glass-light rounded-lg px-4 py-3 text-sm text-slate-400 text-center">
          {empty}
        </div>
      ) : (
        <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
          {items.map((item) => (
            <li key={item.key} className="glass-light rounded-lg px-4 py-3 text-slate-300 transition-all duration-200 hover:bg-glass-medium hover:border-l-2 hover:border-l-gold-400">
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
