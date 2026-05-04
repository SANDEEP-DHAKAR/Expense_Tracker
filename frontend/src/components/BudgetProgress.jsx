import { useState } from "react";
import { setBudget } from "../api/budgets";

export default function BudgetProgress({ spent = 0, budget = 10000, onUpdate }) {
  const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!newBudget || newBudget <= 0) return;
    try {
      setLoading(true);
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      await setBudget({ monthly_limit: Number(newBudget), month: currentMonth });
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to update budget:", err);
      alert(err.response?.data?.message || "Failed to update budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-3xl shadow-lg ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-slate-900 dark:text-slate-100">💰 Budget Usage</h2>
        {!isEditing ? (
          <button 
            onClick={() => { setIsEditing(true); setNewBudget(budget); }}
            className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300"
          >
            Edit Budget
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-lg hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mb-3">
          <input 
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-xl px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter monthly budget limit"
          />
        </div>
      ) : null}

      <div className="w-full bg-slate-200/70 rounded-full h-4 dark:bg-slate-700">
        <div
          className={`h-4 rounded-full ${percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-orange-500' : 'bg-gradient-to-r from-indigo-600 to-cyan-500'}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
        ₹{spent} / ₹{budget} ({Math.round(percent)}%)
      </p>
    </div>
  );
}