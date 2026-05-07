import { useEffect, useState } from "react";
import { FolderKanban, ReceiptText, Users } from "lucide-react";
import Layout from "../components/Layout";
import { PanelSkeleton } from "../components/ui/Skeleton";
import { PageHeader } from "../components/ui/Primitives";
import { getAdminDashboard } from "../api/admin";
import { formatCurrency, formatDate } from "../utils/format";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
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

  const cards = [
    { label: "Total users", value: data?.totalUsers || 0, icon: Users },
    { label: "Total expenses", value: formatCurrency(data?.totalExpenses), icon: ReceiptText },
    { label: "Categories", value: data?.totalCategories || 0, icon: FolderKanban },
  ];

  return (
    <Layout>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Overview"
          title="Admin dashboard"
          description="Platform health, user activity, and recent expense volume."
        />

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <PanelSkeleton key={index} rows={2} />
              ))}
            </div>
            <PanelSkeleton rows={7} />
          </>
        ) : data ? (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              {cards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{card.label}</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                          {card.value}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                        <Icon size={18} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-950">
                  Recent platform expenses
                </h2>
                <p className="text-sm text-slate-500">Latest cross-user transactions</p>
              </div>

              {(data.recentExpenses || []).length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-slate-500">
                  No recent expenses found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3 font-medium">User</th>
                        <th className="px-5 py-3 text-right font-medium">Amount</th>
                        <th className="px-5 py-3 font-medium">Note</th>
                        <th className="px-5 py-3 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(data.recentExpenses || []).map((item) => (
                        <tr key={item.id} className="transition hover:bg-slate-50">
                          <td className="px-5 py-4 font-medium text-slate-900">
                            {item.user_name || "Unknown user"}
                          </td>
                          <td className="px-5 py-4 text-right font-semibold text-slate-950">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="max-w-[260px] px-5 py-4 text-slate-500">
                            <span className="block truncate">{item.note || "-"}</span>
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {formatDate(item.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </Layout>
  );
}
