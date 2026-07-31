import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminGetOrders, adminUpdateOrderStatus } from "../../api/admin.js";
import { AdminTableSkeleton } from "../../components/Skeleton.jsx";

const STATUS_COLORS = {
  placed: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  // Distinguishes "still fetching" from "genuinely no orders" — the table
  // previously showed its empty state during every load and on every filter
  // change, which looked like the filter had returned nothing.
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    return adminGetOrders(filter || undefined)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filter]);

  const handleStatus = async (id, orderStatus) => {
    await adminUpdateOrderStatus(id, orderStatus);
    load();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link to="/admin/dashboard" className="text-sm text-amber-600 hover:underline">← Dashboard</Link>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        {["", "placed", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
              filter === s ? "bg-amber-500 text-white border-amber-500" : "border-gray-300 hover:border-amber-400"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <AdminTableSkeleton columns={8} rows={6} />
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              {["Order ID","Customer","Date","Items","Total","Payment","Status","Actions"].map(h => (
                <th key={h} className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-xs">{o._id.slice(-8)}</td>
                <td className="px-3 py-2">
                  <div className="font-medium">{o.shippingAddress.fullName}</div>
                  <div className="text-xs text-gray-500">{o.shippingAddress.phone}</div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">
                  {new Date(o.createdAt).toLocaleDateString("en-PK")}
                </td>
                <td className="px-3 py-2">{o.orderItems.length}</td>
                <td className="px-3 py-2 whitespace-nowrap">Rs {o.totalPrice}</td>
                <td className="px-3 py-2 uppercase text-xs">{o.paymentMethod}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.orderStatus]}`}>
                    {o.orderStatus}
                  </span>
                </td>
                <td className="px-3 py-2 flex gap-2 items-center">
                  <Link to={`/admin/orders/${o._id}`}
                    className="text-blue-600 hover:underline text-xs whitespace-nowrap">View / PDF</Link>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatus(o._id, e.target.value)}
                    className="text-xs border rounded px-1 py-0.5"
                  >
                    {["placed","confirmed","shipped","delivered","cancelled"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-400">No orders</td></tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
