import { useDashboard } from "../../context/DashboardContext";

export default function CategoryBreakdown() {
  const { summary } = useDashboard();

  const data = summary?.category_breakdown || [];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        Category Breakdown
      </h3>

      {data.length === 0 ? (
        <p className="text-gray-500">No category data yet</p>
      ) : (
        <ul>
          {data.map((item) => {
            const amount = Number(item.total || 0); // 🔥 FIX

            return (
              <li
                key={item.name}
                className="py-2 border-b flex justify-between"
              >
                <span>{item.name}</span>

                {/* ✅ SAFE */}
                <span>₹{amount.toFixed(2)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}