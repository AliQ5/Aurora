import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SettingsContext = createContext(null);

// ─── Defaults ─────────────────────────────────
const DEFAULTS = {
  // Profile
  profile: {
    name: 'Alex Doe',
    age: '',
    country: '',
    language: 'English',
    email: 'alex.doe@aurora.ai',
    phone: '+1 (555) 000-0000',
    bio: 'Product designer and developer. Building Aurora v2.',
    avatarSeed: 'Alex',
    avatarStyle: 'preset', // 'preset' | 'upload'
    avatarPreset: 0,
    avatarUrl: null,
  },
  // Appearance
  appearance: {
    accent: '#8b5cf6',
    fontSize: 'Comfortable',
    density: 'Balanced',
    animations: true,
  },
  // Notifications
  notifications: {
    permission: 'default', // 'granted' | 'denied' | 'default'
    eventReminders: true,
    emailNotifs: true,
    pushNotifs: false,
    smartReminders: true,
    reminderTime: '15 min',
    dndEnabled: false,
    dndStart: '22:00',
    dndEnd: '07:00',
  },
  // AI Preferences
  ai: {
    smartScheduler: true,
    focusDetection: true,
    autoTaskBreakdown: true,
    productivityScoring: true,
    aiLearning: true,
    burnoutSensitivity: 'Medium',
  },
  // Calendar
  calendar: {
    defaultView: 'Week',
    weekStart: 'Monday',
    eventDuration: '1 hour',
    timeFormat: '12-hour',
    workStart: '09:00',
    workEnd: '17:00',
    showWeekNumbers: false,
  },
  // Regional
  regional: {
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    timezone: '(UTC+05:00) Karachi',
    autoDetectTimezone: true,
  },
  // Integrations
  integrations: {
    google: true,
    outlook: false,
    zoom: true,
    slack: false,
    notion: false,
  },
  // Security
  security: {
    passwordHash: '',
    twoFA: false,
    sessions: [
      { id: 's1', device: 'MacBook Pro 16"', location: 'Karachi, PK', time: 'Now', current: true, ua: 'Mac' },
      { id: 's2', device: 'iPhone 15 Pro',   location: 'Karachi, PK', time: '2 hours ago', current: false, ua: 'iPhone' },
      { id: 's3', device: 'Chrome / Windows',location: 'Lahore, PK',  time: '3 days ago',  current: false, ua: 'Win' },
    ],
  },
  // Data & Sync
  dataSync: {
    lastSynced: new Date().toISOString(),
    offlineMode: false,
    autoSync: true,
  },
  // Advanced
  advanced: {
    betaFeatures: false,
    commandPalette: true,
    developerMode: false,
    webhookUrl: '',
  },
};

// ─── Helpers ──────────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(`aurora_settings_${key}`);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(`aurora_settings_${key}`, JSON.stringify(value)); } catch {}
}

export async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function applyAccentColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const root = document.documentElement;
  root.style.setProperty('--brand-500', hex);
  root.style.setProperty('--brand-rgb', `${r} ${g} ${b}`);
  // Lighter and darker shades
  root.style.setProperty('--brand-50',  `rgba(${r},${g},${b},0.08)`);
  root.style.setProperty('--brand-100', `rgba(${r},${g},${b},0.15)`);
  root.style.setProperty('--brand-400', `rgba(${r},${g},${b},0.85)`);
  root.style.setProperty('--brand-600', `rgba(${r - 20 < 0 ? 0 : r - 20},${g - 20 < 0 ? 0 : g - 20},${b - 20 < 0 ? 0 : b - 20},1)`);
}

export function applyFontSize(size) {
  const cls = { Compact: 'text-sm-base', Comfortable: '', Spacious: 'text-lg-base' };
  document.documentElement.classList.remove('text-sm-base', 'text-lg-base');
  if (cls[size]) document.documentElement.classList.add(cls[size]);
}

export function isInDND(dndStart, dndEnd) {
  const now = new Date();
  const [sh, sm] = dndStart.split(':').map(Number);
  const [eh, em] = dndEnd.split(':').map(Number);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  if (startMin > endMin) return nowMin >= startMin || nowMin < endMin;
  return nowMin >= startMin && nowMin < endMin;
}

// ─── Provider ─────────────────────────────────
export function SettingsProvider({ children }) {
  const [profile, _setProfile] = useState(() => load('profile', DEFAULTS.profile));
  const [appearance, _setAppearance] = useState(() => load('appearance', DEFAULTS.appearance));
  const [notifications, _setNotifications] = useState(() => load('notifications', DEFAULTS.notifications));
  const [ai, _setAi] = useState(() => load('ai', DEFAULTS.ai));
  const [calendar, _setCalendar] = useState(() => load('calendar', DEFAULTS.calendar));
  const [regional, _setRegional] = useState(() => load('regional', DEFAULTS.regional));
  const [integrations, _setIntegrations] = useState(() => load('integrations', DEFAULTS.integrations));
  const [security, _setSecurity] = useState(() => load('security', DEFAULTS.security));
  const [dataSync, _setDataSync] = useState(() => load('dataSync', DEFAULTS.dataSync));
  const [advanced, _setAdvanced] = useState(() => load('advanced', DEFAULTS.advanced));

  // Patchers (merge + persist)
  const setProfile = useCallback(patch => _setProfile(p => { const n = { ...p, ...patch }; save('profile', n); return n; }), []);
  const setAppearance = useCallback(patch => _setAppearance(p => { const n = { ...p, ...patch }; save('appearance', n); return n; }), []);
  const setNotifications = useCallback(patch => _setNotifications(p => { const n = { ...p, ...patch }; save('notifications', n); return n; }), []);
  const setAi = useCallback(patch => _setAi(p => { const n = { ...p, ...patch }; save('ai', n); return n; }), []);
  const setCalendar = useCallback(patch => _setCalendar(p => { const n = { ...p, ...patch }; save('calendar', n); return n; }), []);
  const setRegional = useCallback(patch => _setRegional(p => { const n = { ...p, ...patch }; save('regional', n); return n; }), []);
  const setIntegrations = useCallback(patch => _setIntegrations(p => { const n = { ...p, ...patch }; save('integrations', n); return n; }), []);
  const setSecurity = useCallback(patch => _setSecurity(p => { const n = { ...p, ...patch }; save('security', n); return n; }), []);
  const setDataSync = useCallback(patch => _setDataSync(p => { const n = { ...p, ...patch }; save('dataSync', n); return n; }), []);
  const setAdvanced = useCallback(patch => _setAdvanced(p => { const n = { ...p, ...patch }; save('advanced', n); return n; }), []);

  // Apply accent color on mount + change
  useEffect(() => { applyAccentColor(appearance.accent); }, [appearance.accent]);
  useEffect(() => { applyFontSize(appearance.fontSize); }, [appearance.fontSize]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return 'denied';
    const perm = await Notification.requestPermission();
    setNotifications({ permission: perm, pushNotifs: perm === 'granted' });
    return perm;
  }, [setNotifications]);

  // Send a test browser notification
  const sendTestNotification = useCallback((title = 'Aurora Reminder', body = 'This is a test notification from Aurora') => {
    if (Notification.permission !== 'granted') return;
    const n = new Notification(title, {
      body,
      icon: '/logo-rounded.png',
      badge: '/logo-rounded.png',
      tag: 'aurora-test',
    });
    setTimeout(() => n.close(), 5000);
  }, []);

  // Smart event reminder (call this before an event)
  const sendEventReminder = useCallback((eventTitle, minutesBefore) => {
    if (!notifications.pushNotifs || Notification.permission !== 'granted') return;
    if (notifications.dndEnabled && isInDND(notifications.dndStart, notifications.dndEnd)) return;
    new Notification(`⏰ ${eventTitle}`, {
      body: `Starting in ${minutesBefore} minutes`,
      icon: '/logo-rounded.png',
      tag: `aurora-event-${eventTitle}`,
    });
  }, [notifications]);

  // Export all data as JSON
  const exportData = useCallback(() => {
    const data = { profile, appearance, notifications, ai, calendar, regional, integrations, security: { ...security, passwordHash: '***' }, dataSync, advanced, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'aurora-data-export.json'; a.click();
    URL.revokeObjectURL(url);
  }, [profile, appearance, notifications, ai, calendar, regional, integrations, security, dataSync, advanced]);

  // Clear all settings (delete account)
  const clearAllData = useCallback(() => {
    Object.keys(DEFAULTS).forEach(k => localStorage.removeItem(`aurora_settings_${k}`));
    localStorage.removeItem('aurora_onboarded');
    localStorage.removeItem('aurora_settings_password');
    Object.keys(DEFAULTS).forEach(k => {
      const setter = { profile: _setProfile, appearance: _setAppearance, notifications: _setNotifications, ai: _setAi, calendar: _setCalendar, regional: _setRegional, integrations: _setIntegrations, security: _setSecurity, dataSync: _setDataSync, advanced: _setAdvanced }[k];
      if (setter) setter(DEFAULTS[k]);
    });
  }, []);

  // Local storage size utility
  const getStorageSize = useCallback(() => {
    let total = 0;
    for (const key in localStorage) {
      if (key.startsWith('aurora_')) total += (localStorage[key].length * 2);
    }
    return (total / 1024).toFixed(1) + ' KB';
  }, []);

  const value = {
    profile, setProfile,
    appearance, setAppearance,
    notifications, setNotifications,
    ai, setAi,
    calendar, setCalendar,
    regional, setRegional,
    integrations, setIntegrations,
    security, setSecurity,
    dataSync, setDataSync,
    advanced, setAdvanced,
    requestNotificationPermission,
    sendTestNotification,
    sendEventReminder,
    exportData,
    clearAllData,
    getStorageSize,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
