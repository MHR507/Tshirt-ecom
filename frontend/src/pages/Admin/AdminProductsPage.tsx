import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createProduct, deleteProduct, Product } from "@/services/productService";
import { useAuth } from "@/context/AuthContext";

export default function AdminProductsPage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", price: "", image_url: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth?mode=login");
      return;
    }
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    load();
  }, [isLoggedIn, user, navigate]);

  async function load() {
    setLoading(true);
    try {
      const data = await getProducts();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createProduct({
        title: form.title,
        price: Number(form.price),
        image_url: form.image_url,
        description: form.description,
      });
      setForm({ title: "", price: "", image_url: "", description: "" });
      load();
    } catch (e: any) {
      setError(e?.message || "Failed to create");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      setError(e?.message || "Failed to delete");
    }
  }

  if (!isLoggedIn || user?.role !== "admin") return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin · Products</h1>
      <form onSubmit={handleCreate} className="grid md:grid-cols-4 gap-3 mb-6">
        <input className="border px-3 py-2 rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className="border px-3 py-2 rounded" placeholder="Price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input className="border px-3 py-2 rounded" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <input className="border px-3 py-2 rounded" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit" className="md:col-span-4 bg-black text-white py-2 rounded">Add Product</button>
      </form>
      {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
      {loading ? <p>Loading…</p> : (
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="border rounded p-4">
              {p.image_url && <img src={p.image_url} alt={p.title} className="h-40 w-full object-cover mb-3" />}
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600">${Number(p.price).toFixed(2)}</p>
              <button onClick={() => handleDelete(p.id)} className="mt-3 text-sm text-red-600">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}