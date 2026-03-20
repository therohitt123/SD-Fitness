export default function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4">
      <div className="grid gap-8 md:grid-cols-[1.3fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">About SD Fitness</h2>
          <p className="text-sm text-slate-300">
            Founded by coach SD, our mission is simple – build a gym that feels like a second home for
            serious lifters and first-timers alike.
          </p>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-400">
              Owner
            </p>
            <p className="font-medium">Coach SD</p>
            <p className="text-xs text-slate-400">
              Strength & Conditioning Specialist, 10+ years transforming physiques across all age groups.
            </p>
          </div>
          <div className="space-y-3 text-xs text-slate-300">
            <p className="font-semibold text-slate-200">Our Story</p>
            <ol className="space-y-2 border-l border-slate-700 pl-4">
              <li>
                <span className="block text-[11px] text-slate-400">2015</span>
                First SD Fitness studio opens with 40 members.
              </li>
              <li>
                <span className="block text-[11px] text-slate-400">2019</span>
                Expansion to a fully equipped strength & conditioning facility.
              </li>
              <li>
                <span className="block text-[11px] text-slate-400">Today</span>
                Hundreds of active members and an elite training team.
              </li>
            </ol>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Facilities
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-200">
              <Facility label="Strength Zone" />
              <Facility label="Cardio Deck" />
              <Facility label="Functional Turf" />
              <Facility label="Personal Training" />
              <Facility label="Locker Rooms" />
              <Facility label="Juice & Snack Bar" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Opening Hours
            </p>
            <div className="space-y-1 text-slate-200">
              <p>Mon – Sat: 5:30 AM – 10:30 AM</p>
              <p>Mon – Sat: 5:30 PM – 10:30 PM</p>
              <p>Sunday: leave</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Facility({ label }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px]">
        ✓
      </span>
      <span>{label}</span>
    </div>
  );
}
