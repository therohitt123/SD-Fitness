import { Link } from 'react-router-dom';

const socialLinks = [
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5Zm8.9 1.8a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      </svg>
    ),
  },
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-7h2.4l.6-3h-3V9.4c0-.9.4-1.4 1.5-1.4h1.6V5.3c-.8-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4.1V11H8v3h2.4v7h3.1Z" />
      </svg>
    ),
  },
  {
    href: 'https://youtube.com',
    label: 'YouTube',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2c.4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800 bg-slate-950/95">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1.2fr,1fr,1fr]">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3">
            <img src="/SD_Fitness.svg" alt="SD Fitness" className="h-14 w-14 object-contain" />
            <div>
              <p className="text-base font-semibold text-slate-100">SD Fitness</p>
              <p className="text-xs text-slate-400">Gym and Wellness</p>
            </div>
          </div>
          <p className="max-w-sm text-xs text-slate-500">Train hard. Recover smart. Transform daily with expert coaches and premium gym facilities.</p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Quick Links</p>
          <div className="space-y-2 text-sm">
            <a href="/#about" className="block text-slate-300 hover:text-brand-300">About</a>
            <a href="/#plans" className="block text-slate-300 hover:text-brand-300">Membership Plans</a>
            <a href="/#shop" className="block text-slate-300 hover:text-brand-300">Shop Showcase</a>
            <Link to="/admin/login" className="block text-slate-300 hover:text-brand-300">Admin Login</Link>
            <Link to="/trainer/login" className="block text-slate-300 hover:text-brand-300">Trainer Login</Link>
            <a href="/#contact" className="block text-slate-300 hover:text-brand-300">Contact</a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Follow Us</p>
          <p className="mb-3 text-xs text-slate-500">Stay connected for fitness tips, updates and offers.</p>
          <div className="flex items-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-brand-400 hover:text-brand-300"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} SD Fitness. All rights reserved.
      </div>
    </footer>
  );
}
