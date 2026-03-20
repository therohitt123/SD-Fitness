import { useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';

const initialForm = {
  email: '',
  oldPassword: '',
  newPassword: '',
};

export default function AdminAccountPage() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.oldPassword) {
      toast.error('Old password is required');
      return;
    }
    if (!form.email.trim() && !form.newPassword.trim()) {
      toast.error('Enter new email or new password');
      return;
    }

    setSaving(true);
    try {
      await api.put('/api/auth/admin/credentials', {
        email: form.email,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      toast.success('Admin credentials updated');
      setForm(initialForm);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update credentials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold">Account Settings</h2>
        <p className="text-sm text-slate-400">Update admin email and password.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="New email (optional)"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="New password (optional)"
            className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
          />
        </div>

        <input
          type="password"
            name="oldPassword"
            value={form.oldPassword}
          onChange={handleChange}
          placeholder="Old password (required)"
          required
          className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
        />

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Updating...' : 'Update Credentials'}
        </button>
      </form>
    </section>
  );
}
