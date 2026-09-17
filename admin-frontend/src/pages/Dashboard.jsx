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
        setData(res?.data?.data || res?.data || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const expenses = data?.recentExpenses ?? [];

  const cards = [
    {
      label: "Total Users",
      value: data?.totalUsers || 0,
      icon: Users,
      gradient: "from-cyan-500/15 via-blue-500/10 to-transparent",
      iconBg: "from-cyan-500 to-blue-600",
      accent: "text-cyan-400",
      border: "border-cyan-500/20 hover:border-cyan-500/40",
      badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(data?.totalExpenses || 0),
      icon: ReceiptText,
      gradient: "from-emerald-500/15 via-teal-500/10 to-transparent",
      iconBg: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    },
    {
      label: "Categories",
      value: data?.totalCategories || 0,
      icon: FolderKanban,
      gradient: "from-violet-500/15 via-purple-500/10 to-transparent",
      iconBg: "from-violet-500 to-purple-600",
      accent: "text-violet-400",
      border: "border-violet-500/20 hover:border-violet-500/40",
      badgeBg: "bg-violet-500/10 border-violet-500/30 text-violet-300",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Overview"
          title="Admin Dashboard"
          description="Platform health, user activity, and cross-user transaction volume."
        />

        {error ? (
          <div className="glass-heavy rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-300 animate-slide-up">
            {error}
          </div>
        ) : null}

        {loading ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PanelSkeleton key={i} rows={2} />
              ))}
            </div>
            <PanelSkeleton rows={7} />
          </>
        ) : data ? (
          <>
            {/* CARDS */}
            <div className="grid gap-5 sm:grid-cols-3">
              {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className={`card-glass relative overflow-hidden rounded-[28px] border p-6 transition-all duration-300 animate-slide-up ${card.border}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* ACCENT GRADIENT BG */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient}`}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {card.label}
                          </p>
                          <p className="mt-2.5 text-2xl font-black text-white sm:text-3xl tracking-tight">
                            {card.value}
                          </p>
                        </div>

                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.iconBg} text-white shadow-lg`}
                        >
                          <Icon size={22} />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${card.badgeBg}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                          Platform Active
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RECENT EXPENSES TABLE */}
            <section className="card-glass rounded-[28px] border border-white/[0.08] animate-slide-up overflow-hidden">
              <div className="border-b border-white/[0.06] bg-slate-900/40 px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white sm:text-lg">
                    Recent Platform Expenses
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Latest cross-user transactions recorded in system
                  </p>
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {expenses.length} Records
                </span>
              </div>

              {expenses.length === 0 ? (
                <div className="px-6 py-16 text-center text-xs sm:text-sm text-slate-400">
                  No recent expenses found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="border-b border-white/[0.06] bg-slate-900/60">
                      <tr>
                        <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          User
                        </th>
                        <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">
                          Amount
                        </th>
                        <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Note
                        </th>
                        <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Created Date
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.04]">
                      {expenses.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-emerald-500/[0.03] transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-white">
                            {item.user_name || "Unknown user"}
                          </td>

                          <td className="px-6 py-4 text-right font-black text-emerald-400 tracking-tight">
                            {formatCurrency(item.amount || 0)}
                          </td>

                          <td className="px-6 py-4 text-xs font-medium text-slate-300">
                            {item.note || "-"}
                          </td>

                          <td className="px-6 py-4 text-xs font-medium text-slate-400">
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