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
      setSelectedUserDetails(null); // FIX: avoid stale UI
      setError("");

      const res = await getAdminUserDetails(userId);
      setSelectedUserDetails(res?.data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to fetch user details");
    } finally {
      setDetailLoading(false);
    }
  };

  // FIX: fully safe filtering (no crash on undefined)
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return users.filter((user) => {
      const name = (user?.name || "").toLowerCase();
      const email = (user?.email || "").toLowerCase();
      const id = String(user?.id || "");

      return (
        name.includes(q) ||
        email.includes(q) ||
        id.includes(q)
      );
    });
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
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name, email, or ID"
                className={`h-10 w-full pl-9 pr-3 ${controlClass}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            
            {/* USERS TABLE */}
            <section className="card-glass rounded-2xl border border-glass-medium animate-slide-up">
              <div className="border-b border-glass-medium px-6 py-5">
                <h2 className="text-lg font-bold text-gradient">All users</h2>
                <p className="text-sm text-slate-400 mt-1">
                  {filteredUsers.length} matching users
                </p>
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
                        <th className="px-6 py-4 text-xs text-slate-300">User</th>
                        <th className="px-6 py-4 text-xs text-slate-300">Role</th>
                        <th className="px-6 py-4 text-right text-xs text-slate-300">Expenses</th>
                        <th className="px-6 py-4 text-right text-xs text-slate-300">Total spent</th>
                        <th className="px-6 py-4 text-xs text-slate-300">Joined</th>
                        <th className="px-6 py-4 text-right text-xs text-slate-300">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-glass-medium">
                      {filteredUsers.map((user, index) => (
                        <tr
                          key={user.id}
                          className="hover:bg-glass-light transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">
                                  {(user?.name || "U").charAt(0).toUpperCase()}
                                </span>
                              </div>

                              <div>
                                <p className="font-semibold text-white">
                                  {user?.name || "Unknown user"}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {user?.email || "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-lg bg-glass-light px-2 py-1 text-xs text-slate-300">
                              {user?.role || "user"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right text-slate-300">
                            {user?.expensesCount || 0}
                          </td>

                          <td className="px-6 py-4 text-right font-bold text-gold-400">
                            {formatCurrency(user?.totalSpent || 0)}
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-400">
                            {formatDate(user?.created_at)}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openUser(user.id)}
                              className="btn-primary h-8 rounded-lg px-3 text-xs font-semibold"
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

            {/* DETAIL PANEL */}
            <aside className="card-glass h-fit rounded-2xl border border-glass-medium p-6 animate-slide-up">
              
              {!selectedUser ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl glass-heavy">
                    <UserRound size={28} className="text-slate-500" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">
                    No user selected
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Select a user to review details.
                  </p>
                </div>
              ) : null}

              {detailLoading ? <PanelSkeleton rows={6} /> : null}

              {selectedUserDetails && !detailLoading ? (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-gradient">
                      {selectedUserDetails?.user?.name}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {selectedUserDetails?.user?.email}
                    </p>
                  </div>

                  <DetailList
                    title="Categories"
                    empty="No categories"
                    items={(selectedUserDetails?.categories || []).map((c) => ({
                      key: c.id,
                      label: c.name,
                    }))}
                  />

                  <DetailList
                    title="Budgets"
                    empty="No budgets"
                    items={(selectedUserDetails?.budgets || []).map((b) => ({
                      key: b.month,
                      label: `${b.month}: ${formatCurrency(b.monthly_limit || 0)}`,
                    }))}
                  />

                  <DetailList
                    title="Recent expenses"
                    empty="No recent expenses"
                    items={(selectedUserDetails?.recentExpenses || []).slice(0, 8).map((e) => ({
                      key: e.id,
                      label: `${formatCurrency(e.amount || 0)} - ${e.category_name || "No category"} - ${formatDate(e.expense_date)}`,
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

/* SAFE COMPONENT */
function DetailList({ title, empty, items = [] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-gold-400 uppercase tracking-wider">
        {title}
      </h3>

      {items.length === 0 ? (
        <div className="glass-light rounded-lg px-4 py-3 text-sm text-slate-400 text-center">
          {empty}
        </div>
      ) : (
        <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
          {items.map((item) => (
            <li
              key={item.key}
              className="glass-light rounded-lg px-4 py-3 text-slate-300 hover:bg-glass-medium transition"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}