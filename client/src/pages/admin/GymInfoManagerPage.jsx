import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const initialForm = {
  name: 'SD Fitness',
  address: '',
  phonePrimary: '',
  phoneSecondary: '',
  email: '',
  mapEmbedUrl: '',
  mondayFriday: '',
  saturday: '',
  sunday: '',
};

const normalizeMapEmbedInput = (rawValue) => {
  if (!rawValue || typeof rawValue !== 'string') return '';
  const value = rawValue.trim();
  if (!value) return '';

  // If user pasted iframe code, extract src.
  if (value.includes('<iframe')) {
    const srcMatch = value.match(/src=["']([^"']+)["']/i);
    if (srcMatch?.[1]) return srcMatch[1];
  }

  // Keep existing embed URL unchanged.
  if (value.includes('google.com/maps/embed') || value.includes('output=embed')) {
    return value;
  }

  // Convert plain place text or normal maps link to embed search URL.
  return `https://www.google.com/maps?q=${encodeURIComponent(value)}&output=embed`;
};

export default function GymInfoManagerPage() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/api/gym-info')
      .then((res) => {
        if (!res.data) return;
        setForm({
          name: res.data.name || 'SD Fitness',
          address: res.data.address || '',
          phonePrimary: res.data.phonePrimary || '',
          phoneSecondary: res.data.phoneSecondary || '',
          email: res.data.email || '',
          mapEmbedUrl: res.data.mapEmbedUrl || '',
          mondayFriday: res.data.openingHours?.mondayFriday || '',
          saturday: res.data.openingHours?.saturday || '',
          sunday: res.data.openingHours?.sunday || '',
        });
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/gym-info', {
        name: form.name,
        address: form.address,
        phonePrimary: form.phonePrimary,
        phoneSecondary: form.phoneSecondary,
        email: form.email,
        mapEmbedUrl: normalizeMapEmbedInput(form.mapEmbedUrl),
        openingHours: {
          mondayFriday: form.mondayFriday,
          saturday: form.saturday,
          sunday: form.sunday,
        },
      });
      toast.success('Gym contact details updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save gym info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Gym Info Manager</h2>
        <p className="text-sm text-slate-400">Edit contact details, address and opening hours.</p>
      </header>

      <form
        onSubmit={handleSave}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Gym name"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            name="phonePrimary"
            value={form.phonePrimary}
            onChange={handleChange}
            placeholder="Primary phone"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            name="phoneSecondary"
            value={form.phoneSecondary}
            onChange={handleChange}
            placeholder="Secondary phone"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
        </div>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          rows={2}
          className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
        />
        <input
          name="mapEmbedUrl"
          value={form.mapEmbedUrl}
          onChange={handleChange}
          placeholder="Google map embed URL"
          className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
        />
        <div className="grid gap-3 md:grid-cols-3">
          <input
            name="mondayFriday"
            value={form.mondayFriday}
            onChange={handleChange}
            placeholder="Mon-Fri hours"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            name="saturday"
            value={form.saturday}
            onChange={handleChange}
            placeholder="Saturday hours"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            name="sunday"
            value={form.sunday}
            onChange={handleChange}
            placeholder="Sunday hours"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Gym Info'}
        </button>
      </form>
    </section>
  );
}
