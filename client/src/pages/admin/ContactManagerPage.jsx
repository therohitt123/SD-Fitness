import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function ContactManagerPage() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = () => {
    api
      .get('/api/contact')
      .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markResolved = async (id) => {
    try {
      await api.patch(`/api/contact/${id}/resolve`);
      fetchMessages();
      toast.success('Message marked resolved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Resolve failed');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Contact Manager</h2>
        <p className="text-sm text-slate-400">Review incoming contact messages and mark them resolved.</p>
      </header>

      <div className="space-y-3">
        {messages.map((msg) => (
          <article key={msg._id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100">{msg.name}</p>
              <p className={`text-[11px] ${msg.resolved ? 'text-emerald-300' : 'text-amber-300'}`}>
                {msg.resolved ? 'Resolved' : 'Pending'}
              </p>
            </div>
            <p className="text-slate-400">{msg.email}</p>
            <p className="mt-2 text-slate-300">{msg.message}</p>
            {!msg.resolved && (
              <button
                type="button"
                onClick={() => markResolved(msg._id)}
                className="mt-3 rounded-xl border border-emerald-500/50 px-3 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500/10"
              >
                Mark Resolved
              </button>
            )}
          </article>
        ))}
        {!messages.length && <p className="text-xs text-slate-500">No contact messages found.</p>}
      </div>
    </section>
  );
}
