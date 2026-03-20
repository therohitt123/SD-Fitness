import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { API_BASE_URL } from '../api/client';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function TrainerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAllTrainers = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('sd_scroll_target', 'trainers');
    }
    navigate('/');
  };

  useEffect(() => {
    let active = true;

    const fetchTrainer = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/api/trainers/${id}`);
        if (!active) return;
        setTrainer(data || null);
      } catch (err) {
        if (!active) return;
        if (err?.response?.status === 404) {
          setTrainer(null);
          setError('Trainer not found.');
        } else {
          setError('Unable to load trainer profile. Please try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) {
      fetchTrainer();
    }

    return () => {
      active = false;
    };
  }, [id]);

  const hasGallery = !!trainer?.galleryPhotos?.length;
  const skillTags = (trainer?.speciality || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
  const expYears = Number(trainer?.experienceYears || 0);
  const expProgress = Math.min(100, Math.max(8, Math.round((expYears / 10) * 100)));

  return (
    <div className="mx-auto max-w-5xl px-4 pt-20 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">Trainer Profile</p>
          <h1 className="text-2xl font-semibold text-slate-50">
            {loading ? 'Loading trainer…' : trainer?.name || 'Trainer'}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/"
            className="rounded-lg border border-slate-700 px-3 py-1 text-slate-200 hover:border-brand-500/70 hover:bg-slate-900/70"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={handleAllTrainers}
            className="rounded-lg border border-slate-700 px-3 py-1 text-slate-200 hover:border-brand-500/70 hover:bg-slate-900/70"
          >
            All Trainers
          </button>
        </div>
      </div>

      {loading && (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-[260px,1fr]">
            <div className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-800" />
            <div className="space-y-3">
              <div className="h-5 w-1/2 animate-pulse rounded bg-slate-800" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-800" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-800" />
            </div>
          </div>
          <div>
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-slate-800" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && !trainer && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5 text-sm text-slate-300">
          Trainer profile could not be found.
        </div>
      )}

      {!loading && trainer && (
        <>
          <div className="grid gap-6 md:grid-cols-[260px,1fr]">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              {trainer.photoUrl ? (
                <img
                  src={resolveMediaUrl(trainer.photoUrl)}
                  alt={trainer.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full min-h-[260px] items-center justify-center text-xs text-slate-500">
                  Trainer photo coming soon
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm text-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">
                {trainer.speciality || 'SD Fitness Trainer'}
              </p>
              <h2 className="text-xl font-semibold">{trainer.name}</h2>
              <p className="text-sm text-slate-300">
                {trainer.bio || 'This trainer profile will be updated with more details soon.'}
              </p>

              <div>
                <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Experience level</span>
                  <span>{trainer.experienceYears ? `${trainer.experienceYears} years` : 'Beginner to Intermediate'}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-pink-500"
                    style={{ width: `${expProgress}%` }}
                  />
                </div>
              </div>

              {!!skillTags.length && (
                <div className="flex flex-wrap gap-2">
                  {skillTags.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-brand-500/40 bg-brand-500/10 px-2.5 py-1 text-[11px] text-brand-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Age</p>
                  <p className="mt-0.5 text-sm text-slate-100">{trainer.age || 'N/A'}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Experience</p>
                  <p className="mt-0.5 text-sm text-slate-100">
                    {trainer.experienceYears ? `${trainer.experienceYears} yrs` : 'N/A'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Mobile</p>
                  <p className="mt-0.5 text-sm text-slate-100">{trainer.mobile || 'On request'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Trainer Photos
              </p>
              {hasGallery && (
                <p className="text-[11px] text-slate-500">
                  Showing {trainer.galleryPhotos.length} photo
                  {trainer.galleryPhotos.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {hasGallery ? (
              <div className="columns-2 gap-2 space-y-2 md:columns-4">
                {trainer.galleryPhotos.slice(0, 24).map((photo) => (
                  <img
                    key={photo._id || photo.url}
                    src={resolveMediaUrl(photo.url)}
                    alt={photo.caption || 'Trainer gallery photo'}
                    loading="lazy"
                    className="w-full break-inside-avoid rounded-xl object-cover"
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-5 text-xs text-slate-400">
                This trainer has not uploaded additional photos yet. Check back soon.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
