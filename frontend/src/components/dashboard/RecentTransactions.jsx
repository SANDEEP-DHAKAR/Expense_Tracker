import { useDashboard } from "../../context/DashboardContext";

export default function RecentTransactions() {
  const { summary } = useDashboard();

  const data = summary?.recent_transactions || [];

  if (!data.length) {
    return (
      <div className="card p-4 text-center text-gray-500">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h2 className="font-semibold mb-3">
        🕒 Recent Transactions
      </h2>

      <div className="space-y-3">
        {data.slice(0, 5).map((txn) => {
          const amount = Number(txn.amount || 0); // 🔥 FIX

          return (
            <div
              key={txn.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {txn.note || "No note"}
                </p>

                <p className="text-xs text-gray-500">
                  {txn.category || "No category"}
                </p>
              </div>

              {/* ✅ SAFE + formatted */}
              <p className="text-red-500 font-semibold">
                ₹{amount.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}