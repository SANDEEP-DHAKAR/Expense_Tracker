import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AdminAuthContextValue";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, adminUser } = useContext(AdminAuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <div>
        <h2 className="font-semibold text-lg">Admin Panel</h2>
        <p className="text-xs text-slate-500">{adminUser?.user?.email || ""}</p>
      </div>

      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1 rounded">
        Logout
      </button>
    </div>
  );
}