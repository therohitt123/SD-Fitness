import { useEffect, useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function MembersManagerPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadMembers = () => {
    setLoading(true);
    api
      .get('/api/admin/members')
      .then((res) => setMembers(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        toast.error('Failed to load members');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSelect = (member) => {
    setSelected(member);
    setForm({ name: member.name || '', email: member.email || '', mobile: member.mobile || '' });
    setEmailForm({ subject: '', message: '' });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value });
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await api.put(`/api/admin/members/${selected._id}`, form);
      toast.success('Member updated');
      setMembers((prev) => prev.map((m) => (m._id === data._id ? data : m)));
      setSelected(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update member');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!selected) return;
    if (!emailForm.subject || !emailForm.message) {
      toast.error('Subject and message are required');
      return;
    }
    setSending(true);
    try {
      await api.post(`/api/admin/members/${selected._id}/email`, emailForm);
      toast.success('Email sent');
      setEmailForm({ subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!selected) return;
    const confirmed = window.confirm('Are you sure you want to delete this member? This action cannot be undone.');
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.delete(`/api/admin/members/${selected._id}`);
      toast.success('Member deleted');
      setMembers((prev) => prev.filter((m) => m._id !== selected._id));
      setSelected(null);
      setForm({ name: '', email: '', mobile: '' });
      setEmailForm({ subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete member');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Members</h1>
          <p className="text-xs text-slate-400">Review registered members, update details, and send important emails.</p>
        </div>
        <button
          type="button"
          onClick={loadMembers}
          className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-100 hover:border-brand-500/70"
        >
          Refresh
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-[1.4fr,1fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Members List</p>
            <p className="text-[11px] text-slate-500">Total: {members.length}</p>
          </div>
          <div className="space-y-2 md:hidden">
            {loading && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-4 text-center text-slate-500">
                Loading members...
              </div>
            )}

            {!loading && !members.length && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-4 text-center text-slate-500">
                No members registered yet.
              </div>
            )}

            {!loading &&
              members.map((m) => (
                <article
                  key={m._id}
                  className={`rounded-xl border px-3 py-3 ${
                    selected?._id === m._id
                      ? 'border-brand-500/60 bg-brand-500/10'
                      : 'border-slate-800 bg-slate-900/50'
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-100">{m.name}</p>
                  <p className="mt-1 break-all text-[11px] text-slate-300">{m.email}</p>
                  <p className="mt-1 text-[11px] text-slate-300">Mobile: {m.mobile || 'N/A'}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Joined: {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '-'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelect(m)}
                    className="mt-3 w-full rounded-lg border border-slate-700 px-2 py-2 text-[11px] text-slate-100 hover:border-brand-500/70"
                  >
                    {selected?._id === m._id ? 'Selected' : 'Edit'}
                  </button>
                </article>
              ))}
          </div>

          <div className="hidden max-h-[420px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-800/60 md:block">
            <table className="min-w-[720px] text-left text-[11px] text-slate-200">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Mobile</th>
                  <th className="px-3 py-2 font-medium">Joined</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                      Loading members...
                    </td>
                  </tr>
                )}
                {!loading && !members.length && (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                      No members registered yet.
                    </td>
                  </tr>
                )}
                {!loading &&
                  members.map((m) => (
                    <tr
                      key={m._id}
                      className={
                        selected?._id === m._id
                          ? 'bg-slate-800/70'
                          : 'odd:bg-slate-900/60 even:bg-slate-900/40'
                      }
                    >
                      <td className="px-3 py-2 align-middle">{m.name}</td>
                      <td className="px-3 py-2 align-middle text-slate-300">{m.email}</td>
                      <td className="px-3 py-2 align-middle text-slate-300">{m.mobile || 'N/A'}</td>
                      <td className="px-3 py-2 align-middle text-slate-500">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-3 py-2 align-middle text-right">
                        <button
                          type="button"
                          onClick={() => handleSelect(m)}
                          className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-100 hover:border-brand-500/70"
                        >
                          {selected?._id === m._id ? 'Selected' : 'Edit'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Member Details
            </p>
            {selected ? (
              <form onSubmit={handleUpdateMember} className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] text-slate-300">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-300">Mobile</label>
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-500/40 disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteMember}
                    disabled={deleting}
                    className="w-full rounded-xl border border-red-500/70 bg-red-500/5 py-2.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                  >
                    {deleting ? 'Deleting…' : 'Delete Member'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-[11px] text-slate-500">Select a member from the list to view and edit details.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Send Email
            </p>
            {selected ? (
              <form onSubmit={handleSendEmail} className="space-y-3">
                <div>
                  <p className="mb-1 text-[11px] text-slate-400">
                    To: <span className="text-slate-100">{selected.email}</span>
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-300">Subject</label>
                  <input
                    name="subject"
                    value={emailForm.subject}
                    onChange={handleEmailChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-slate-300">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    value={emailForm.message}
                    onChange={handleEmailChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl bg-slate-50/90 py-2.5 text-xs font-semibold text-slate-900 shadow-lg shadow-slate-100/40 disabled:opacity-60"
                >
                  {sending ? 'Sending…' : 'Send Email'}
                </button>
              </form>
            ) : (
              <p className="text-[11px] text-slate-500">Select a member to send them an important email.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
