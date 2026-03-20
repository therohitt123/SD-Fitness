import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function SliderManagerPage() {
  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchSlides = () => {
    api
      .get('/api/videos')
      .then((res) => setSlides(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!editingId && !file) {
      toast.error('Please choose a slider image');
      return;
    }
    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      if (file) formData.append('media', file);
      formData.append('title', title);
      formData.append('description', description);

      const request = editingId
        ? api.put(`/api/videos/${editingId}`, formData, {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          })
        : api.post('/api/videos', formData, {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          });

      await request;
      setTitle('');
      setDescription('');
      setFile(null);
      setEditingId(null);
      fetchSlides();
      toast.success(editingId ? 'Slider updated' : 'Slider image uploaded');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/videos/${id}`);
      fetchSlides();
      toast.success('Slider item deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setFile(null);
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Slider Manager</h2>
        <p className="text-sm text-slate-400">
          Upload, update and delete hero slider media.
        </p>
      </header>

      <form onSubmit={handleUpload} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
          {editingId ? 'Edit Slider Image' : 'Add Slider Image'}
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Media (Image/MP4)</label>
            <input
              type="file"
              accept="image/*,video/mp4"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-2 py-1.5 text-[11px] text-slate-300 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-[11px] file:text-slate-100 hover:file:bg-slate-700"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {loading ? `Saving... ${progress ? `${progress}%` : ''}` : editingId ? 'Update Slider' : 'Upload Image'}
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

      <div className="space-y-2">
        <p className="text-xs text-slate-400">Existing slider images</p>
        <div className="grid gap-3 md:grid-cols-2">
          {slides.map((v) => (
            <article
              key={v._id}
              className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs"
            >
              <div className="w-28 overflow-hidden rounded-xl bg-slate-800">
                {v.mediaType === 'video' ? (
                  <video
                    src={resolveMediaUrl(v.url)}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={resolveMediaUrl(v.url)}
                    alt={v.title || 'Slider image'}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{v.title || 'Untitled'}</p>
                  <p className="text-[11px] text-slate-400">{v.description || 'No description'}</p>
                </div>
                <div className='flex gap-2'>

                <button
                  type="button"
                  onClick={() => startEdit(v)}
                  className="self-start rounded-xl border border-amber-500/50 px-3 py-1 text-[11px] text-amber-300 hover:bg-amber-500/10"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(v._id)}
                  className="self-start rounded-xl border border-red-500/50 px-3 py-1 text-[11px] text-red-300 hover:bg-red-500/10"
                >
                  Delete
                </button>
                </div>
              </div>
            </article>
          ))}
          {!slides.length && (
            <p className="text-xs text-slate-500">
              No slider images yet. Upload one to power the homepage slider.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
