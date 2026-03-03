import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, BellRing, Volume2 } from 'lucide-react';
import { useEventStore } from '../../context/EventStore';
import { useSettings } from '../../context/SettingsContext';

function timeToMins(t) { const [h,m]=(t||'0:0').split(':').map(Number); return h*60+m; }
function fmtTime(mins) { const h=Math.floor(mins/60)%24, m=mins%60; const s=h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${s}`; }

export default function SmartReminders() {
  const { events } = useEventStore();
  const { notifications, sendTestNotification } = useSettings();
  const [dismissed, setDismissed] = useState(new Set());

  const reminders = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const nowMins  = now.getHours() * 60 + now.getMinutes();

    const today = events
      .filter(e => e.date === todayStr && !e.done)
      .sort((a,b) => a.startTime.localeCompare(b.startTime));

    // Parse reminder time preference
    const remTime = notifications?.reminderTime || '15 min';
    const remMins = parseInt(remTime) || 15;

    return today.map(ev => {
      const startMins = timeToMins(ev.startTime);
      const minsUntil = startMins - nowMins;
      const reminderAt = startMins - remMins;
      const isActive = minsUntil > 0 && minsUntil <= remMins;
      const isPast = minsUntil <= 0;
      const isSoon = minsUntil > 0 && minsUntil <= 30;

      return {
        ...ev,
        minsUntil,
        reminderAt,
        isActive,
        isPast,
        isSoon,
        reminderLabel: isActive ? `Starting in ${minsUntil} min!` : isPast ? 'Ongoing or passed' : `In ${minsUntil} min`,
      };
    }).filter(e => !e.isPast);
  }, [events, notifications]);

  // Send browser notification for imminent events
  useEffect(() => {
    if (notifications?.permission !== 'granted' || !notifications?.pushNotifs) return;

    reminders.forEach(r => {
      if (r.isActive && !dismissed.has(r.id)) {
        sendTestNotification?.(`⏰ ${r.title}`, `Starting in ${r.minsUntil} minutes! ${r.location ? '📍 ' + r.location : ''}`);
        setDismissed(prev => new Set([...prev, r.id]));
      }
    });
  }, [reminders, notifications, dismissed, sendTestNotification]);

  const nextEvent = reminders[0];

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-xl sm:rounded-2xl border border-slate-100 dark:border-[#2a2d3d] shadow-premium p-4 sm:p-5 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={16} className="text-brand-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Smart Reminders</h3>
      </div>

      {/* Next up card */}
      {nextEvent ? (
        <div className={`rounded-xl p-3 mb-3 ${nextEvent.isActive ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-slate-50 dark:bg-[#1e2130]'}`}>
          <div className="flex items-center gap-2">
            {nextEvent.isActive && <BellRing size={14} className="text-amber-500 animate-bounce" />}
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Next Up</p>
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">{nextEvent.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><Clock size={9} /> {fmtTime(timeToMins(nextEvent.startTime))}</span>
            {nextEvent.location && <span className="text-[10px] text-slate-400">📍 {nextEvent.location}</span>}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${nextEvent.isActive ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-slate-100 dark:bg-[#252838] text-slate-500'}`}>
              {nextEvent.reminderLabel}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-2xl mb-1">🎉</p>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">All caught up!</p>
          <p className="text-xs text-slate-400 mt-1">No upcoming events remaining today</p>
        </div>
      )}

      {/* Upcoming list */}
      {reminders.length > 1 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Later Today</p>
          {reminders.slice(1, 4).map(r => (
            <div key={r.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1e2130] transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-300 flex-1 truncate">{r.title}</span>
              <span className="text-[10px] font-semibold text-slate-400 shrink-0">{fmtTime(timeToMins(r.startTime))}</span>
            </div>
          ))}
        </div>
      )}

      {/* Notification status */}
      <div className="mt-3 flex items-center gap-2 bg-slate-50 dark:bg-[#1e2130] rounded-lg p-2">
        <Volume2 size={11} className={notifications?.permission === 'granted' ? 'text-green-500' : 'text-slate-400'} />
        <span className="text-[10px] text-slate-500 dark:text-slate-400">
          {notifications?.permission === 'granted' ? '🔔 Push notifications active' : '🔕 Enable notifications in Settings'}
        </span>
      </div>
    </div>
  );
}
