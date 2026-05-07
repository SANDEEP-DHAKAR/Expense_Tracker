import DashboardProvider from "../context/DashboardContext";
import DashboardLayout from "./DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  );
}