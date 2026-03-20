import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const initialForm = {
  name: '',
  plan: '',
  listPrice: '',
  offerPrice: '',
  features: '',
  isActive: true,
};

export default function PlanManagerPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchPlans = () => {
    api
      .get('/api/plans/admin/all')
      .then((res) => setPlans(Array.isArray(res.data) ? res.data : []))
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Failed to load plans');
      });
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const listPriceValue = Number(form.listPrice);
    const offerPriceValue = Number(form.offerPrice);
    if (!Number.isFinite(listPriceValue) || !Number.isFinite(offerPriceValue)) {
      toast.error('Please enter valid list and offer prices');
      return;
    }
    if (listPriceValue < 0 || offerPriceValue < 0) {
      toast.error('Prices cannot be negative');
      return;
    }
    if (offerPriceValue > listPriceValue) {
      toast.error('Offer price cannot be greater than list price');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('plan', form.plan);
      formData.append('listPrice', form.listPrice);
      formData.append('offerPrice', form.offerPrice);
      formData.append('features', form.features);
      formData.append('isActive', String(form.isActive));

      const request = editingId
        ? api.put(`/api/plans/${editingId}`, formData, {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          })
        : api.post('/api/plans', formData, {
            onUploadProgress: (evt) => {
              if (!evt.total) return;
              setProgress(Math.round((evt.loaded * 100) / evt.total));
            },
          });

      await request;
      toast.success(editingId ? 'Membership updated' : 'Membership created');
      setForm(initialForm);
      setEditingId(null);
      fetchPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save plan');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const startEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      name: plan.name || '',
      plan: plan.plan || plan.duration || '',
      listPrice: plan.listPrice ?? plan.price ?? '',
      offerPrice: plan.offerPrice ?? plan.price ?? '',
      features: Array.isArray(plan.features) ? plan.features.join(', ') : '',
      isActive: plan.isActive !== false,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this plan?');
    if (!confirmed) return;

    try {
      await api.delete(`/api/plans/${id}`);
      toast.success('Membership deleted');
      fetchPlans();
      if (editingId === id) cancelEdit();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Membership Manager</h2>
        <p className="text-sm text-slate-400">Add, update, and delete memberships.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {editingId ? 'Edit Membership' : 'Add Membership'}
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Membership name"
            required
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500"
          />
          <input
            name="plan"
            value={form.plan}
            onChange={handleChange}
            placeholder="Plan (e.g. 6 L/s or 12 months)"
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500"
          />
          <input
            type="number"
            name="listPrice"
            value={form.listPrice}
            onChange={handleChange}
            placeholder="List Price"
            required
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500"
          />
        </div>
        <input
          type="number"
          name="offerPrice"
          value={form.offerPrice}
          onChange={handleChange}
          placeholder="Offer Price"
          required
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500"
        />
        <textarea
          name="features"
          value={form.features}
          onChange={handleChange}
          rows={3}
          placeholder="Features (comma separated)"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500"
        />
        <label className="flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="accent-brand-500"
          />
          Active plan
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? `Saving... ${progress ? `${progress}%` : ''}`
            : editingId
              ? 'Update Membership'
              : 'Save Membership'}
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

      <div className="space-y-3">
        {plans.map((plan) => (
          <article
            key={plan._id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-3">
              <img src="/SD_Fitness.svg" alt="SD Fitness" className="h-8 w-8 rounded bg-slate-800 p-1" />
              <div>
                <p className="text-sm font-semibold text-slate-100">{plan.name}</p>
                <p className="text-[11px] uppercase tracking-wide text-brand-300">Plan: {plan.plan || plan.duration || '-'}</p>
                <p className="text-[11px] text-slate-400 line-through">List Price: Rs {plan.listPrice ?? plan.price ?? 0}</p>
                <p className="text-[11px] font-semibold text-emerald-300">Offer Price: Rs {plan.offerPrice ?? plan.price ?? 0}</p>
                <p className={`text-[11px] ${plan.isActive ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <div className="grid gap-2 md:min-w-40">
              <button
                type="button"
                onClick={() => startEdit(plan)}
                className="w-full rounded-xl border border-amber-500/50 px-3 py-1 text-[11px] text-amber-300 hover:bg-amber-500/10"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(plan._id)}
                className="w-full rounded-xl border border-red-500/50 px-3 py-1 text-[11px] text-red-300 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        {!plans.length && <p className="text-xs text-slate-500">No memberships found.</p>}
      </div>
    </section>
  );
}
