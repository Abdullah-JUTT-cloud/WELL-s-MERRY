import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { adminGetOrder, adminUpdateOrderStatus, adminAdjustCharges } from "../../api/admin.js";
import logo from "../../assets/nav-up.png";

const STATUS_COLORS = {
  placed: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function OrderPDF({ order }) {
  const extraTotal = (order.extraCharges || []).reduce((s, c) => s + c.amount, 0);

  return (
    <div id="order-pdf" className="bg-white p-8 max-w-2xl mx-auto font-sans text-sm text-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Well's Merry" className="h-16 w-16 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-amber-700">Well's Merry</h1>
            <p className="text-xs text-gray-500">Premium Hair & Skin Care</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-widest text-red-600 border-2 border-red-600 px-2 py-1 rounded mb-1">
            ⚠ FRAGILE — Handle with Care
          </div>
          <p className="text-xs text-gray-500 mt-1">Order #{order._id.slice(-10).toUpperCase()}</p>
          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}</p>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="font-bold text-xs uppercase tracking-wide text-gray-500 mb-2">Ship To</h2>
          <p className="font-semibold text-base">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.phone}</p>
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="font-bold text-xs uppercase tracking-wide text-gray-500 mb-2">Order Info</h2>
          <p><span className="text-gray-500">Payment:</span> <span className="font-medium uppercase">{order.paymentMethod}</span></p>
          <p><span className="text-gray-500">Status:</span> <span className="font-medium capitalize">{order.orderStatus}</span></p>
          <p><span className="text-gray-500">Payment Status:</span> <span className="font-medium capitalize">{order.paymentStatus}</span></p>
          {order.guestEmail && <p><span className="text-gray-500">Email:</span> {order.guestEmail}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="bg-amber-50 border-b border-amber-200">
            <th className="text-left py-2 px-3 text-xs font-semibold uppercase text-gray-600">Product</th>
            <th className="text-center py-2 px-3 text-xs font-semibold uppercase text-gray-600">Size</th>
            <th className="text-center py-2 px-3 text-xs font-semibold uppercase text-gray-600">Qty</th>
            <th className="text-right py-2 px-3 text-xs font-semibold uppercase text-gray-600">Unit Price</th>
            <th className="text-right py-2 px-3 text-xs font-semibold uppercase text-gray-600">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-2 px-3 font-medium">{item.name}</td>
              <td className="py-2 px-3 text-center text-gray-500">{item.size || "—"}</td>
              <td className="py-2 px-3 text-center">{item.qty}</td>
              <td className="py-2 px-3 text-right">Rs {item.price.toLocaleString()}</td>
              <td className="py-2 px-3 text-right font-medium">Rs {(item.price * item.qty).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pricing Summary */}
      <div className="flex justify-end mb-6">
        <div className="w-64 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>Rs {order.itemsPrice.toLocaleString()}</span>
          </div>
          {order.shippingPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span>Rs {order.shippingPrice.toLocaleString()}</span>
            </div>
          )}
          {(order.extraCharges || []).map((c, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-500">{c.label}</span>
              <span>Rs {c.amount.toLocaleString()}</span>
            </div>
          ))}
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>− Rs {order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
            <span>Total</span>
            <span className="text-amber-700">Rs {order.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-xs">
          <span className="font-semibold">Notes: </span>{order.notes}
        </div>
      )}

      <div className="text-center text-xs text-gray-400 border-t pt-4 mt-2">
        Thank you for shopping with Well's Merry! 🌿 | wellsmerry44@gmail.com
      </div>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [discount, setDiscount] = useState("");
  const [extraLabel, setExtraLabel] = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const printRef = useRef();

  const load = () => adminGetOrder(id).then(setOrder).catch(() => {});
  useEffect(() => { load(); }, [id]);

  const handleStatus = async (e) => {
    await adminUpdateOrderStatus(id, e.target.value);
    load();
  };

  const handleCharges = async (e) => {
    e.preventDefault();
    const body = {};
    if (discount !== "") body.discount = Number(discount);
    if (extraLabel && extraAmount) {
      body.extraCharges = [
        ...(order.extraCharges || []),
        { label: extraLabel, amount: Number(extraAmount) },
      ];
    }
    await adminAdjustCharges(id, body);
    setExtraLabel(""); setExtraAmount("");
    load();
  };

  const removeExtra = async (idx) => {
    const updated = order.extraCharges.filter((_, i) => i !== idx);
    await adminAdjustCharges(id, { extraCharges: updated });
    load();
  };

  const handlePrint = () => {
    const content = document.getElementById("order-pdf").innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Order ${id}</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>body{margin:0;padding:16px;font-family:sans-serif;} @media print{body{padding:0;}}</style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  if (!order) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/orders" className="text-sm text-amber-600 hover:underline">← Orders</Link>
          <h1 className="text-xl font-bold mt-1">Order #{order._id.slice(-10).toUpperCase()}</h1>
        </div>
        <div className="flex gap-3 items-center">
          <select value={order.orderStatus} onChange={handleStatus}
            className="border rounded px-2 py-1.5 text-sm">
            {["placed","confirmed","shipped","delivered","cancelled"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2 rounded-lg">
            🖨 Print / PDF
          </button>
        </div>
      </div>

      {/* Charges adjustment */}
      <form onSubmit={handleCharges} className="bg-white border rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500 block">Discount (Rs)</label>
          <input type="number" value={discount} onChange={e => setDiscount(e.target.value)}
            placeholder={order.discount}
            className="border rounded px-2 py-1.5 text-sm w-28" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block">Extra Charge Label</label>
          <input value={extraLabel} onChange={e => setExtraLabel(e.target.value)}
            placeholder="e.g. COD Fee"
            className="border rounded px-2 py-1.5 text-sm w-36" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block">Amount (Rs)</label>
          <input type="number" value={extraAmount} onChange={e => setExtraAmount(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm w-24" />
        </div>
        <button type="submit" className="bg-gray-800 text-white text-sm px-4 py-2 rounded-lg">
          Apply
        </button>
        {(order.extraCharges || []).length > 0 && (
          <div className="w-full flex gap-2 flex-wrap mt-1">
            {order.extraCharges.map((c, i) => (
              <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {c.label}: Rs {c.amount}
                <button type="button" onClick={() => removeExtra(i)} className="text-red-400 hover:text-red-600 ml-1">×</button>
              </span>
            ))}
          </div>
        )}
      </form>

      <OrderPDF order={order} />
    </div>
  );
}
