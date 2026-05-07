import { useDashboard } from "../../context/DashboardContextValue";
import BudgetProgress from "../BudgetProgress";

export default function BudgetSection() {
  const { summary, refresh } = useDashboard();

  const spent = Number(summary?.budget?.spent || 0);
  const total = Number(summary?.budget?.budget || summary?.budget?.monthly_limit || 0);

  return <BudgetProgress spent={spent} budget={total} onUpdate={refresh} />;
}
