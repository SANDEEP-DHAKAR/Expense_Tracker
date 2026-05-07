import MobileNavbar from "./MobileNavbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />

      <main className="min-h-screen min-w-0 xl:pl-72">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <MobileNavbar />
          {children}
        </div>
      </main>
    </div>
  );
}
