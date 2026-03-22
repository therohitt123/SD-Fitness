export default function Loader() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="loader">
        <div className="box">
          <div className="logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 120 94"
              className="svg"
            >
              <path d="M12 24C12 16 18 12 28 12H48C58 12 64 16 64 24V32H48V28C48 26 46 24 42 24H30C26 24 24 26 24 28V32C24 34 26 36 32 38L48 42C58 46 64 50 64 58V66C64 74 58 78 48 78H28C18 78 12 74 12 66V58H28V62C28 64 30 66 34 66H42C46 66 48 64 48 62V58C48 56 46 54 40 52L24 48C18 46 12 42 12 34V24Z" />

              <path d="M70 12H84C100 12 110 20 110 46C110 72 100 80 84 80H70V12ZM80 24V68H86C94 68 100 62 100 46C100 30 94 24 86 24H80Z" />
            </svg>
          </div>
        </div>
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
      </div>
      <span className="text-xs tracking-[0.35em] uppercase text-slate-400 Orbitfont">Fitness</span>
    </div>
  );
}
