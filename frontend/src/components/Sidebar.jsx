import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed">

            <h1 className="text-2xl font-bold mb-8">💰 Expense</h1>

            <ul className="space-y-4">
                <li
                    onClick={() => navigate("/")}
                    className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                >
                    📊 Dashboard
                </li>

                <li
                    onClick={() => navigate("/")}
                    className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                >
                    ➕ Add Expense
                </li>

                <li
                    onClick={() => navigate("/")}
                    className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                >
                    📋 All Expenses
                </li>

                <li
                    onClick={() => navigate("/login")}
                    className="cursor-pointer hover:bg-red-600 p-2 rounded"
                >
                    🚪 Logout
                </li>
            </ul>
        </div>
    );
}