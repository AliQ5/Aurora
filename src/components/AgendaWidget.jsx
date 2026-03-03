import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, MapPin, Check, Clock, Trash2, RotateCcw, CalendarPlus } from 'lucide-react';
import { useEventStore } from '../context/EventStore';
import { useLocale } from '../context/LocaleContext';

const COLOR_MAP = {
  purple: { bg: 'bg-[#e2dfff] dark:bg-purple-900/20', border: 'border-[#c9c4ff] dark:border-purple-800/30', time: 'text-brand-500', dot: 'bg-brand-500' },
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-100 dark:border-blue-800/30',   time: 'text-blue-500',  dot: 'bg-blue-500' },
  green:  { bg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-100 dark:border-green-800/30', time: 'text-green-500', dot: 'bg-green-500' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-100 dark:border-amber-800/30', time: 'text-amber-500', dot: 'bg-amber-500' },
  red:    { bg: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-100 dark:border-red-800/30',     time: 'text-red-500',   dot: 'bg-red-500' },
};

export default function AgendaWidget() {
  const { todayEvents, upcomingEvents, markDone, undoDone, deleteEvent } = useEventStore();
  const { t } = useLocale();
  const [now, setNow] = useState(new Date());
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Tick every 30 seconds to update the "now" line
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(tick);
  }, []);

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowStr  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const dateLabel = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const timeToMins = (t) => { const [h, m] = t.split(':').map(Number); return h*60+m; };
  const nowInsertAt = todayEvents.findIndex(ev => timeToMins(ev.startTime) > nowMins);
  const insertIdx = nowInsertAt === -1 ? todayEvents.length : nowInsertAt;

  // Format time for display
  const fmt = (t) => {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 || 12;
    return `${hh}:${String(m).padStart(2,'0')} ${suffix}`;
  };

  const isActive = (ev) => {
    const s = timeToMins(ev.startTime);
    const e = timeToMins(ev.endTime);
    return nowMins >= s && nowMins < e;
  };

  const isEmpty = todayEvents.length === 0 && upcomingEvents.length === 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-5 shrink-0">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {t('label_schedule')}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-slate-500 font-medium">{dateLabel}</span>
          <span className="text-[10px] sm:text-xs text-brand-500 font-semibold bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-lg">
            {todayEvents.length} {t('label_events')}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-3 sm:space-y-4 no-scrollbar">
        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
              <CalendarPlus size={24} className="text-brand-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t('label_no_events')}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600">Use the + button to add one</p>
          </div>
        )}

        {/* Today's events */}
        {todayEvents.map((event, i) => {
          const c = COLOR_MAP[event.color] || COLOR_MAP.purple;
          const active = isActive(event);
          const past = nowMins > timeToMins(event.endTime) && !event.done;

          return (
            <div key={event.id}>
              {/* NOW line injection */}
              {i === insertIdx && (
                <div className="flex items-center gap-2 -ml-1 my-2 sm:my-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-50 dark:ring-red-900/20 shrink-0 animate-pulse" />
                  <div className="h-[2px] flex-1 bg-red-400/30" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-red-400 shrink-0 flex items-center gap-1">
                    <Clock size={10} /> {t('label_now')} {fmt(nowStr)}
                  </span>
                </div>
              )}

              <AnimatePresence>
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: event.done ? 0.4 : 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                  className={`flex gap-3 sm:gap-4 group ${past && !event.done ? 'opacity-40' : ''}`}
                >
                  {/* Time column */}
                  <div className="flex flex-col items-center shrink-0 pt-1 w-12">
                    <span className={`text-[10px] sm:text-xs font-bold ${active ? 'text-brand-500' : 'text-slate-400 dark:text-slate-500'}`}>
                      {fmt(event.startTime)}
                    </span>
                    {i < todayEvents.length - 1 && (
                      <div className={`w-[2px] flex-1 my-1 rounded-full ${active ? 'bg-brand-300' : 'bg-slate-100 dark:bg-slate-800'}`} />
                    )}
                  </div>

                  {/* Event card */}
                  <div className={`${c.bg} rounded-xl sm:rounded-2xl p-3 sm:p-4 flex-1 shadow-sm border ${c.border} transition-all ${active ? 'ring-2 ring-brand-400/30 shadow-brand-200 dark:shadow-brand-900/20' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm sm:text-[15px] font-bold text-slate-800 dark:text-slate-100 ${event.done ? 'line-through' : ''}`}>
                            {event.title}
                          </p>
                          {active && (
                            <span className="text-[9px] font-black text-white bg-brand-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                              LIVE
                            </span>
                          )}
                          {event.done && (
                            <span className="text-[9px] font-black text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full uppercase">
                              ✓ Done
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                            {fmt(event.startTime)} – {fmt(event.endTime)} · {event.duration}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                              {event.location.includes('Zoom') || event.location.includes('Meet')
                                ? <Video size={10} /> : <MapPin size={10} />}
                              {event.location}
                            </span>
                          )}
                        </div>
                        {event.attendees?.length > 0 && (
                          <div className="flex items-center gap-1 mt-1.5">
                            {event.attendees.slice(0,3).map((a, idx) => (
                              <span key={idx} className="text-[9px] bg-white/70 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full font-medium">{a}</span>
                            ))}
                            {event.attendees.length > 3 && (
                              <span className="text-[9px] text-slate-400">+{event.attendees.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-1.5 items-end shrink-0">
                        {!event.done ? (
                          <button onClick={() => markDone(event.id)}
                            className="w-7 h-7 rounded-lg bg-white/80 dark:bg-white/10 flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 text-slate-400 transition-colors shadow-sm"
                            title="Mark as done">
                            <Check size={13} />
                          </button>
                        ) : (
                          <button onClick={() => undoDone(event.id)}
                            className="w-7 h-7 rounded-lg bg-white/80 dark:bg-white/10 flex items-center justify-center hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-colors shadow-sm"
                            title="Undo">
                            <RotateCcw size={13} />
                          </button>
                        )}
                        {confirmDelete === event.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => { deleteEvent(event.id); setConfirmDelete(null); }}
                              className="text-[10px] px-1.5 py-1 bg-red-500 text-white rounded-lg font-bold">✕</button>
                            <button onClick={() => setConfirmDelete(null)}
                              className="text-[10px] px-1.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 rounded-lg font-bold">↩</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(event.id)}
                            className="w-7 h-7 rounded-lg bg-white/80 dark:bg-white/10 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 hover:text-red-400 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                            title="Delete">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })}

        {/* NOW line at end if all events are past */}
        {insertIdx === todayEvents.length && todayEvents.length > 0 && (
          <div className="flex items-center gap-2 -ml-1 mt-2">
            <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-50 dark:ring-red-900/20 shrink-0 animate-pulse" />
            <div className="h-[2px] flex-1 bg-red-400/30" />
            <span className="text-[10px] font-bold text-red-400 shrink-0">{t('label_now')} {fmt(nowStr)}</span>
          </div>
        )}

        {/* Upcoming events (future days) */}
        {upcomingEvents.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-[#2a2d3d]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Upcoming</p>
            {upcomingEvents.slice(0, 3).map(ev => (
              <div key={ev.id} className="flex items-center gap-3 py-2 group">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${(COLOR_MAP[ev.color] || COLOR_MAP.purple).dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{ev.title}</p>
                  <p className="text-[10px] text-slate-400">{ev.date} · {fmt(ev.startTime)}</p>
                </div>
                <button onClick={() => deleteEvent(ev.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all">
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
