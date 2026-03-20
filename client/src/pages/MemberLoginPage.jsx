import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../store/authSlice';

export default function MemberLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(res)) {
      toast.success('Welcome back to SD Fitness');
      navigate('/');
    } else {
      toast.error(res.payload || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center px-4">
      <div className="glass-nav max-w-md w-full rounded-2xl px-6 py-8">
        <h1 className="text-xl font-semibold mb-1">Member Login</h1>
        <p className="text-sm text-slate-400 mb-6">Sign in to view your personalised SD Fitness experience.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/40 disabled:opacity-60"
          >
            {status === 'loading' ? 'Signing in…' : 'Sign in as Member'}
          </button>
        </form>
        <div className="mt-5 space-y-2 text-center text-xs text-slate-400">
          <p>New to SD Fitness?</p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-[11px] font-medium text-slate-100 hover:border-brand-500/70 hover:bg-slate-900"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
