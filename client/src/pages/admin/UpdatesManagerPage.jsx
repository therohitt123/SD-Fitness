import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const initialForm = {
  title: '',
  content: '',
  type: 'news',
  activeFrom: '',
  activeTo: '',
};

export default function UpdatesManagerPage() {
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUpdates = () => {
    api
      .get('/api/updates', { params: { all: true } })
      .then((res) => setUpdates(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        activeFrom: form.activeFrom || null,
        activeTo: form.activeTo || null,
      };

      if (editingId) {
        await api.put(`/api/updates/${editingId}`, payload);
      } else {
        await api.post('/api/updates', payload);
      }

      setForm(initialForm);
      setEditingId(null);
      fetchUpdates();
      toast.success(editingId ? 'Update card edited' : 'Update card created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/updates/${id}`);
      fetchUpdates();
      toast.success('Update deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      content: item.content || '',
      type: item.type || 'news',
      activeFrom: item.activeFrom ? String(item.activeFrom).slice(0, 10) : '',
      activeTo: item.activeTo ? String(item.activeTo).slice(0, 10) : '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Updates Manager</h2>
        <p className="text-sm text-slate-400">Create news, events, and promotional offers.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {editingId ? 'Edit Update' : 'Create Update'}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Title"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          >
            <option value="news">News</option>
            <option value="event">Event</option>
            <option value="offer">Offer</option>
          </select>
        </div>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Update content"
          className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="date"
            name="activeFrom"
            value={form.activeFrom}
            onChange={handleChange}
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            type="date"
            name="activeTo"
            value={form.activeTo}
            onChange={handleChange}
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Saving...' : editingId ? 'Update Card' : 'Publish Update'}
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

      <div className="grid gap-3 md:grid-cols-2">
        {updates.map((item) => (
          <article key={item._id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <p className="text-[11px] uppercase tracking-wide text-brand-300">{item.type}</p>
            <h3 className="mt-1 text-sm font-semibold text-slate-100">{item.title}</h3>
            <p className="mt-2 text-slate-400">{item.content}</p>
            <button
              type="button"
              onClick={() => startEdit(item)}
              className="mt-3 mr-2 rounded-xl border border-amber-500/50 px-3 py-1 text-[11px] text-amber-300 hover:bg-amber-500/10"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(item._id)}
              className="mt-3 rounded-xl border border-red-500/50 px-3 py-1 text-[11px] text-red-300 hover:bg-red-500/10"
            >
              Delete
            </button>
          </article>
        ))}
        {!updates.length && <p className="text-xs text-slate-500">No updates published yet.</p>}
      </div>
    </section>
  );
}
