import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api, { API_BASE_URL } from '../api/client';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

const getPlanLabel = (planValue) => {
  if (!planValue) return '-';
  const raw = String(planValue).trim();
  if (!raw) return '-';

  const numeric = Number(raw);
  if (Number.isFinite(numeric)) {
    return `${numeric} ${numeric > 1 ? 'Months' : 'Per/Month'}`;
  }

  return raw;
};

const toAmount = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api
      .get('/api/plans')
      .then((res) => setPlans(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPlans([]));
  }, []);

  return (
    <section id="plans" className="mx-auto max-w-6xl px-4">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Memberships</h2>
          <p className="text-sm text-slate-400">Choose the right plan with best offer pricing.</p>
        </div>
        <p className="text-xs text-slate-500 max-w-sm">
          No login required. Explore plans freely and register your interest in one click – our team will
          reach out to you.
        </p>
      </div>
      {!!plans.length && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-rose-700 text-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Membership</th>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">List Price</th>
                  <th className="px-4 py-3 font-semibold">Offer Price</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => {
                  const planLabel = getPlanLabel(plan.plan || plan.duration || '');
                  const offerPrice = toAmount(plan.offerPrice, toAmount(plan.price, 0));
                  const listPrice = toAmount(plan.listPrice, offerPrice);
                  return (
                    <tr key={plan._id} className="border-t border-slate-800/70 text-slate-200">
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          
                            <img
                              src={"SD_Fitness.svg"}
                              alt={plan.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          
                          <span>{plan.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">{planLabel} </td>
                      <td className="px-4 py-3 align-middle text-slate-400 line-through">Rs {listPrice}</td>
                      <td className="px-4 py-3 align-middle font-semibold text-emerald-300">Rs {offerPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {!plans.length && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-5 text-xs text-slate-400">
          <p>No plans available right now. Please check again soon.</p>
        </div>
      )}

    </section>
  );
}
