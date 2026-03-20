import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, registerTrainer } from '../store/authSlice';
import api from '../api/client';
import useDebounce from '../hooks/useDebounce';
import usePasswordStrength from '../hooks/usePasswordStrength';
import useToast from '../hooks/useToast';
import API_ENDPOINTS from '../constants/apiEndpoints';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('user');
  const [emailState, setEmailState] = useState({ checking: false, available: null, message: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((s) => s.auth);
  const { success, error } = useToast();
  const debouncedEmail = useDebounce(email, 450);
  const passwordStrength = usePasswordStrength(password);

  useEffect(() => {
    const normalized = debouncedEmail.trim();
    if (!normalized || !/^\S+@\S+\.\S+$/.test(normalized)) {
      setEmailState({ checking: false, available: null, message: '' });
      return;
    }

    let active = true;
    setEmailState((prev) => ({ ...prev, checking: true, message: 'Checking email...' }));

    api
      .get(API_ENDPOINTS.auth.emailAvailability, {
        params: { email: normalized, role },
      })
      .then((res) => {
        if (!active) return;
        const available = !!res.data?.available;
        setEmailState({
          checking: false,
          available,
          message: available ? 'Email is available' : 'Email is already registered',
        });
      })
      .catch(() => {
        if (!active) return;
        setEmailState({ checking: false, available: null, message: 'Unable to verify email right now' });
      });

    return () => {
      active = false;
    };
  }, [debouncedEmail, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, email, password, mobile };

    if (emailState.available === false) {
      error('Please use a different email');
      return;
    }

    if (passwordStrength.score < 2) {
      error('Please choose a stronger password');
      return;
    }

    if (role === 'trainer') {
      const res = await dispatch(registerTrainer(payload));
      if (registerTrainer.fulfilled.match(res)) {
        success('Trainer account created');
        navigate('/trainer');
      } else {
        error(res.payload || 'Registration failed');
      }
    } else {
      const res = await dispatch(registerUser(payload));
      if (registerUser.fulfilled.match(res)) {
        success('Account created');
        navigate('/');
      } else {
        error(res.payload || 'Registration failed');
      }
    }
  };

  return (
    <div className="flex min-h-[100vh] items-center justify-center px-4">
      <div className="glass-nav max-w-md w-full rounded-2xl px-6 py-8">
        <h1 className="text-xl font-semibold mb-1">Create your account</h1>
        <p className="text-sm text-slate-400 mb-6">
          Register as a member or a trainer. Admin account is managed separately.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-300">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`rounded-xl border px-3 py-2 text-center ${
                role === 'user'
                  ? 'border-brand-500 bg-brand-500/10 text-brand-100'
                  : 'border-slate-700 bg-slate-900/60 text-slate-300'
              }`}
            >
              Member / User
            </button>
            <button
              type="button"
              onClick={() => setRole('trainer')}
              className={`rounded-xl border px-3 py-2 text-center ${
                role === 'trainer'
                  ? 'border-brand-500 bg-brand-500/10 text-brand-100'
                  : 'border-slate-700 bg-slate-900/60 text-slate-300'
              }`}
            >
              Trainer
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailState.message && (
              <p
                className={`mt-1 text-[11px] ${
                  emailState.available === false
                    ? 'text-red-400'
                    : emailState.available
                    ? 'text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {emailState.message}
              </p>
            )}
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
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full transition-all ${
                    passwordStrength.score <= 1
                      ? 'bg-red-500'
                      : passwordStrength.score <= 2
                      ? 'bg-amber-400'
                      : passwordStrength.score <= 3
                      ? 'bg-blue-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${passwordStrength.percent}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Password strength: {passwordStrength.level}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Mobile (optional)</label>
            <input
              type="tel"
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || emailState.checking || emailState.available === false}
            className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/40 disabled:opacity-60"
          >
            {status === 'loading' ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-400 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-300 hover:text-brand-200">
            Member Login
          </Link>
        </p>
      </div>
    </div>
  );
}
