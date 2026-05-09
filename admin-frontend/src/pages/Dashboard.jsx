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

        // SAFE RESPONSE HANDLING
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
      label: "Total users",
      value: data?.totalUsers || 0,
      icon: Users,
      gradient: "from-blue-500/20 to-blue-600/20",
      iconBg: "from-blue-500 to-blue-600",
      accent: "text-blue-400",
    },
    {
      label: "Total expenses",
      value: formatCurrency(data?.totalExpenses || 0),
      icon: ReceiptText,
      gradient: "from-green-500/20 to-green-600/20",
      iconBg: "from-green-500 to-green-600",
      accent: "text-green-400",
    },
    {
      label: "Categories",
      value: data?.totalCategories || 0,
      icon: FolderKanban,
      gradient: "from-purple-500/20 to-purple-600/20",
      iconBg: "from-purple-500 to-purple-600",
      accent: "text-purple-400",
    },
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
          <div className="glass-heavy rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 animate-slide-up">
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
            <div className="grid gap-4 sm:grid-cols-3">
              {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="card-glass rounded-2xl border border-glass-medium p-6 relative overflow-hidden animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                            {card.label}
                          </p>
                          <p className="mt-3 text-3xl font-bold text-white">
                            {card.value}
                          </p>
                        </div>

                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.iconBg} text-white shadow-lg`}
                        >
                          <Icon size={20} />
                        </div>
                      </div>

                      <div
                        className={`mt-4 flex items-center gap-2 text-xs font-medium ${card.accent}`}
                      >
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TABLE */}
            <section className="card-glass rounded-2xl border border-glass-medium animate-slide-up mt-5">
              <div className="border-b border-glass-medium px-6 py-5">
                <h2 className="text-lg font-bold text-gradient">
                  Recent platform expenses
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Latest cross-user transactions
                </p>
              </div>

              {expenses.length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-slate-400">
                  No recent expenses found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="glass-light border-b border-glass-medium">
                      <tr>
                        <th className="px-6 py-4 text-xs text-slate-300">
                          User
                        </th>
                        <th className="px-6 py-4 text-xs text-right text-slate-300">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-xs text-slate-300">
                          Note
                        </th>
                        <th className="px-6 py-4 text-xs text-slate-300">
                          Created
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-glass-medium">
                      {expenses.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-glass-light transition"
                        >
                          <td className="px-6 py-4 text-white">
                            {item.user_name || "Unknown user"}
                          </td>

                          <td className="px-6 py-4 text-right text-gold-400 font-bold">
                            {formatCurrency(item.amount || 0)}
                          </td>

                          <td className="px-6 py-4 text-slate-400">
                            {item.note || "-"}
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-400">
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