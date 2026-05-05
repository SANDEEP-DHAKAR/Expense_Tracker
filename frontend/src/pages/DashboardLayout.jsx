import Header from "../components/dashboard/Header";
import StatsCards from "../components/dashboard/StatsCards";
import BudgetSection from "../components/dashboard/BudgetSection";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import AddExpenseQuick from "../components/dashboard/AddExpenseQuick";
import ChartsSection from "../components/dashboard/ChartsSection";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";

import Sidebar from "../components/Sidebar";
import MobileNavbar from "../components/MobileNavbar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 p-4 sm:p-6 bg-gray-100 dark:bg-slate-950 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto space-y-6">

          <MobileNavbar />

          {/* Header */}
          <Header />

          {/* Stats */}
          <StatsCards />

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT SIDE (big area) */}
            <div className="lg:col-span-2 space-y-6">
              <ChartsSection />
              <RecentTransactions />
            </div>

            {/* RIGHT SIDE (sidebar widgets) */}
            <div className="space-y-6">
              <BudgetSection />
              <CategoryBreakdown />
              <AddExpenseQuick />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}