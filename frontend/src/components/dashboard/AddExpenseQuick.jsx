import AddExpense from "../AddExpense";
import { useDashboard } from "../../context/DashboardContextValue";

export default function AddExpenseQuick() {
  const { refresh, categories } = useDashboard();

  return (
    <section id="quick-add-expense">
      <AddExpense refresh={refresh} categories={categories} compact />
    </section>
  );
}
