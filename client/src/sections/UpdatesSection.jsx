import api from '../api/client';
import useFetch from '../hooks/useFetch';
import SkeletonCard from '../components/ui/SkeletonCard';

export default function UpdatesSection() {
  const { data: updates, loading } = useFetch(
    () => api.get('/api/updates').then((res) => (Array.isArray(res.data) ? res.data : [])),
    []
  );

  const rows = Array.isArray(updates) ? updates : [];

  return (
    <section id="updates" className="mx-auto max-w-6xl px-4">
      <div className="mb-4 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold">Latest Updates</h2>
          <p className="text-sm text-slate-400">News, events and exclusive offers.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={idx} className="h-36" />)}
        {rows.map((u) => (
          <article
            key={u._id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-xs"
          >
            <p className="mb-1 text-[11px] uppercase tracking-wide text-brand-400">{u.type}</p>
            <h3 className="mb-1 text-sm font-semibold">{u.title}</h3>
            <p className="text-slate-300 line-clamp-3">{u.content}</p>
          </article>
        ))}
        {!loading && !rows.length && (
          <p className="text-xs text-slate-500">
            Once you publish updates from the admin panel, they will show here.
          </p>
        )}
      </div>
    </section>
  );
}
