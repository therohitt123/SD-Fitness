import { useEffect, useState } from 'react';
import api from '../api/client';

// Exact SD Fitness Club Jhalawar location (from your Maps link)
const defaultMapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1813.8942785713655!2d76.15075975610564!3d24.596492380527916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39653f49b434b19b%3A0xc5a36d1b5ffc7b89!2sSD%20fitness%20club%20jhalawar!5e0!3m2!1sen!2sin!4v1773848207944!5m2!1sen!2sin';

const getSafeMapEmbedUrl = (rawValue) => {
  if (!rawValue || typeof rawValue !== 'string') return defaultMapEmbedUrl;
  const value = rawValue.trim();
  if (!value) return defaultMapEmbedUrl;

  // Accept known embed links directly.
  if (value.includes('google.com/maps/embed') || value.includes('output=embed')) {
    return value;
  }

  // If user saved place text or full maps URL, convert to embed search URL.
  return `https://www.google.com/maps?q=${encodeURIComponent(value)}&output=embed`;
};

export default function ContactSection() {
  const [gymInfo, setGymInfo] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    api
      .get('/api/gym-info')
      .then((res) => setGymInfo(res.data))
      .catch(() => {});
  }, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/api/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4">
      <div className="grid gap-8 md:grid-cols-[1.1fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Visit SD Fitness</h2>
          <p className="text-sm text-slate-400 max-w-md">
            Drop your details and our team will reach out to help you choose the right plan.
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <iframe
              src={getSafeMapEmbedUrl(gymInfo?.mapEmbedUrl)}
              title="SD Fitness location"
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                gymInfo?.address || 'SD Fitness Club Jhalawar'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-brand-500/60 bg-brand-500/10 px-3 py-2 text-center text-xs font-semibold text-brand-200 hover:bg-brand-500/20"
            >
              Get Directions
            </a>
            <a
              href={`https://wa.me/${String((gymInfo?.phonePrimary || '919999999999')).replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-center text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20"
            >
              WhatsApp Us
            </a>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-xs">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Opening Hours</p>
            <div className="grid gap-1 text-slate-300">
              <p><span className="text-slate-500">Mon - Sat:</span> {gymInfo?.workingHours || '6:00 AM - 10:00 PM'}</p>
              <p><span className="text-slate-500">Sunday:</span> {gymInfo?.sundayHours || '7:00 AM - 1:00 PM'}</p>
            </div>
          </div>

        </div>
        <div className=" rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
          <div className="grid  text-sm text-slate-300">
            <p>
              <span className="text-slate-500">Phone:</span> {gymInfo?.phonePrimary || '+91-XXXXXXXXXX'}
            </p>
            {gymInfo?.phoneSecondary && (
              <p>
                <span className="text-slate-500">Alt:</span> {gymInfo.phoneSecondary}
              </p>
            )}
            <p>
              <span className="text-slate-500">Address:</span> {gymInfo?.address || 'Update from admin panel'}
            </p>
          </div>
          <p className="my-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Contact Form
          </p>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-[11px] text-slate-300">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] text-slate-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-300">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-slate-300">Message</label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-500/40 disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
            {status === 'success' && (
              <p className="text-[11px] text-emerald-400">Message sent. We will contact you shortly.</p>
            )}
            {status === 'error' && (
              <p className="text-[11px] text-red-400">Failed to send. Please try again.</p>
            )}
          </form>
        </div>
      </div>

      <a
        href={`https://wa.me/${String((gymInfo?.phonePrimary || '919999999999')).replace(/\D/g, '')}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-emerald-500/70 bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-700/40 hover:bg-emerald-600"
      >
        WhatsApp
      </a>
    </section>
  );
}
