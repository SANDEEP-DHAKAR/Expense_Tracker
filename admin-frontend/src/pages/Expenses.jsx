import { useEffect, useMemo, useState } from "react";
import { Search, ReceiptText } from "lucide-react";
import Layout from "../components/Layout";
import { PanelSkeleton } from "../components/ui/Skeleton";
import { PageHeader, controlClass } from "../components/ui/Primitives";
import { getAdminExpenses } from "../api/admin";
import { formatCurrency, formatDate } from "../utils/format";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

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

  const filteredExpenses = useMemo(() => {
    const q = search.toLowerCase().trim();

    return expenses.filter((item) => {
      const name = (item?.user_name || "").toLowerCase();
      const email = (item?.user_email || "").toLowerCase();
      const category = (item?.category_name || "").toLowerCase();
      const note = (item?.note || "").toLowerCase();

      return (
        name.includes(q) ||
        email.includes(q) ||
        category.includes(q) ||
        note.includes(q)
      );
    });
  }, [expenses, search]);

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Transactions"
          title="Platform Expenses"
          description="Review cross-user expense activity, categories, and financial logs."
          actions={
            <label className="relative w-full lg:w-96">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by user, category, or note..."
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
          <section className="card-glass rounded-[28px] border border-white/[0.08] animate-slide-up overflow-hidden">
            <div className="border-b border-white/[0.06] bg-slate-900/40 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white sm:text-lg">
                  All User Expenses
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {filteredExpenses.length} matching transactions
                </p>
              </div>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                {filteredExpenses.length} Total
              </span>
            </div>

            {filteredExpenses.length === 0 ? (
              <div className="px-6 py-16 text-center text-xs sm:text-sm text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl glass-heavy flex items-center justify-center">
                    <ReceiptText size={24} className="text-slate-500" />
                  </div>
                  <span>No expenses found matching query.</span>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="border-b border-white/[0.06] bg-slate-900/60">
                    <tr>
                      <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        User
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Category
                      </th>
                      <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Amount
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Date
                      </th>
                      <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Note
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredExpenses.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-emerald-500/[0.03] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 font-bold text-white shadow-md shadow-emerald-500/20">
                              {(item?.user_name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate">
                                {item?.user_name || "Unknown user"}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {item?.user_email || "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {item?.category_name || "Uncategorized"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right font-black text-emerald-400 tracking-tight">
                          {formatCurrency(item?.amount || 0)}
                        </td>

                        <td className="px-6 py-4 text-xs font-medium text-slate-400">
                          {formatDate(item?.expense_date)}
                        </td>

                        <td className="px-6 py-4 text-xs font-medium text-slate-300">
                          {item?.note || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </Layout>
  );
}