import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadImages,
} from "../../api/admin.js";

const EMPTY = {
  name: "", slug: "", category: "hair-care", shortDescription: "",
  description: "", benefits: "", ingredients: "", howToUse: "",
  price: "", compareAtPrice: "", size: "", sku: "", stock: "",
  isFeatured: false, isActive: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [imageUrls, setImageUrls] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const load = () => adminGetProducts().then(setProducts).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const urls = await adminUploadImages(files);
      setImageUrls((prev) => [...prev, ...urls]);
    } catch {
      setError("Image upload failed. Check Cloudinary credentials.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx) =>
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));

  const toPayload = (f) => ({
    ...f,
    price: Number(f.price),
    compareAtPrice: f.compareAtPrice ? Number(f.compareAtPrice) : null,
    stock: Number(f.stock),
    images: imageUrls,
    benefits: f.benefits.split(",").map((s) => s.trim()).filter(Boolean),
    ingredients: f.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrls.length) { setError("Upload at least one image"); return; }
    setError(""); setSaving(true);
    try {
      if (editId) {
        await adminUpdateProduct(editId, toPayload(form));
      } else {
        await adminCreateProduct(toPayload(form));
      }
      setForm(EMPTY); setImageUrls([]); setEditId(null); setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setForm({
      ...p,
      benefits: p.benefits.join(", "),
      ingredients: p.ingredients.join(", "),
      compareAtPrice: p.compareAtPrice ?? "",
    });
    setImageUrls(p.images || []);
    setEditId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this product?")) return;
    await adminDeleteProduct(id);
    load();
  };

  const cancelForm = () => {
    setForm(EMPTY); setImageUrls([]); setEditId(null); setShowForm(false); setError("");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-3">
          <Link to="/admin/dashboard" className="text-sm text-amber-600 hover:underline">← Dashboard</Link>
          <button
            onClick={() => { if (showForm) cancelForm(); else setShowForm(true); }}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2 rounded-lg"
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-8 space-y-3">
          <h2 className="font-semibold text-lg mb-2">{editId ? "Edit Product" : "New Product"}</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["name","Name*"],["slug","Slug*"],["size","Size*"],["sku","SKU"],
              ["price","Price*"],["compareAtPrice","Compare At Price"],["stock","Stock*"],
            ].map(([n, label]) => (
              <div key={n}>
                <label className="text-xs text-gray-500">{label}</label>
                <input name={n} value={form[n]} onChange={handleChange}
                  className="w-full border rounded px-2 py-1.5 text-sm" />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full border rounded px-2 py-1.5 text-sm">
                {["hair-care","skin-care","body-care","other"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {[
            ["shortDescription","Short Description"],
            ["description","Description*"],
            ["howToUse","How To Use"],
            ["benefits","Benefits (comma-separated)"],
            ["ingredients","Ingredients (comma-separated)"],
          ].map(([n, label]) => (
            <div key={n}>
              <label className="text-xs text-gray-500">{label}</label>
              <textarea name={n} value={form[n]} onChange={handleChange} rows={2}
                className="w-full border rounded px-2 py-1.5 text-sm" />
            </div>
          ))}

          <div>
            <label className="text-xs text-gray-500 block mb-1">Product Images*</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFiles}
              disabled={uploading}
              className="text-sm"
            />
            {uploading && <p className="text-xs text-amber-600 mt-1">Uploading to Cloudinary…</p>}
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-16 h-16 object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              Active
            </label>
          </div>

          <button type="submit" disabled={saving || uploading}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg text-sm disabled:opacity-50">
            {saving ? "Saving…" : editId ? "Update" : "Create"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              {["Image","Name","Category","Price","Stock","Active","Featured","Actions"].map(h => (
                <th key={h} className="px-3 py-2 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded" />
                  )}
                </td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2">Rs {p.price}</td>
                <td className="px-3 py-2">{p.stock}</td>
                <td className="px-3 py-2">{p.isActive ? "✅" : "❌"}</td>
                <td className="px-3 py-2">{p.isFeatured ? "⭐" : "—"}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button onClick={() => startEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline text-xs">Remove</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-400">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
