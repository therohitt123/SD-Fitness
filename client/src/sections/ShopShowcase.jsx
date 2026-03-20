import { useEffect, useMemo, useState } from 'react';
import api, { API_BASE_URL } from '../api/client';
import SkeletonCard from '../components/ui/SkeletonCard';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function ShopShowcase() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setLoading(true);
    api
      .get('/api/products')
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['all', ...new Set(products.map((item) => item.category).filter(Boolean))],
    [products]
  );

  const visibleProducts = useMemo(
    () =>
      [...products]
        .filter((item) => (category === 'all' ? true : item.category === category))
        .sort((a, b) => {
          if (sortBy === 'price-asc') return Number(a.price || 0) - Number(b.price || 0);
          if (sortBy === 'price-desc') return Number(b.price || 0) - Number(a.price || 0);
          return 0;
        }),
    [products, category, sortBy]
  );

  return (
    <section id="shop" className="mx-auto max-w-6xl px-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold">Gym Shop Showcase</h2>
          <p className="text-sm text-slate-400">Fuel your training with premium products.</p>
        </div>
        <p className="text-[11px] text-slate-500">Display only – no online payments.</p>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-200"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === 'all' ? 'All categories' : item}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-200"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {loading && Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} className="h-80" />)}

        {!loading && visibleProducts.map((p, idx) => (
          <article
            key={p._id}
            className={`group rounded-2xl border bg-slate-900/70 p-3 text-xs transition-transform hover:-translate-y-1 ${
              idx === 0 ? 'border-brand-500/60 shadow-lg shadow-brand-500/10' : 'border-slate-800'
            }`}
          >
            <div className="mb-2 aspect-square overflow-hidden rounded-xl bg-slate-800">
              {p.imageUrl ? (
                <img
                  src={resolveMediaUrl(p.imageUrl)}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                  Product image
                </div>
              )}
            </div>
            {idx === 0 && <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-brand-300">Featured</p>}
            <h3 className="mb-0.5 text-sm font-semibold">{p.name}</h3>
            <p className="mb-1 text-[11px] text-brand-300">{p.title || 'Gym Product'}</p>
            <p className="mb-1 text-[11px] text-slate-400">{p.brand || p.category || 'Brand N/A'}</p>
            <p className="mb-2 text-sm font-semibold text-brand-300">₹{p.price}</p>
            <p className="line-clamp-3 text-[11px] text-slate-400">{p.description || 'No description available.'}</p>
          </article>
        ))}
        {!loading && !visibleProducts.length && (
          <p className="text-xs text-slate-500">
            No products found for the selected filter.
          </p>
        )}
      </div>
    </section>
  );
}
