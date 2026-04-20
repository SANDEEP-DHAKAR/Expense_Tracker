import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {data && (
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-gray-500">Total Users</h2>
            <p className="text-2xl font-bold">{data.totalUsers}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-gray-500">Total Expenses</h2>
            <p className="text-2xl font-bold">₹ {data.totalExpenses}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-gray-500">Categories</h2>
            <p className="text-2xl font-bold">{data.totalCategories}</p>
          </div>

        </div>
      )}
    </Layout>
  );
}