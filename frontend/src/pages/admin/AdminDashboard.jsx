import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext.jsx";
import { adminGetOrders } from "../../api/admin.js";
import { adminGetProducts } from "../../api/admin.js";

export default function AdminDashboard() {
  const { logout } = useAdmin();
  const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0, pending: 0 });

  useEffect(() => {
    Promise.all([adminGetOrders(), adminGetProducts()]).then(([orders, products]) => {
      const revenue = orders.filter(o => o.orderStatus !== "cancelled")
        .reduce((s, o) => s + o.totalPrice, 0);
      const pending = orders.filter(o => o.orderStatus === "placed").length;
      setStats({ orders: orders.length, products: products.length, revenue, pending });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.orders, to: "/admin/orders", color: "bg-blue-50 border-blue-200" },
    { label: "Pending Orders", value: stats.pending, to: "/admin/orders", color: "bg-yellow-50 border-yellow-200" },
    { label: "Products", value: stats.products, to: "/admin/products", color: "bg-green-50 border-green-200" },
    { label: "Revenue (Rs)", value: stats.revenue.toLocaleString(), to: "/admin/orders", color: "bg-amber-50 border-amber-200" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-amber-700">Well's Merry — Admin</h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500 transition">
          Logout
        </button>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {cards.map((c) => (
            <Link key={c.label} to={c.to}
              className={`border rounded-xl p-4 ${c.color} hover:shadow-md transition`}>
              <p className="text-xs text-gray-500 mb-1">{c.label}</p>
              <p className="text-2xl font-bold">{c.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/admin/products"
            className="bg-white border rounded-xl p-6 hover:shadow-md transition flex items-center gap-4">
            <span className="text-3xl">📦</span>
            <div>
              <p className="font-semibold">Manage Products</p>
              <p className="text-xs text-gray-500">Add, edit, or remove products</p>
            </div>
          </Link>
          <Link to="/admin/orders"
            className="bg-white border rounded-xl p-6 hover:shadow-md transition flex items-center gap-4">
            <span className="text-3xl">🛒</span>
            <div>
              <p className="font-semibold">Manage Orders</p>
              <p className="text-xs text-gray-500">View orders, update status, print PDF</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
