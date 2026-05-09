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
    { 
      label: "Total users", 
      value: data?.totalUsers || 0, 
      icon: Users, 
      gradient: "from-blue-500/20 to-blue-600/20",
      iconBg: "from-blue-500 to-blue-600",
      accent: "text-blue-400"
    },
    { 
      label: "Total expenses", 
      value: formatCurrency(data?.totalExpenses), 
      icon: ReceiptText,
      gradient: "from-green-500/20 to-green-600/20", 
      iconBg: "from-green-500 to-green-600",
      accent: "text-green-400"
    },
    { 
      label: "Categories", 
      value: data?.totalCategories || 0, 
      icon: FolderKanban,
      gradient: "from-purple-500/20 to-purple-600/20",
      iconBg: "from-purple-500 to-purple-600", 
      accent: "text-purple-400"
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
              {Array.from({ length: 3 }).map((_, index) => (
                <PanelSkeleton key={index} rows={2} />
              ))}
            </div>
            <PanelSkeleton rows={7} />
          </>
        ) : data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className={`card-glass rounded-2xl border border-glass-medium p-6 relative overflow-hidden animate-slide-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`} />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{card.label}</p>
                          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                            {card.value}
                          </p>
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.iconBg} text-white shadow-lg`}>
                          <Icon size={20} />
                        </div>
                      </div>
                      <div className={`mt-4 flex items-center gap-2 text-xs font-medium ${card.accent}`}>
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <section className="card-glass rounded-2xl border border-glass-medium animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="border-b border-glass-medium px-6 py-5">
                <h2 className="text-lg font-bold text-gradient">
                  Recent platform expenses
                </h2>
                <p className="text-sm text-slate-400 mt-1">Latest cross-user transactions</p>
              </div>

              {(data.recentExpenses || []).length === 0 ? (
                <div className="px-6 py-16 text-center text-sm text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full glass-heavy flex items-center justify-center">
                      <ReceiptText size={24} className="text-slate-500" />
                    </div>
                    <span>No recent expenses found.</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="glass-light border-b border-glass-medium">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">User</th>
                        <th className="px-6 py-4 text-right font-semibold text-slate-300 uppercase tracking-wider text-xs">Amount</th>
                        <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">Note</th>
                        <th className="px-6 py-4 font-semibold text-slate-300 uppercase tracking-wider text-xs">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-glass-medium">
                      {(data.recentExpenses || []).map((item, index) => (
                        <tr 
                          key={item.id} 
                          className="transition-all duration-200 hover:bg-glass-light hover:border-l-2 hover:border-l-gold-400"
                          style={{ animationDelay: `${400 + index * 50}ms` }}
                        >
                          <td className="px-6 py-4 font-medium text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {(item.user_name || "U").charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span>{item.user_name || "Unknown user"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gold-400">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="max-w-[300px] px-6 py-4 text-slate-400">
                            <span className="block truncate">{item.note || "-"}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">
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
