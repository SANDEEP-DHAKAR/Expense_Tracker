import { useDashboard } from "../../context/DashboardContext";

export default function ChartsSection() {
  const { expenses } = useDashboard();

  const categoryData = expenses.reduce((acc, exp) => {
    const cat = exp.category || "Uncategorized";

    acc[cat] = (acc[cat] || 0) + Number(exp.amount || 0);
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow dark:bg-slate-800">
      <h3 className="text-lg font-semibold mb-4">
        📊 Expenses by Category
      </h3>

      {chartData.length === 0 ? (
        <p className="text-gray-500">No expenses to display</p>
      ) : (
        <ul>
          {chartData.map((item) => (
            <li
              key={item.category}
              className="py-2 border-b flex justify-between"
            >
              <span>{item.category}</span>
              <span className="font-medium">
                ₹{Number(item.amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}