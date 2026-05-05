import { useDashboard } from "../../context/DashboardContext";

export default function CategoryBreakdown() {
  const { summary } = useDashboard();

  const data = summary?.category_breakdown || [];

  if (!data.length) {
    return (
      <div className="card p-4 text-gray-500">
        No category data yet
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h2 className="font-semibold mb-3">
        📊 Category Breakdown
      </h2>

      <div className="space-y-3">
        {data.map((item) => {
          const amount = Number(item.total || 0); // 🔥 FIX

          return (
            <div
              key={item.name}
              className="flex justify-between border-b pb-2"
            >
              <span>{item.name}</span>

              {/* safe + formatted */}
              <span className="font-medium">
                ₹{amount.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}