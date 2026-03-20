import { useEffect, useState } from 'react';
import api, { API_BASE_URL } from '../api/client';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'workout', label: 'Workout' },
  { id: 'machines', label: 'Machines' },
  { id: 'transformation', label: 'Transformation' },
];
export default function GallerySection() {
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const params = filter === 'all' ? {} : { params: { category: filter } };
    api
      .get('/api/gallery', params)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setItems(data);
      })
      .catch(() => {
        setItems([]);
      });
  }, [filter]);

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Gym Gallery</h2>
          <p className="text-sm text-slate-400">Peek inside the SD Fitness atmosphere.</p>
        </div>
        <div className="flex gap-2 text-xs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-3 py-1 border text-[11px] transition-colors ${
                filter === tab.id
                  ? 'border-brand-500/70 bg-brand-500/20 text-brand-200'
                  : 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="columns-2 md:columns-3 gap-3 space-y-3">
        {items.map((item) => (
          <figure key={item._id} className="overflow-hidden rounded-xl border border-slate-800">
            <img
              src={resolveMediaUrl(item.url)}
              alt={item.caption || 'SD Fitness gallery image'}
              loading="lazy"
              className="w-full break-inside-avoid object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          </figure>
        ))}
        {!items.length && (
          <p className="text-xs text-slate-500">
            Gallery images will appear here once uploaded from the admin panel.
          </p>
        )}
      </div>
    </section>
  );
}
