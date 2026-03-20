import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginTrainer } from '../store/authSlice';

export default function TrainerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginTrainer({ email, password }));
    if (loginTrainer.fulfilled.match(res)) {
      toast.success('Welcome trainer');
      navigate('/trainer');
    } else {
      toast.error(res.payload || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center px-4">
      <div className="glass-nav w-full max-w-md rounded-2xl px-6 py-8">
        <h1 className="mb-1 text-xl font-semibold">Trainer Login</h1>
        <p className="mb-6 text-sm text-slate-400">Manage only your profile and your photos.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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
            {status === 'loading' ? 'Signing in...' : 'Sign in as Trainer'}
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-400">
          Are you an admin?{' '}
          <Link to="/admin/login" className="text-brand-300 hover:text-brand-200">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
