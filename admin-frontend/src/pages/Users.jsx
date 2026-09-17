import { useEffect, useMemo, useState } from "react";
import { Search, UserRound, Shield } from "lucide-react";
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
      setSelectedUserDetails(null);
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
      <div className="space-y-6">
        <PageHeader
          eyebrow="Customers"
          title="User Accounts"
          description="Inspect user accounts, categories, monthly budgets, and historical spend."
          actions={
            <label className="relative w-full lg:w-96">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                className={`h-10 w-full pl-9 pr-3.5 ${controlClass}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          }
        />

        {error ? (
          <div className="glass-heavy rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-300 animate-slide-up">
            {error}
          </div>
        ) : null}

        {loading ? (
          <PanelSkeleton rows={8} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
            {/* USERS TABLE */}
            <section className="card-glass rounded-[28px] border border-white/[0.08] animate-slide-up overflow-hidden">
              <div className="border-b border-white/[0.06] bg-slate-900/40 px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white sm:text-lg">
                    All Platform Users
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {filteredUsers.length} matching accounts
                  </p>
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {filteredUsers.length} Total
                </span>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="px-6 py-16 text-center text-xs sm:text-sm text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl glass-heavy flex items-center justify-center">
                      <UserRound size={24} className="text-slate-500" />
                    </div>
                    <span>No users found matching query.</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="border-b border-white/[0.06] bg-slate-900/60">
                      <tr>
                        <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">User</th>
                        <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Role</th>
                        <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Expenses</th>
                        <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Spent</th>
                        <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Joined</th>
                        <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-emerald-500/[0.03] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 font-bold text-white shadow-md shadow-emerald-500/20">
                                {(user?.name || "U").charAt(0).toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold text-white truncate">
                                  {user?.name || "Unknown user"}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                  {user?.email || "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {user?.role === "admin" ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                                <Shield size={10} />
                                admin
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full border border-slate-700/60 bg-slate-800/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                                {user?.role || "user"}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right font-medium text-slate-300">
                            {user?.expensesCount || 0}
                          </td>

                          <td className="px-6 py-4 text-right font-black text-emerald-400 tracking-tight">
                            {formatCurrency(user?.totalSpent || 0)}
                          </td>

                          <td className="px-6 py-4 text-xs font-medium text-slate-400">
                            {formatDate(user?.created_at)}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openUser(user.id)}
                              className="btn-primary h-8 rounded-xl px-3.5 text-xs font-semibold text-white shadow-sm"
                            >
                              Inspect
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
            <aside className="card-glass h-fit rounded-[28px] border border-white/[0.08] p-6 animate-slide-up">
              {!selectedUser ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center py-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl glass-heavy border border-white/[0.06]">
                    <UserRound size={26} className="text-slate-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-200">
                    No User Selected
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                    Select any user account on the left to inspect detailed activity.
                  </p>
                </div>
              ) : null}

              {detailLoading ? <PanelSkeleton rows={6} /> : null}

              {selectedUserDetails && !detailLoading ? (
                <div className="space-y-5">
                  <div className="border-b border-white/[0.06] pb-4">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                      User Profile
                    </span>
                    <h2 className="text-lg font-bold text-white">
                      {selectedUserDetails?.user?.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedUserDetails?.user?.email}
                    </p>
                  </div>

                  <DetailList
                    title="Categories"
                    empty="No categories found"
                    items={(selectedUserDetails?.categories || []).map((c) => ({
                      key: c.id,
                      label: c.name,
                    }))}
                  />

                  <DetailList
                    title="Budgets"
                    empty="No budgets set"
                    items={(selectedUserDetails?.budgets || []).map((b) => ({
                      key: b.month,
                      label: `${b.month}: ${formatCurrency(b.monthly_limit || 0)}`,
                    }))}
                  />

                  <DetailList
                    title="Recent Expenses"
                    empty="No recent expenses"
                    items={(selectedUserDetails?.recentExpenses || []).slice(0, 8).map((e) => ({
                      key: e.id,
                      label: `${formatCurrency(e.amount || 0)} - ${e.category_name || "Uncategorized"} - ${formatDate(e.expense_date)}`,
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
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
        {title}
      </h3>

      {items.length === 0 ? (
        <div className="glass-light rounded-xl px-4 py-3 text-xs text-slate-400 text-center border border-white/[0.04]">
          {empty}
        </div>
      ) : (
        <ul className="max-h-48 space-y-1.5 overflow-y-auto text-xs">
          {items.map((item) => (
            <li
              key={item.key}
              className="glass-light rounded-xl px-3.5 py-2.5 text-slate-300 hover:bg-white/[0.04] transition border border-white/[0.04]"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}