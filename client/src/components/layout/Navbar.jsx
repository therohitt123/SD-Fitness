import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setNavScrolled } from '../../store/uiSlice';

const links = [
  { type: 'route', to: '/', label: 'Home' },
  { type: 'hash', hash: 'about', label: 'About' },
  { type: 'hash', hash: 'trainers', label: 'Trainers' },
  { type: 'hash', hash: 'gallery', label: 'Gallery' },
  { type: 'hash', hash: 'shop', label: 'Shop' },
  { type: 'hash', hash: 'updates', label: 'Latest Updates' },
  { type: 'hash', hash: 'contact', label: 'Contact' },
  { type: 'route', to: '/admin/login', label: 'Admin' },
];

const NAV_OFFSET = 110;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToHash = (hash) => {
    const target = document.getElementById(hash);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleHashNavigation = (hash) => {
    if (location.pathname !== '/') {
      navigate(`/#${hash}`);
      return;
    }
    window.history.replaceState(null, '', `/#${hash}`);
    scrollToHash(hash);
  };

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 10;
    //   setScrolledLocal(s);
      dispatch(setNavScrolled(s));
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [dispatch]);

  useEffect(() => {
    if (!location.hash) return;
    const hash = location.hash.replace('#', '');
    const timer = setTimeout(() => {
      scrollToHash(hash);
    }, 60);
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav className="glass-nav mx-auto mt-3 flex h-11 w-[94%] max-w-3xl items-center justify-between rounded-2xl px-3 md:px-4">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/SD_Fitness.svg" alt="SD Fitness" className="h-6 w-6 rounded-full object-cover" />
        </Link>

        <div className="hidden items-center gap-4 text-[11px] font-medium uppercase tracking-wide md:flex">
          {links.map((link) => (
            <motion.div
              key={link.label}
              whileHover={{ y: -2 }}
              className="relative group cursor-pointer"
            >
              {link.type === 'route' ? (
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-brand-300' : 'text-slate-200/90'}`
                  }
                >
                  {link.label}
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={() => handleHashNavigation(link.hash)}
                  className="transition-colors text-slate-200/90 hover:text-brand-300"
                >
                  {link.label}
                </button>
              )}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-brand-500 to-pink-500 transition-all group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        <Link
          to="/register"
          className="hidden md:inline-flex items-center justify-center rounded-xl border border-brand-500/70 bg-brand-500/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm shadow-brand-500/40 hover:bg-brand-500"
          onClick={() => setOpen(false)}
        >
          Join Now
        </Link>

        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/70 border border-slate-700"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-slate-100" />
            <span className="block h-0.5 w-5 bg-slate-100" />
          </div>
        </button>
      </nav>

      {open && (
        <div className="md:hidden mt-2 mx-auto max-w-6xl px-4">
          <div className="glass-nav rounded-2xl p-3 flex flex-col gap-1">
            {links.map((link) => (
              link.type === 'route' ? (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm text-slate-100 hover:bg-slate-800/70"
                >
                  {link.label}
                </NavLink>
              ) : (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleHashNavigation(link.hash);
                  }}
                  className="px-3 py-2 rounded-xl text-left text-sm text-slate-100 hover:bg-slate-800/70"
                >
                  {link.label}
                </button>
              )
            ))}

            <NavLink
              to="/register"
              onClick={() => setOpen(false)}
              className="mt-1 px-3 py-2 rounded-xl text-sm font-semibold text-brand-100 bg-brand-500/20 border border-brand-500/60 hover:bg-brand-500/30"
            >
              Join Now
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
