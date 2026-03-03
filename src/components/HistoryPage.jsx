import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History, CalendarCheck, CheckSquare, Trash2, Search,
  ChevronDown, ChevronUp, Filter, AlertTriangle, Clock,
  Briefcase, Heart, Users, User, X
} from 'lucide-react';
import { useEventStore } from '../context/EventStore';

// Category → icon / color
const CAT_META = {
  work:     { icon: Briefcase, color: 'text-brand-500',  bg: 'bg-brand-50 dark:bg-brand-900/20' },
  personal: { icon: User,      color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20' },
  health:   { icon: Heart,     color: 'text-pink-500',   bg: 'bg-pink-50 dark:bg-pink-900/20' },
  social:   { icon: Users,     color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20' },
};

const SUBSECTIONS = [
  { id: 'all',      label: 'All History',   icon: History },
  { id: 'work',     label: 'Work',          icon: Briefcase },
  { id: 'personal', label: 'Personal',      icon: User },
  { id: 'health',   label: 'Health',        icon: Heart },
  { id: 'social',   label: 'Social',        icon: Users },
];

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function EmptyHistory({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-[#1e2130] flex items-center justify-center">
        <History size={28} className="text-slate-300 dark:text-slate-600" />
      </div>
      <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No history yet</p>
      <p className="text-xs text-slate-300 dark:text-slate-600 max-w-xs">
        {filter === 'all'
          ? 'Completed events will appear here automatically.'
          : `No completed ${filter} events yet.`}
      </p>
    </div>
  );
}

function HistoryCard({ item, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  const meta = CAT_META[item.category] || CAT_META.work;
  const Icon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      className="flex items-start gap-3 p-3 sm:p-4 bg-white dark:bg-[#1a1d27] rounded-xl border border-slate-100 dark:border-[#2a2d3d] shadow-sm group hover:shadow-md transition-shadow"
    >
      {/* Icon */}
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
        <Icon size={16} className={meta.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-100 truncate line-through decoration-1">
            {item.title}
          </p>
          <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full uppercase">
            ✓ Done
          </span>
          {item.autoMarked && (
            <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-[#252838] px-1.5 py-0.5 rounded-full">
              auto
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500">
            <CalendarCheck size={10} /> {formatDate(item.date === new Date().toISOString().split('T')[0] ? item.doneAt : item.date + 'T00:00:00')}
          </span>
          {item.startTime && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-slate-500">
              <Clock size={10} /> {item.startTime} – {item.endTime}
            </span>
          )}
          {item.duration && (
            <span className="text-[10px] text-slate-300 dark:text-slate-600 capitalize">
              {item.duration}
            </span>
          )}
          {item.location && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500">📍 {item.location}</span>
          )}
        </div>
        {item.doneAt && (
          <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">
            Completed {formatDate(item.doneAt)} at {formatTime(item.doneAt)}
          </p>
        )}
      </div>

      {/* Delete */}
      <div className="shrink-0">
        {confirm ? (
          <div className="flex gap-1">
            <button onClick={() => onDelete(item.id)}
              className="text-[10px] px-2 py-1 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors">
              Delete
            </button>
            <button onClick={() => setConfirm(false)}
              className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-[#252838] text-slate-500 rounded-lg font-bold">
              Keep
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirm(true)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-200 dark:text-slate-700 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function HistoryPage() {
  const { history, deleteHistoryItem, clearHistory } = useEventStore();
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [expandStats, setExpandStats] = useState(true);

  const filtered = useMemo(() => {
    return history.filter(h => {
      const matchCat = filter === 'all' || h.category === filter;
      const matchSearch = !search || h.title?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [history, filter, search]);

  // Stats
  const stats = useMemo(() => {
    const totalHours = history.reduce((acc, h) => {
      const m = h.duration?.match(/(\d+(?:\.\d+)?)\s*h/) || h.duration?.match(/(\d+)\s*m/);
      if (!m) return acc + 1;
      return acc + (h.duration?.includes('h') ? parseFloat(m[1]) : parseFloat(m[1]) / 60);
    }, 0);
    return {
      total: history.length,
      work: history.filter(h => h.category === 'work').length,
      personal: history.filter(h => h.category === 'personal').length,
      health: history.filter(h => h.category === 'health').length,
      social: history.filter(h => h.category === 'social').length,
      hours: totalHours.toFixed(1),
    };
  }, [history]);

  // Group by date for timeline
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(h => {
      const day = h.doneAt ? new Date(h.doneAt).toDateString() : h.date || 'Unknown';
      if (!groups[day]) groups[day] = [];
      groups[day].push(h);
    });
    return Object.entries(groups).sort(([a], [b]) => new Date(b) - new Date(a));
  }, [filtered]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0 mb-4 sm:mb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
              <History className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-100">History</h2>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">{history.length} completed items saved</p>
            </div>
          </div>
          {history.length > 0 && (
            <button onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 transition-colors">
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>

        {/* Clear confirm */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl flex items-center gap-3 flex-wrap">
              <AlertTriangle size={15} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400 flex-1">This permanently deletes all history.</p>
              <div className="flex gap-2">
                <button onClick={() => { clearHistory(); setShowClearConfirm(false); }}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700">Yes, clear</button>
                <button onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2d3d] text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats bar */}
      {history.length > 0 && (
        <div className="shrink-0 mb-4">
          <button onClick={() => setExpandStats(!expandStats)}
            className="w-full flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-[#1a1d27] rounded-2xl border border-slate-100 dark:border-[#2a2d3d] shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overview</span>
            {expandStats ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
          </button>
          <AnimatePresence>
            {expandStats && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
                  {[
                    { label: 'Total',    value: stats.total,    color: 'text-slate-700 dark:text-slate-100' },
                    { label: '⏱ Hours',  value: stats.hours,    color: 'text-slate-700 dark:text-slate-100' },
                    { label: 'Work',     value: stats.work,     color: 'text-brand-500' },
                    { label: 'Personal', value: stats.personal, color: 'text-green-500' },
                    { label: 'Health',   value: stats.health,   color: 'text-pink-500' },
                    { label: 'Social',   value: stats.social,   color: 'text-amber-500' },
                  ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-[#1a1d27] rounded-xl border border-slate-100 dark:border-[#2a2d3d] p-2.5 text-center shadow-sm">
                      <p className={`text-lg sm:text-xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Filter tabs + Search */}
      <div className="shrink-0 mb-3 space-y-3">
        {/* Subsection tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {SUBSECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setFilter(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  filter === s.id
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'bg-white dark:bg-[#1a1d27] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-[#2a2d3d]'
                }`}>
                <Icon size={11} />
                {s.label}
                {s.id !== 'all' && history.filter(h => h.category === s.id).length > 0 && (
                  <span className={`text-[9px] font-black px-1 py-0.5 rounded-full ${filter === s.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-[#252838] text-slate-400'}`}>
                    {history.filter(h => h.category === s.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-8 pr-8 py-2 rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-100 dark:border-[#2a2d3d] text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-400/50" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
        {grouped.length === 0 ? (
          <EmptyHistory filter={filter} />
        ) : (
          <div className="space-y-5">
            {grouped.map(([day, items]) => (
              <div key={day}>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-wider mb-2 sticky top-0 bg-slate-50 dark:bg-[#0f1117] py-1 z-10">
                  {new Date(day).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  <span className="ml-2 text-slate-300 dark:text-slate-700 normal-case font-normal">({items.length} item{items.length > 1 ? 's' : ''})</span>
                </p>
                <div className="space-y-2">
                  <AnimatePresence>
                    {items.map(item => (
                      <HistoryCard key={item.id} item={item} onDelete={deleteHistoryItem} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
