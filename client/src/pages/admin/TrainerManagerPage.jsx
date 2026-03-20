import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { API_BASE_URL } from '../../api/client';
import { pushAdminActivity } from '../../utils/adminActivity';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function TrainerManagerPage() {
  const [trainers, setTrainers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    mobile: '',
    speciality: '',
    bio: '',
    experienceYears: '',
  });
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchTrainers = () => {
    api
      .get('/api/trainers')
      .then((res) => setTrainers(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (photo) formData.append('photo', photo);

      const request = editingId
        ? api.put(`/api/trainers/${editingId}`, formData, {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          })
        : api.post('/api/trainers', formData, {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          });

      await request;
      setForm({
        name: '',
        email: '',
        password: '',
        age: '',
        mobile: '',
        speciality: '',
        bio: '',
        experienceYears: '',
      });
      setPhoto(null);
      setEditingId(null);
      fetchTrainers();
      toast.success(editingId ? 'Trainer updated' : 'Trainer added');
      pushAdminActivity(editingId ? 'Updated trainer profile' : 'Created trainer profile', {
        trainerName: form.name,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Trainer save failed.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/trainers/${id}`);
      fetchTrainers();
      toast.success('Trainer deleted');
      pushAdminActivity('Deleted trainer profile', { trainerId: id });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (trainer) => {
    setEditingId(trainer._id);
    setForm({
      name: trainer.name || '',
      email: trainer.email || '',
      password: '',
      age: trainer.age || '',
      mobile: trainer.mobile || '',
      speciality: trainer.speciality || '',
      bio: trainer.bio || '',
      experienceYears: trainer.experienceYears || '',
    });
    setPhoto(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: '',
      email: '',
      password: '',
      age: '',
      mobile: '',
      speciality: '',
      bio: '',
      experienceYears: '',
    });
    setPhoto(null);
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Trainer Manager</h2>
        <p className="text-sm text-slate-400">Add, feature and manage your coaching team.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
          {editingId ? 'Edit Trainer' : 'Add Trainer'}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Email (for trainer login)</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">
              Password {editingId ? '(leave blank to keep current)' : ''}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Mobile</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Speciality</label>
            <input
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-slate-300">Bio</label>
          <textarea
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr,1fr]">
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Experience (years)</label>
            <input
              type="number"
              name="experienceYears"
              value={form.experienceYears}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="w-full text-[11px] text-slate-300"
            />
            {previewUrl && (
              <div className="mt-2 h-24 w-24 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>
        {loading && (
          <div className="space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress || 10}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">Uploading media... {progress || 0}%</p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {loading ? `Saving... ${progress ? `${progress}%` : ''}` : editingId ? 'Update Trainer' : 'Save Trainer'}
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
        <p className="text-xs text-slate-400">Existing trainers</p>
        <div className="grid gap-3 md:grid-cols-3">
          {trainers.map((t) => (
            <article
              key={t._id}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs"
            >
              <div className="mb-2 aspect-[4/3] overflow-hidden rounded-xl bg-slate-800">
                {t.photoUrl ? (
                  <img
                    src={resolveMediaUrl(t.photoUrl)}
                    alt={t.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                    No photo
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-[11px] text-slate-400">{t.email}</p>
              <p className="text-[11px] text-brand-300 mb-1">{t.speciality}</p>
              <p className="text-[11px] text-slate-400">Age: {t.age || 'N/A'} | Mobile: {t.mobile || 'N/A'}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2">{t.bio}</p>
              <button
                type="button"
                onClick={() => startEdit(t)}
                className="mt-2 w-full rounded-xl border border-amber-500/50 px-3 py-1 text-[11px] text-amber-300 hover:bg-amber-500/10"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(t._id)}
                className="mt-2 w-full rounded-xl border border-red-500/50 px-3 py-1 text-[11px] text-red-300 hover:bg-red-500/10"
              >
                Delete
              </button>
            </article>
          ))}
          {!trainers.length && (
            <p className="text-xs text-slate-500">
              No trainers yet. Add your first coach above.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
