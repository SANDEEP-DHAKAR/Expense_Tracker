export default function BudgetProgress({ spent = 0, budget = 10000 }) {
  const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <div className="mt-6 p-4 bg-white rounded-3xl shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <h2 className="font-bold mb-2 text-slate-900 dark:text-slate-100">💰 Budget Usage</h2>

      <div className="w-full bg-slate-200/70 rounded-full h-4 dark:bg-slate-700">
        <div
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-4 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <p className="mt-2 text-sm">
        ₹{spent} / ₹{budget} ({Math.round(percent)}%)
      </p>
    </div>
  );
}