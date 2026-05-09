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
    const q = search.toLowerCase();
    return expenses.filter((item) => (
      item?.user_name?.toLowerCase().includes(q) ||
      item?.user_email?.toLowerCase().includes(q) ||
      item?.category_name?.toLowerCase().includes(q) ||
      item?.note?.toLowerCase().includes(q)
    ));
  }, [expenses, search]);

  return (
    <Layout>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Transactions"
          title="Platform expenses"
          description="Review the latest expenses across all users."
          actions={
            <label className="relative w-full lg:w-96">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search expenses"
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
          <section className="card-glass rounded-2xl border border-glass-medium animate-slide-up">
            <div className="border-b border-glass-medium px-6 py-5">
              <h2 className="text-lg font-bold text-gradient">All user expenses</h2>
              <p className="text-sm text-slate-400 mt-1">{filteredExpenses.length} matching expenses</p>
            </div>

            {filteredExpenses.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-slate-400">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full glass-heavy flex items-center justify-center">
                    <ReceiptText size={24} className="text-slate-500" />
                  </div>
                  <span>No expenses found.</span>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="glass-light border-b border-glass-medium">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">User</th>
                      <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">Category</th>
                      <th className="px-6 py-4 text-right font-semibold text-slate-300 uppercase tracking-wider text-xs">Amount</th>
                      <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">Date</th>
                      <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-medium">
                    {filteredExpenses.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className="transition-all duration-200 hover:bg-glass-light hover:border-l-2 hover:border-l-gold-400"
                        style={{ animationDelay: `${100 + index * 50}ms` }}
                      >
                        <td className="max-w-[300px] px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {(item.user_name || "U").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="truncate font-semibold text-white">
                                {item.user_name || "Unknown user"}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-400">
                                {item.user_email || "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-lg bg-glass-light px-3 py-1 text-xs font-medium text-slate-300">
                            {item.category_name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gold-400">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {formatDate(item.expense_date)}
                        </td>
                        <td className="max-w-[320px] px-6 py-4 text-slate-400">
                          <span className="block truncate text-sm">{item.note || "-"}</span>
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
