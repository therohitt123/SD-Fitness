import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function EnquiriesManagerPage() {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    api
      .get('/api/enquiries')
      .then((res) => setEnquiries(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Enquiries Manager</h2>
        <p className="text-sm text-slate-400">Track membership interest and lead sources.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-2">
        {enquiries.map((enquiry) => (
          <article key={enquiry._id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <p className="text-sm font-semibold text-slate-100">{enquiry.name}</p>
            <p className="text-slate-400">{enquiry.email}</p>
            <p className="mt-1 text-slate-300">Plan: {enquiry.plan || 'N/A'}</p>
            <p className="text-slate-300">Source: {enquiry.source || 'website'}</p>
            {enquiry.message ? <p className="mt-2 text-slate-400">{enquiry.message}</p> : null}
          </article>
        ))}
        {!enquiries.length && <p className="text-xs text-slate-500">No enquiries yet.</p>}
      </div>
    </section>
  );
}
