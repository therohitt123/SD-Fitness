import { useEffect, useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { getAdminActivityLog, pushAdminActivity } from '../../utils/adminActivity';
import API_ENDPOINTS from '../../constants/apiEndpoints';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [credentialType, setCredentialType] = useState('email');
  const [credentialsForm, setCredentialsForm] = useState({
    oldEmail: '',
    newEmail: '',
    oldPassword: '',
    newPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [monthlyEnquiries, setMonthlyEnquiries] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const seenSnapshot = Number(localStorage.getItem('sd_admin_seen_total') || 0);

    api
      .get(API_ENDPOINTS.admin.stats)
      .then((res) => {
        setStats(res.data);
        const total = (res.data?.totalMessages || 0) + (res.data?.totalEnquiries || 0);
        setHasUnread(total > seenSnapshot);
        localStorage.setItem('sd_admin_seen_total', String(total));
      })
      .catch(() => {});

    api
      .get(API_ENDPOINTS.admin.enquiriesMonthly)
      .then((res) => setMonthlyEnquiries(Array.isArray(res.data) ? res.data.slice(-6) : []))
      .catch(() => {});

    const localLog = getAdminActivityLog();
    setActivityLog(localLog.slice(0, 8));
  }, []);

  const handleCredentialsChange = (e) => {
    const { name, value } = e.target;
    setCredentialsForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();

    if (credentialType === 'email') {
      if (!credentialsForm.oldEmail.trim() || !credentialsForm.newEmail.trim()) {
        toast.error('Old email and new email are required');
        return;
      }
    }

    if (credentialType === 'password') {
      if (!credentialsForm.oldPassword || !credentialsForm.newPassword.trim()) {
        toast.error('Old password and new password are required');
        return;
      }
      if (credentialsForm.newPassword.trim().length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
    }

    const payload = {
      oldEmail: credentialType === 'email' ? credentialsForm.oldEmail : undefined,
      email: credentialType === 'email' ? credentialsForm.newEmail : undefined,
      oldPassword: credentialType === 'password' ? credentialsForm.oldPassword : undefined,
      newPassword: credentialType === 'password' ? credentialsForm.newPassword : undefined,
    };

    if (credentialType === 'email' && credentialsForm.oldEmail.trim().toLowerCase() === credentialsForm.newEmail.trim().toLowerCase()) {
      toast.error('Old email and new email cannot be same');
      return;
    }

    setSaving(true);
    try {
      await api.put(API_ENDPOINTS.auth.adminCredentials, payload);
      toast.success('Admin credentials updated');
      pushAdminActivity(
        credentialType === 'email' ? 'Updated admin email credentials' : 'Updated admin password credentials'
      );
      setActivityLog(getAdminActivityLog().slice(0, 8));
      setCredentialsForm({ oldEmail: '', newEmail: '', oldPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update credentials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Dashboard Overview</h1>
            <p className="text-sm text-slate-400">Quick glance at SD Fitness activity.</p>
          </div>
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
              <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
            </svg>
            {hasUnread && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand-500" />}
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stats && (
          <>
            <StatCard title="Trainers" value={stats.totalTrainers} />
            <StatCard title="Products" value={stats.totalProducts} />
            <StatCard title="Messages" value={stats.totalMessages} />
            <StatCard title="Updates" value={stats.totalUpdates} />
            <StatCard title="Enquiries" value={stats.totalEnquiries} />
          </>
        )}
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Weekly/Monthly Enquiry Trend</h3>
        <p className="mt-1 text-xs text-slate-400">Last {monthlyEnquiries.length || 0} months based on enquiries.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {monthlyEnquiries.map((item) => {
            const max = Math.max(...monthlyEnquiries.map((x) => x.count), 1);
            const height = Math.max(10, Math.round((item.count / max) * 100));
            return (
              <div key={item.month} className="rounded-xl border border-slate-800 bg-slate-950/40 p-2">
                <p className="truncate text-[10px] text-slate-500">{item.month}</p>
                <div className="mt-2 flex h-20 items-end rounded bg-slate-900/80 p-1">
                  <div className="w-full rounded-sm bg-gradient-to-t from-brand-500 to-pink-500" style={{ height: `${height}%` }} />
                </div>
                <p className="mt-1 text-[11px] text-slate-300">{item.count} enquiries</p>
              </div>
            );
          })}
          {!monthlyEnquiries.length && <p className="text-xs text-slate-500">No trend data available yet.</p>}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Update Admin Credentials</h3>
        <p className="mt-1 text-xs text-slate-400">Choose one option: change email or change password.</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setCredentialType('email')}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              credentialType === 'email'
                ? 'border-brand-500/70 bg-brand-500/15 text-brand-300'
                : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
            }`}
          >
            Change Email
          </button>
          <button
            type="button"
            onClick={() => setCredentialType('password')}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
              credentialType === 'password'
                ? 'border-brand-500/70 bg-brand-500/15 text-brand-300'
                : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
            }`}
          >
            Change Password
          </button>
        </div>

        <form onSubmit={handleCredentialsSubmit} className="mt-3 grid gap-3 md:grid-cols-2">
          {credentialType === 'email' && (
            <>
              <input
                type="email"
                name="oldEmail"
                value={credentialsForm.oldEmail}
                onChange={handleCredentialsChange}
                placeholder="Old email"
                required
                className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs"
              />
              <input
                type="email"
                name="newEmail"
                value={credentialsForm.newEmail}
                onChange={handleCredentialsChange}
                placeholder="New email"
                required
                className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs"
              />
            </>
          )}

          {credentialType === 'password' && (
            <>
              <input
                type="password"
                name="oldPassword"
                value={credentialsForm.oldPassword}
                onChange={handleCredentialsChange}
                placeholder="Old password"
                required
                className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs"
              />
              <input
                type="password"
                name="newPassword"
                value={credentialsForm.newPassword}
                onChange={handleCredentialsChange}
                placeholder="New password"
                required
                className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs"
              />
            </>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {saving
                ? 'Updating...'
                : credentialType === 'email'
                ? 'Update Email'
                : 'Update Password'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Recent Admin Activity</h3>
        <p className="mt-1 text-xs text-slate-400">Credentials, uploads and delete actions appear here.</p>
        <div className="mt-3 space-y-2">
          {activityLog.map((entry) => (
            <article key={entry.id} className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
              <p className="text-xs text-slate-200">{entry.action}</p>
              <p className="text-[11px] text-slate-500">{new Date(entry.createdAt).toLocaleString()}</p>
            </article>
          ))}
          {!activityLog.length && <p className="text-xs text-slate-500">No activity recorded yet.</p>}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-3">
      <p className="text-xs text-slate-400 mb-1">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
