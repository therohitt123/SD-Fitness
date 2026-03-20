import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const navItems = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/slider', label: 'Slider' },
  { to: '/admin/trainers', label: 'Trainers' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/shop', label: 'Shop' },
  { to: '/admin/plans', label: 'Memberships' },
  { to: '/admin/updates', label: 'Updates' },
  { to: '/admin/contacts', label: 'Contacts' },
  { to: '/admin/gym-info', label: 'Gym Info' },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/members', label: 'Members' },
];

export default function AdminDashboardLayout() {
  const dispatch = useDispatch();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl gap-6 px-4 pt-24 md:h-screen md:overflow-hidden">
      <aside className="sticky top-24 hidden h-[calc(100vh-6rem)] w-56 flex-col gap-2 overflow-y-auto scrollbar-hide rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm md:flex">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Admin Panel
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 transition-colors ${
                isActive ? 'bg-brand-500/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800/80'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={() => dispatch(logout())}
          className="mt-4 rounded-xl px-3 py-2 text-left text-slate-400 hover:bg-red-500/10 hover:text-red-300"
        >
          Log out
        </button>
      </aside>
      <main className="w-full flex-1 space-y-4 pb-6 md:h-[calc(100vh-6rem)] md:overflow-y-auto md:scrollbar-hide md:pr-1">
        <div className="md:hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-2">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Admin Panel</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-3 py-2 text-xs transition-colors ${
                    isActive ? 'bg-brand-500/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800/80'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={() => dispatch(logout())}
              className="whitespace-nowrap rounded-xl px-3 py-2 text-xs text-slate-400 hover:bg-red-500/10 hover:text-red-300"
            >
              Log out
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
