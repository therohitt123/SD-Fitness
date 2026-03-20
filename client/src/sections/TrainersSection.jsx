import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../api/client';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function TrainersSection() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/trainers')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setTrainers(data);
      })
      .catch(() => {
        setTrainers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="trainers" className="mx-auto max-w-6xl px-4">
      <div className="mb-6 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold">Meet the Trainers</h2>
          <p className="text-sm text-slate-400">Professionals obsessed with your progress.</p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {loading &&
          [1, 2, 3].map((s) => (
            <div key={s} className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <div className="mb-3 aspect-[4/3] rounded-xl bg-slate-800" />
              <div className="mb-2 h-4 w-2/3 rounded bg-slate-800" />
              <div className="mb-2 h-3 w-1/2 rounded bg-slate-800" />
              <div className="h-3 w-full rounded bg-slate-800" />
            </div>
          ))}
        {trainers.map((t) => (
          <article
            key={t._id}
            className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:border-brand-500/70"
          >
            <div className="mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-slate-800">
              {t.photoUrl ? (
                <img
                  src={resolveMediaUrl(t.photoUrl)}
                  alt={t.name}
                  loading="lazy"
                  className="h-[164%] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500">
                  Trainer photo
                </div>
              )}
            </div>
            <h3 className="text-sm font-semibold">{t.name}</h3>
            <p className="text-xs text-brand-300 mb-1">{t.speciality}</p>
            <p className="text-xs text-slate-400 line-clamp-3">{t.bio}</p>
            <Link
                to={`/trainers/${t._id}`}
                className="mt-3 block w-full rounded-xl border border-slate-700 bg-slate-900/80 py-1.5 text-center text-xs text-slate-200 hover:border-brand-500/60"
              >
                View Profile
              </Link>
          </article>
        ))}
        {!loading && !trainers.length && (
          <p className="text-xs text-slate-500">
            Trainer profiles will appear here once added via the admin panel.
          </p>
        )}
      </div>
    </section>
  );
}
