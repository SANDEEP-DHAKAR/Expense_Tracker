import { useDashboard } from "../../context/DashboardContext";
import BudgetProgress from "../BudgetProgress";

export default function BudgetSection() {
  const { summary, fetchDashboard } = useDashboard();

  const spent = Number(summary?.budget?.spent || 0);
  const total = Number(summary?.budget?.budget || 0);

  return (
    <BudgetProgress
      spent={spent}
      budget={total}
      onUpdate={fetchDashboard}
    />
  );
}