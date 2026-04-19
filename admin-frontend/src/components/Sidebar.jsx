import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed">
      <h1 className="text-2xl font-bold mb-8">Admin</h1>

      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <Link to="/users" className="hover:text-gray-300">Users</Link>
        <Link to="/expenses" className="hover:text-gray-300">Expenses</Link>
      </nav>
    </div>
  );
}