import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
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
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <PanelSkeleton rows={8} />
        ) : (
          <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-950">All user expenses</h2>
              <p className="text-sm text-slate-500">{filteredExpenses.length} matching expenses</p>
            </div>

            {filteredExpenses.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-slate-500">
                No expenses found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">User</th>
                      <th className="px-5 py-3 font-medium">Category</th>
                      <th className="px-5 py-3 text-right font-medium">Amount</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                      <th className="px-5 py-3 font-medium">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredExpenses.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50">
                        <td className="max-w-[260px] px-5 py-4">
                          <p className="truncate font-medium text-slate-900">
                            {item.user_name || "Unknown user"}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {item.user_email || "-"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {item.category_name || "-"}
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-slate-950">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {formatDate(item.expense_date)}
                        </td>
                        <td className="max-w-[280px] px-5 py-4 text-slate-500">
                          <span className="block truncate">{item.note || "-"}</span>
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
