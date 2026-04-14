export default function DashboardStats({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const count = expenses.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      <div className="p-4 bg-blue-500 text-white rounded-xl shadow">
        <h3>Total Expenses</h3>
        <p className="text-xl font-bold">₹{total}</p>
      </div>

      <div className="p-4 bg-green-500 text-white rounded-xl shadow">
        <h3>Total Entries</h3>
        <p className="text-xl font-bold">{count}</p>
      </div>

      <div className="p-4 bg-purple-500 text-white rounded-xl shadow">
        <h3>Avg Expense</h3>
        <p className="text-xl font-bold">
          ₹{count ? Math.round(total / count) : 0}
        </p>
      </div>
    </div>
  );
}