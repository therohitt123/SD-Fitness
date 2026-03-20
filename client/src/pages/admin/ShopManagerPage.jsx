import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { API_BASE_URL } from '../../api/client';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

const initialForm = {
  title: '',
  name: '',
  brand: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  isFeatured: false,
};

export default function ShopManagerPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProducts = () => {
    api
      .get('/api/products')
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append('image', image);

      const request = editingId
        ? api.put(`/api/products/${editingId}`, formData, {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          })
        : api.post('/api/products', formData, {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          });

      await request;
      setForm(initialForm);
      setImage(null);
      setEditingId(null);
      fetchProducts();
      toast.success(editingId ? 'Product updated' : 'Product added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Product save failed');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      fetchProducts();
      toast.success('Product deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title || '',
      name: product.name || '',
      brand: product.brand || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      isFeatured: Boolean(product.isFeatured),
    });
    setImage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setImage(null);
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Shop Manager</h2>
        <p className="text-sm text-slate-400">Create and remove products with image uploads.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {editingId ? 'Edit Product' : 'Add Product'}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product title"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            required
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Description"
          className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="text-[11px] text-slate-300"
          />
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            Featured product
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {loading ? `Saving... ${progress ? `${progress}%` : ''}` : editingId ? 'Update Product' : 'Save Product'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            className="ml-2 rounded-xl border border-slate-600 px-4 py-2 text-xs text-slate-300"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="grid gap-3 md:grid-cols-3">
        {products.map((product) => (
          <article key={product._id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs">
            <div className="mb-2 aspect-[4/3] overflow-hidden rounded-xl bg-slate-800">
              {product.imageUrl ? (
                <img
                  src={resolveMediaUrl(product.imageUrl)}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <p className="text-[11px] uppercase tracking-wide text-brand-300">{product.title || 'Product'}</p>
            <p className="text-sm font-semibold text-slate-100">{product.name}</p>
            <p className="text-[11px] text-slate-400">{product.brand || 'Brand N/A'}</p>
            <p className="text-[11px] text-slate-400">${product.price} | Stock {product.stock || 0}</p>
            <button
              type="button"
              onClick={() => startEdit(product)}
              className="mt-2 w-full rounded-xl border border-amber-500/50 px-3 py-1 text-[11px] text-amber-300 hover:bg-amber-500/10"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(product._id)}
              className="mt-2 w-full rounded-xl border border-red-500/50 px-3 py-1 text-[11px] text-red-300 hover:bg-red-500/10"
            >
              Delete
            </button>
          </article>
        ))}
        {!products.length && <p className="text-xs text-slate-500">No products available yet.</p>}
      </div>
    </section>
  );
}
