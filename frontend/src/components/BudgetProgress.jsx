export default function BudgetProgress({ expenses, budget = 10000 }) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const percent = Math.min((total / budget) * 100, 100);

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow">
      <h2 className="font-bold mb-2">💰 Budget Usage</h2>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-red-500 h-4 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <p className="mt-2 text-sm">
        ₹{total} / ₹{budget} ({Math.round(percent)}%)
      </p>
    </div>
  );
}