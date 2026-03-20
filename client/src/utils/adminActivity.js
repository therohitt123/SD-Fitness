const STORAGE_KEY = 'sd_admin_activity_log';

const readLog = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getAdminActivityLog = () => readLog();

export const pushAdminActivity = (action, meta = {}) => {
  if (typeof window === 'undefined') return;
  const next = [
    {
      id: Date.now().toString(36),
      action,
      meta,
      createdAt: new Date().toISOString(),
    },
    ...readLog(),
  ].slice(0, 60);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};
