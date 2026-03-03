import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Palette, Bell, Brain, Calendar, Globe, Link2,
  Shield, RefreshCw, Settings2, ChevronRight, Camera,
  Sun, Moon, Monitor, Check, AlertTriangle, Trash2,
  Download, LogOut, Plus, Zap, Clock, RefreshCcw,
  ChevronDown, ChevronUp, Keyboard, Webhook, Copy,
  Eye, EyeOff, Lock, Wifi, WifiOff, Database, HardDrive
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings, hashPassword, applyAccentColor } from '../context/SettingsContext';
import { useEventStore } from '../context/EventStore';

/* ══════ PRESET AVATARS ══════ */
const AVATAR_PRESETS = [
  { seed: 'Aurora',  style: 'adventurer' },
  { seed: 'Stellar', style: 'adventurer' },
  { seed: 'Nova',    style: 'adventurer' },
  { seed: 'Cosmos',  style: 'adventurer' },
  { seed: 'Pixel',   style: 'adventurer' },
  { seed: 'Ember',   style: 'adventurer' },
];
function avatarUrl(seed, style = 'adventurer') {
  return `https://api.dicebear.com/8.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

/* ══════ SHARED PRIMITIVES ══════ */
function Toggle({ enabled, onChange, size = 'md' }) {
  const w = size === 'sm' ? 'w-10 h-5' : 'w-12 h-6';
  const ballSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <motion.button onClick={() => onChange(!enabled)}
      className={`relative ${w} rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--brand-500)] ${enabled ? 'bg-[var(--brand-500)]' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-1 ${ballSize} rounded-full bg-white shadow-sm ${enabled ? 'left-auto right-1' : 'left-1'}`} />
    </motion.button>
  );
}

function Card({ title, description, children }) {
  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-2xl border border-slate-100 dark:border-[#2a2d3d] shadow-sm p-5 sm:p-6 space-y-4">
      {(title || description) && (
        <div className="pb-3 border-b border-slate-100 dark:border-[#2a2d3d]">
          {title && <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">{title}</h3>}
          {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function ToggleRow({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>}
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', readOnly, badge, placeholder }) {
  return (
    <div>
      {label && <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>}
      <div className="relative mt-1.5">
        <input type={type} readOnly={readOnly} value={value} onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] transition-colors ${readOnly ? 'bg-slate-100 dark:bg-[#252838] border-slate-200 dark:border-[#2a2d3d] text-slate-400 cursor-not-allowed' : 'bg-slate-50 dark:bg-[#1e2130] border-slate-200 dark:border-[#2a2d3d] text-slate-800 dark:text-slate-100'} ${badge ? 'pr-24' : ''}`} />
        {badge && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
    </div>
  );
}

function SaveBtn({ onClick, label = 'Save Changes' }) {
  const [saved, setSaved] = useState(false);
  const handle = () => { onClick?.(); setSaved(true); setTimeout(() => setSaved(false), 2200); };
  return (
    <motion.button onClick={handle} whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--brand-500)] to-violet-600 text-white rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition-opacity">
      {saved ? <><Check size={14} /> Saved!</> : label}
    </motion.button>
  );
}

/* ══════════════════ PROFILE SECTION ══════════════════ */
function ProfileSection() {
  const { profile, setProfile } = useSettings();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [bio, setBio] = useState(profile.bio);
  const [selectedPreset, setSelectedPreset] = useState(profile.avatarPreset ?? 0);
  const [customUrl, setCustomUrl] = useState(profile.avatarUrl);
  const fileRef = useRef();

  const currentAvatar = customUrl || avatarUrl(AVATAR_PRESETS[selectedPreset].seed, AVATAR_PRESETS[selectedPreset].style);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setCustomUrl(ev.target.result); setProfile({ avatarUrl: ev.target.result, avatarStyle: 'upload' }); };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setProfile({ name, email, phone, bio, avatarPreset: selectedPreset, avatarUrl: customUrl, avatarStyle: customUrl ? 'upload' : 'preset' });
  };

  return (
    <div className="space-y-4">
      <Card title="Profile Photo">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="relative group shrink-0">
            <img src={currentAvatar} alt="Avatar" className="w-20 h-20 rounded-full ring-4 ring-[var(--brand-100)] object-cover bg-slate-100" />
            <button onClick={() => fileRef.current?.click()}
              className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={18} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Choose Avatar</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_PRESETS.map((av, i) => (
                <button key={i} onClick={() => { setSelectedPreset(i); setCustomUrl(null); }}
                  className={`w-11 h-11 rounded-full overflow-hidden ring-2 transition-all ${selectedPreset === i && !customUrl ? 'ring-[var(--brand-500)] scale-110' : 'ring-transparent hover:scale-105'}`}>
                  <img src={avatarUrl(av.seed, av.style)} alt={av.seed} className="w-full h-full object-cover bg-slate-100" />
                </button>
              ))}
            </div>
            <button onClick={() => fileRef.current?.click()} className="mt-2 text-xs font-semibold text-[var(--brand-500)] hover:opacity-80">
              + Upload custom photo
            </button>
          </div>
        </div>
      </Card>
      <Card title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" value={name} onChange={setName} />
          <Input label="Email Address" value={email} onChange={setEmail} type="email" badge="✓ Verified" />
          <Input label="Phone Number" value={phone} onChange={setPhone} type="tel" />
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none" />
          </div>
        </div>
        <div className="flex justify-end pt-1"><SaveBtn onClick={handleSave} /></div>
      </Card>
    </div>
  );
}

/* ══════════════════ APPEARANCE SECTION ══════════════════ */
const ACCENT_COLORS = [
  { name: 'Violet',  value: '#8b5cf6' },
  { name: 'Indigo',  value: '#6366f1' },
  { name: 'Blue',    value: '#3b82f6' },
  { name: 'Teal',    value: '#14b8a6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose',    value: '#f43f5e' },
  { name: 'Amber',   value: '#f59e0b' },
  { name: 'Slate',   value: '#64748b' },
  { name: 'Pink',    value: '#ec4899' },
  { name: 'Orange',  value: '#f97316' },
];

function AppearanceSection() {
  const { theme, toggleTheme } = useTheme();
  const { appearance, setAppearance } = useSettings();

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark',  label: 'Dark',  icon: Moon },
    { id: 'system',label: 'System',icon: Monitor },
  ];

  return (
    <div className="space-y-4">
      <Card title="Theme" description="Choose how Aurora looks">
        <div className="flex gap-3">
          {themeOptions.map(opt => {
            const Icon = opt.icon;
            const active = opt.id === 'system' ? false : theme === opt.id;
            return (
              <button key={opt.id} onClick={() => { if (opt.id !== 'system' && theme !== opt.id) toggleTheme(); }}
                className={`flex-1 py-3 rounded-xl border-2 text-center transition-all ${active ? 'border-[var(--brand-500)] bg-[var(--brand-50)] dark:bg-[var(--brand-50)]' : 'border-slate-200 dark:border-[#2a2d3d] bg-slate-50 dark:bg-[#1e2130]'}`}>
                <Icon size={18} className={`mx-auto mb-1 ${active ? 'text-[var(--brand-500)]' : 'text-slate-400'}`} />
                <p className={`text-xs font-semibold ${active ? 'text-[var(--brand-500)]' : 'text-slate-500 dark:text-slate-400'}`}>{opt.label}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Accent Color" description="Applied instantly across the whole app">
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map(c => (
            <button key={c.value} onClick={() => { setAppearance({ accent: c.value }); applyAccentColor(c.value); }}
              title={c.name}
              style={{ backgroundColor: c.value }}
              className={`w-9 h-9 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${appearance.accent === c.value ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1a1d27] scale-110' : ''}`}
              >
              {appearance.accent === c.value && <Check size={14} className="text-white" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Custom hex:</label>
          <input type="color" value={appearance.accent}
            onChange={e => { setAppearance({ accent: e.target.value }); applyAccentColor(e.target.value); }}
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-[#2a2d3d] cursor-pointer" />
          <span className="text-xs font-mono text-slate-500">{appearance.accent}</span>
        </div>
      </Card>

      <Card title="Layout & Typography">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Font Size</p>
            <div className="flex gap-2">
              {['Compact', 'Comfortable', 'Spacious'].map(opt => (
                <button key={opt} onClick={() => setAppearance({ fontSize: opt })}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${appearance.fontSize === opt ? 'border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-500)]' : 'border-slate-200 dark:border-[#2a2d3d] text-slate-500 dark:bg-[#1e2130]'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Calendar Density</p>
            <div className="flex gap-2">
              {['Cozy', 'Balanced', 'Expanded'].map(opt => (
                <button key={opt} onClick={() => setAppearance({ density: opt })}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${appearance.density === opt ? 'border-[var(--brand-500)] bg-[var(--brand-50)] text-[var(--brand-500)]' : 'border-slate-200 dark:border-[#2a2d3d] text-slate-500 dark:bg-[#1e2130]'}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <ToggleRow label="Enable Animations" description="Motion and transition effects throughout the app"
            enabled={appearance.animations} onChange={v => setAppearance({ animations: v })} />
          <ToggleRow label="Reduce Motion" description="Minimal animations for accessibility"
            enabled={!appearance.animations} onChange={v => setAppearance({ animations: !v })} />
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════ NOTIFICATIONS SECTION ══════════════════ */
function NotificationsSection() {
  const { notifications, setNotifications, requestNotificationPermission, sendTestNotification } = useSettings();
  const [requesting, setRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setRequesting(true);
    await requestNotificationPermission();
    setRequesting(false);
  };

  const permColor = { granted: 'green', denied: 'red', default: 'amber' }[notifications.permission] || 'amber';
  const permLabel = { granted: '✓ Granted', denied: '✗ Denied', default: 'Not Set' }[notifications.permission];

  return (
    <div className="space-y-4">
      <Card title="Browser Push Notifications">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Permission Status</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${permColor}-50 dark:bg-${permColor}-900/20 text-${permColor}-600 dark:text-${permColor}-400 mt-1 inline-block`}>
              {permLabel}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {notifications.permission !== 'granted' && (
              <button onClick={handleRequestPermission} disabled={requesting || notifications.permission === 'denied'}
                className="px-4 py-2 bg-[var(--brand-500)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">
                {requesting ? 'Requesting...' : 'Enable Notifications'}
              </button>
            )}
            {notifications.permission === 'granted' && (
              <button onClick={() => sendTestNotification('🔔 Test Notification', 'Aurora notifications are working perfectly!')}
                className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-semibold rounded-xl hover:bg-green-100 transition-colors">
                Send Test
              </button>
            )}
          </div>
        </div>
        {notifications.permission === 'denied' && (
          <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30 mt-2">
            <p className="text-xs text-red-600 dark:text-red-400">Notifications blocked. Go to browser settings → Site Settings → Notifications to allow.</p>
          </div>
        )}
      </Card>

      <Card title="Notification Channels">
        <div className="space-y-3 divide-y divide-slate-100 dark:divide-[#2a2d3d]">
          <ToggleRow label="Event Reminders" description="Alerts before your events start"
            enabled={notifications.eventReminders} onChange={v => setNotifications({ eventReminders: v })} />
          <div className="pt-3"><ToggleRow label="Email Notifications" description="Updates via email"
            enabled={notifications.emailNotifs} onChange={v => setNotifications({ emailNotifs: v })} /></div>
          <div className="pt-3"><ToggleRow label="Push Notifications" description="Real-time browser notifications"
            enabled={notifications.pushNotifs && notifications.permission === 'granted'} onChange={v => setNotifications({ pushNotifs: v })} /></div>
          <div className="pt-3"><ToggleRow label="Smart Reminders" description="AI-adjusted timing based on your habits"
            enabled={notifications.smartReminders} onChange={v => setNotifications({ smartReminders: v })} /></div>
        </div>
      </Card>

      <Card title="Default Reminder Time">
        <div className="flex flex-wrap gap-2">
          {['5 min', '10 min', '15 min', '30 min', '1 hour'].map(t => (
            <button key={t} onClick={() => setNotifications({ reminderTime: t })}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${notifications.reminderTime === t ? 'bg-[var(--brand-500)] text-white border-[var(--brand-500)]' : 'border-slate-200 dark:border-[#2a2d3d] text-slate-600 dark:text-slate-300 dark:bg-[#1e2130]'}`}>
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Do Not Disturb" description="Silence all notifications during these hours">
        <ToggleRow label="Enable Do Not Disturb" enabled={notifications.dndEnabled} onChange={v => setNotifications({ dndEnabled: v })} />
        {notifications.dndEnabled && (
          <div className="flex items-center gap-3 flex-wrap mt-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Start</label>
              <input type="time" value={notifications.dndStart} onChange={e => setNotifications({ dndStart: e.target.value })}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]" />
            </div>
            <span className="text-slate-400 font-bold mt-4">→</span>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">End</label>
              <input type="time" value={notifications.dndEnd} onChange={e => setNotifications({ dndEnd: e.target.value })}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]" />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════ AI PREFERENCES SECTION ══════════════════ */
function AISection() {
  const { ai, setAi } = useSettings();
  return (
    <div className="space-y-4">
      <Card title="AI Features" description="Control which AI capabilities are active">
        <div className="space-y-3 divide-y divide-slate-100 dark:divide-[#2a2d3d]">
          <ToggleRow label="Smart Scheduler" description="AI finds optimal time slots for meetings" enabled={ai.smartScheduler} onChange={v => setAi({ smartScheduler: v })} />
          <div className="pt-3"><ToggleRow label="Focus Time Detection" description="Identifies deep-work windows from your patterns" enabled={ai.focusDetection} onChange={v => setAi({ focusDetection: v })} /></div>
          <div className="pt-3"><ToggleRow label="Auto Task Breakdown" description="Splits large tasks into timed subtasks" enabled={ai.autoTaskBreakdown} onChange={v => setAi({ autoTaskBreakdown: v })} /></div>
          <div className="pt-3"><ToggleRow label="Productivity Scoring" description="Weekly performance score and trend chart" enabled={ai.productivityScoring} onChange={v => setAi({ productivityScoring: v })} /></div>
          <div className="pt-3"><ToggleRow label="AI Data Learning" description="Aurora improves from your usage patterns" enabled={ai.aiLearning} onChange={v => setAi({ aiLearning: v })} /></div>
        </div>
      </Card>
      <Card title="Burnout Alert Sensitivity" description="How aggressively Aurora flags overload">
        <div className="flex gap-3">
          {['Low', 'Medium', 'High'].map(lvl => (
            <button key={lvl} onClick={() => setAi({ burnoutSensitivity: lvl })}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${
                ai.burnoutSensitivity === lvl
                  ? lvl === 'High' ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600'
                  : lvl === 'Medium' ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                  : 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-600'
                  : 'border-slate-200 dark:border-[#2a2d3d] text-slate-500 dark:bg-[#1e2130]'
              }`}>{lvl}</button>
          ))}
        </div>
      </Card>
      <Card>
        <div className="p-3 bg-[var(--brand-50)] rounded-xl border border-[var(--brand-100)]">
          <p className="text-xs text-[var(--brand-500)] dark:text-[var(--brand-400)]">🔒 AI processes calendar patterns locally or securely in the cloud. Your data is never sold or shared.</p>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════ CALENDAR SECTION ══════════════════ */
function CalendarSection() {
  const { calendar, setCalendar } = useSettings();
  return (
    <div className="space-y-4">
      <Card title="Display Options">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Default View', key: 'defaultView', opts: ['Month', 'Week', 'Day', 'Agenda'] },
            { label: 'Week Starts', key: 'weekStart', opts: ['Sunday', 'Monday'] },
            { label: 'Default Duration', key: 'eventDuration', opts: ['30 min', '1 hour', '2 hours'] },
            { label: 'Time Format', key: 'timeFormat', opts: ['12-hour', '24-hour'] },
          ].map(({ label, key, opts }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
              <select value={calendar[key]} onChange={e => setCalendar({ [key]: e.target.value })}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]">
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <ToggleRow label="Show Week Numbers" description="ISO week numbers shown on the calendar" enabled={calendar.showWeekNumbers} onChange={v => setCalendar({ showWeekNumbers: v })} />
      </Card>
      <Card title="Working Hours">
        <div className="flex items-center gap-3 flex-wrap">
          {[{ label: 'Start', key: 'workStart' }, { label: 'End', key: 'workEnd' }].map(({ label, key }, i) => (
            <div key={key}>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">{label}</label>
              <input type="time" value={calendar[key]} onChange={e => setCalendar({ [key]: e.target.value })}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]" />
              {i === 0 && <span className="text-slate-400 font-bold mx-2">→</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════ REGIONAL SECTION ══════════════════ */
const TIMEZONES = ['(UTC-08:00) Pacific Time', '(UTC-05:00) Eastern Time', '(UTC+00:00) London', '(UTC+01:00) Paris', '(UTC+03:00) Riyadh', '(UTC+05:00) Karachi', '(UTC+05:30) Mumbai', '(UTC+08:00) Beijing', '(UTC+09:00) Tokyo'];

function RegionalSection() {
  const { regional, setRegional } = useSettings();
  return (
    <div className="space-y-4">
      <Card title="Language & Format">
        <div className="space-y-4">
          {[
            { label: 'Language', key: 'language', opts: ['English', 'Urdu', 'Arabic', 'Chinese', 'French', 'Spanish', 'German'] },
            { label: 'Date Format', key: 'dateFormat', opts: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'D MMM YYYY'] },
          ].map(({ label, key, opts }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 shrink-0">{label}</p>
              <select value={regional[key]} onChange={e => setRegional({ [key]: e.target.value })}
                className="text-sm bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-700 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]">
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Timezone">
        <ToggleRow label="Auto-detect Timezone" enabled={regional.autoDetectTimezone} onChange={v => setRegional({ autoDetectTimezone: v })} />
        {!regional.autoDetectTimezone && (
          <select value={regional.timezone} onChange={e => setRegional({ timezone: e.target.value })}
            className="mt-3 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]">
            {TIMEZONES.map(t => <option key={t}>{t}</option>)}
          </select>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════ INTEGRATIONS SECTION ══════════════════ */
const APPS = [
  { id: 'google',  name: 'Google Calendar', logo: '🗓️', desc: 'Two-way sync with Google Calendar' },
  { id: 'outlook', name: 'Outlook / M365',  logo: '📧', desc: 'Microsoft 365 calendar sync' },
  { id: 'zoom',    name: 'Zoom',            logo: '📹', desc: 'Auto-join links on event start' },
  { id: 'slack',   name: 'Slack',           logo: '💬', desc: 'Status updates & reminders' },
  { id: 'notion',  name: 'Notion',          logo: '📝', desc: 'Sync tasks and project boards' },
];

function IntegrationsSection() {
  const { integrations, setIntegrations } = useSettings();
  const [apiVisible, setApiVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const apiKey = 'sk-aurora-a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="space-y-4">
      <Card title="Connected Apps">
        <div className="space-y-3">
          {APPS.map(app => (
            <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-100 dark:border-[#2a2d3d]">
              <div className="flex items-center gap-3">
                <span className="text-2xl w-10 h-10 rounded-xl bg-white dark:bg-[#252838] flex items-center justify-center shadow-sm">{app.logo}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{app.name}</p>
                  <p className="text-xs text-slate-400">{app.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations[app.id] && <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">Connected</span>}
                <button onClick={() => setIntegrations({ [app.id]: !integrations[app.id] })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${integrations[app.id] ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-[var(--brand-50)] text-[var(--brand-500)]'}`}>
                  {integrations[app.id] ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="API Key" description="Use this key to build custom integrations">
        <div className="flex items-center gap-2">
          <input readOnly value={apiVisible ? apiKey : '•'.repeat(36)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-600 dark:text-slate-300 text-sm font-mono" />
          <button onClick={() => setApiVisible(!apiVisible)} className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#252838] text-slate-600 dark:text-slate-300 text-sm font-semibold">
            {apiVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button onClick={copyKey} className="px-3 py-2.5 rounded-xl bg-[var(--brand-50)] text-[var(--brand-500)] text-sm font-semibold flex items-center gap-1">
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════ SECURITY SECTION ══════════════════ */
function SecuritySection() {
  const { security, setSecurity } = useSettings();
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { clearAllData } = useSettings();

  const handleChangePassword = async () => {
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
    const hash = await hashPassword(newPw);
    setSecurity({ passwordHash: hash });
    setPwError(''); setPwSuccess(true); setOldPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const revokeSession = (id) => setSecurity({ sessions: security.sessions.filter(s => s.id !== id) });
  const revokeAll = () => setSecurity({ sessions: security.sessions.filter(s => s.current) });

  return (
    <div className="space-y-4">
      <Card title="Change Password">
        <div className="space-y-3">
          {[
            { label: 'Current Password', val: oldPw, set: setOldPw },
            { label: 'New Password', val: newPw, set: setNewPw },
            { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
              <input type="password" value={val} onChange={e => set(e.target.value)}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]" />
            </div>
          ))}
          {pwError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={12} />{pwError}</p>}
          {pwSuccess && <p className="text-xs text-green-500 flex items-center gap-1"><Check size={12} />Password updated successfully!</p>}
          <div className="flex justify-end"><SaveBtn onClick={handleChangePassword} label="Update Password" /></div>
        </div>
      </Card>

      <Card title="Two-Factor Authentication" description="Extra layer of account security">
        <ToggleRow label="Enable 2FA (Authenticator App)" enabled={security.twoFA} onChange={v => setSecurity({ twoFA: v })} />
        {security.twoFA && (
          <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-900/30">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-2">Scan this code with Google Authenticator or Authy:</p>
            <div className="w-28 h-28 bg-white rounded-lg flex items-center justify-center border border-amber-200 mx-auto">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=otpauth://totp/Aurora?secret=JBSWY3DPEHPK3PXP&issuer=Aurora" alt="2FA QR" className="w-24 h-24" />
            </div>
            <p className="text-xs text-amber-600 text-center mt-2">Secret: JBSWY3DPEHPK3PXP</p>
          </div>
        )}
      </Card>

      <Card title="Active Sessions" description="Devices with access to your account">
        <div className="space-y-2">
          {security.sessions.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-100 dark:border-[#2a2d3d]">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  {s.device}
                  {s.current && <span className="text-[10px] bg-green-50 dark:bg-green-900/20 text-green-600 px-2 py-0.5 rounded-full font-bold">Current</span>}
                </p>
                <p className="text-xs text-slate-400">{s.location} · {s.time}</p>
              </div>
              {!s.current && (
                <button onClick={() => revokeSession(s.id)} className="text-xs text-red-500 font-semibold px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        {security.sessions.length > 1 && (
          <button onClick={revokeAll} className="w-full mt-2 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2">
            <LogOut size={14} /> Log Out All Other Sessions
          </button>
        )}
      </Card>

      <Card title="Data & Account">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => useSettings.exportData?.()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#252838] text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-200 transition-colors">
            <Download size={15} /> Export My Data
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors">
            <Trash2 size={15} /> Delete Account
          </button>
        </div>
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/50">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3"><AlertTriangle size={15} /> This will permanently delete all your data. Are you sure?</p>
              <div className="flex gap-2">
                <button onClick={() => { clearAllData(); setShowDeleteConfirm(false); }} className="px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg">Yes, delete everything</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-1.5 bg-white dark:bg-[#1e2130] text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-lg border border-slate-200 dark:border-[#2a2d3d]">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

/* ══════════════════ DATA & SYNC SECTION ══════════════════ */
function DataSyncSection() {
  const { dataSync, setDataSync, getStorageSize } = useSettings();
  const { clearAll } = useEventStore();
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState('Synced');
  const [storageSize, setStorageSize] = useState('');

  useEffect(() => { setStorageSize(getStorageSize()); }, [getStorageSize]);

  const manualSync = () => {
    setSyncing(true); setStatus('Syncing');
    setTimeout(() => {
      setSyncing(false); setStatus('Synced');
      setDataSync({ lastSynced: new Date().toISOString() });
    }, 2500);
  };

  const clearCache = () => {
    clearAll(); // Wipes ALL aurora_* localStorage keys + resets events and history state
    setTimeout(() => setStorageSize(getStorageSize()), 100); // Update display after state reset
  };

  const lastSync = new Date(dataSync.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${status === 'Synced' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
            <motion.div animate={syncing ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <RefreshCcw size={22} className={status === 'Synced' ? 'text-green-600' : 'text-blue-500'} />
            </motion.div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Status: <span className={status === 'Synced' ? 'text-green-600' : 'text-blue-500'}>{status}</span></p>
            <p className="text-xs text-slate-400 mt-0.5">Last synced today at {lastSync}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Storage Used</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{storageSize}</p>
          </div>
        </div>
      </Card>
      <Card title="Sync Controls">
        <ToggleRow label="Offline Mode" description="Use Aurora without internet" enabled={dataSync.offlineMode} onChange={v => setDataSync({ offlineMode: v })} />
        <ToggleRow label="Auto Sync" description="Sync automatically every 5 minutes" enabled={dataSync.autoSync} onChange={v => setDataSync({ autoSync: v })} />
        <div className="flex flex-wrap gap-3 pt-2">
          <button onClick={manualSync} disabled={syncing} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--brand-50)] text-[var(--brand-500)] font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity">
            <motion.div animate={syncing ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><RefreshCw size={15} /></motion.div>
            {syncing ? 'Syncing...' : 'Manual Sync'}
          </button>
          <button onClick={clearCache} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-semibold text-sm hover:bg-amber-100 transition-colors">
            <Trash2 size={15} /> Clear Cache
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════ ADVANCED SECTION ══════════════════ */
const SHORTCUTS = [
  { keys: '⌘ K', action: 'Open Command Palette' },
  { keys: '⌘ N', action: 'New Event' },
  { keys: '⌘ /', action: 'Toggle Sidebar' },
  { keys: '⌘ T', action: 'Toggle Theme' },
  { keys: 'G C', action: 'Go to Calendar' },
  { keys: 'G D', action: 'Go to Dashboard' },
  { keys: '?', action: 'Show Shortcuts' },
];

function AdvancedSection() {
  const { advanced, setAdvanced } = useSettings();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Card title="Experimental">
        <ToggleRow label="Beta Features" description="Access features before public release" enabled={advanced.betaFeatures} onChange={v => setAdvanced({ betaFeatures: v })} />
        {advanced.betaFeatures && (
          <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-900/30">
            <p className="text-xs text-amber-700 dark:text-amber-400">⚠️ Beta features may be unstable. Use at your own risk.</p>
          </div>
        )}
      </Card>
      <Card title="Power User">
        <div className="space-y-3">
          <ToggleRow label="Command Palette" description="Quick-access launcher (⌘K)" enabled={advanced.commandPalette} onChange={v => setAdvanced({ commandPalette: v })} />
          <ToggleRow label="Developer Mode" description="Show component outlines and debug info" enabled={advanced.developerMode} onChange={v => setAdvanced({ developerMode: v })} />
        </div>
      </Card>
      <Card title="Keyboard Shortcuts">
        <button onClick={() => setShortcutsOpen(!shortcutsOpen)}
          className="w-full flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[var(--brand-500)] transition-colors">
          <span className="flex items-center gap-2"><Keyboard size={15} /> View all shortcuts</span>
          {shortcutsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        <AnimatePresence>
          {shortcutsOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3 space-y-2">
                {SHORTCUTS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{s.action}</span>
                    <kbd className="px-2.5 py-1 bg-slate-100 dark:bg-[#252838] text-slate-600 dark:text-slate-300 text-xs font-mono rounded-lg border border-slate-200 dark:border-[#2a2d3d]">{s.keys}</kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      <Card title="Webhooks" description="Send Aurora events to external URLs">
        <div className="space-y-3">
          <input value={advanced.webhookUrl} onChange={e => setAdvanced({ webhookUrl: e.target.value })}
            placeholder="https://your-server.com/webhook"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-200 dark:border-[#2a2d3d] text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]" />
          <div className="flex justify-end"><SaveBtn onClick={() => {}} label="Save Webhook" /></div>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════ MAIN SETTINGS PAGE ══════════════════ */
const NAV = [
  { id: 'profile',       label: 'Profile',           icon: User,      Section: ProfileSection },
  { id: 'appearance',    label: 'Appearance',         icon: Palette,   Section: AppearanceSection },
  { id: 'notifications', label: 'Notifications',      icon: Bell,      Section: NotificationsSection },
  { id: 'ai',            label: 'AI Preferences',     icon: Brain,     Section: AISection },
  { id: 'calendar',      label: 'Calendar',           icon: Calendar,  Section: CalendarSection },
  { id: 'regional',      label: 'Regional',           icon: Globe,     Section: RegionalSection },
  { id: 'integrations',  label: 'Integrations',       icon: Link2,     Section: IntegrationsSection },
  { id: 'security',      label: 'Security & Privacy', icon: Shield,    Section: SecuritySection },
  { id: 'data',          label: 'Data & Sync',        icon: Database,  Section: DataSyncSection },
  { id: 'advanced',      label: 'Advanced',           icon: Settings2, Section: AdvancedSection },
];

export default function SettingsPage() {
  const [active, setActive] = useState('profile');
  const current = NAV.find(n => n.id === active);
  const { exportData } = useSettings();

  return (
    <div className="h-full flex gap-0 sm:gap-5 overflow-hidden">
      {/* Sidebar nav */}
      <aside className="hidden sm:flex w-[180px] lg:w-[210px] shrink-0 flex-col gap-0.5 overflow-y-auto no-scrollbar">
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all w-full group ${isActive ? 'bg-[var(--brand-50)] text-[var(--brand-500)] font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1e2130]'}`}>
              <Icon size={16} className={isActive ? 'text-[var(--brand-500)]' : 'text-slate-400'} />
              <span className="text-xs sm:text-sm truncate">{item.label}</span>
              {isActive && <ChevronRight size={12} className="ml-auto shrink-0 text-[var(--brand-400)]" />}
            </button>
          );
        })}
      </aside>

      {/* Content area */}
      <div className="flex-1 min-w-0 overflow-y-auto no-scrollbar pb-8">
        {/* Mobile dropdown */}
        <div className="sm:hidden mb-4">
          <select value={active} onChange={e => setActive(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3d] text-slate-700 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]">
            {NAV.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">{current?.label}</h2>
          {active === 'security' && (
            <button onClick={exportData} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#252838] text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors">
              <Download size={13} /> Export Data
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {current && <current.Section />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
