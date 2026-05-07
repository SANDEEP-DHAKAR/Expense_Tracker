import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen text-slate-950">
      <Sidebar />

      <div className="min-h-screen min-w-0 xl:pl-72">
        <Navbar />
        <main className="mx-auto w-full max-w-screen-2xl px-4 py-5 sm:px-6 lg:px-8 2xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
