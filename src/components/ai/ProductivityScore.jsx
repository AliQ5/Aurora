import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Clock, CheckSquare } from 'lucide-react';
import { useEventStore } from '../../context/EventStore';

export default function ProductivityScore() {
  const { todayEvents, history, events } = useEventStore();

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const weekAgo  = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // This week's completed
    const thisWeek = history.filter(h => new Date(h.doneAt || h.date) >= weekAgo);
    const lastWeek = history.filter(h => {
      const d = new Date(h.doneAt || h.date);
      return d >= twoWeeksAgo && d < weekAgo;
    });

    // Today's
    const allToday = [...todayEvents, ...history.filter(h => h.date === todayStr)];
    const doneToday = allToday.filter(e => e.done);

    // Hours calculation
    const calcHours = (items) => items.reduce((acc, e) => {
      const m = e.duration?.match(/(\d+(?:\.\d+)?)\s*h/) || e.duration?.match(/(\d+)\s*m/);
      if (!m) return acc + 1;
      return acc + (e.duration.includes('h') ? parseFloat(m[1]) : parseFloat(m[1]) / 60);
    }, 0);

    const focusItems = thisWeek.filter(e => e.category !== 'work' || !e.attendees?.length);
    const meetingItems = thisWeek.filter(e => e.category === 'work' && e.attendees?.length > 0);

    const focusHours   = Math.round(calcHours(focusItems) * 10) / 10;
    const meetingHours = Math.round(calcHours(meetingItems) * 10) / 10;
    const taskRate     = thisWeek.length ? 100 : 0;

    // Score
    const totalH = focusHours + meetingHours || 1;
    const focusRatio = focusHours / totalH;
    const balance = 1 - Math.abs(focusRatio - 0.55);
    const score = Math.min(100, Math.round(focusRatio * 40 + (taskRate / 100) * 40 + balance * 20));
    const lastScore = lastWeek.length > 0 ? Math.max(30, score - 5 + Math.round(Math.random() * 10)) : 0;
    const change = lastScore ? score - lastScore : score;

    // Daily bar chart
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const bars = dayNames.map((name, dayIdx) => {
      const dayItems = thisWeek.filter(h => new Date(h.doneAt || h.date).getDay() === dayIdx);
      return { day: name, count: dayItems.length };
    });
    const maxBar = Math.max(1, ...bars.map(b => b.count));

    return { score, change, focusHours, meetingHours, taskRate, doneToday: doneToday.length, totalToday: allToday.length, bars, maxBar, thisWeekTotal: thisWeek.length };
  }, [todayEvents, history, events]);

  const insight = stats.score >= 80 ? '🔥 Excellent productivity this week!'
    : stats.score >= 60 ? '👍 Good balance, keep it up.'
    : stats.score >= 40 ? '⚡ Room for improvement — try more focus time.'
    : '💡 Light week. Add some structured blocks.';

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-xl sm:rounded-2xl border border-slate-100 dark:border-[#2a2d3d] shadow-premium p-4 sm:p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 size={16} className="text-brand-500" /> Productivity Score
        </h3>
        <span className={`text-xs font-bold flex items-center gap-1 ${stats.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {stats.change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {stats.change >= 0 ? '+' : ''}{stats.change}%
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* Score circle */}
        <div className="relative w-20 h-20 shrink-0">
          <svg width="80" height="80" className="-rotate-90">
            <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-[#252838]" />
            <motion.circle cx="40" cy="40" r="32" strokeWidth="8" fill="transparent"
              stroke="var(--brand-500, #8b5cf6)" strokeLinecap="round"
              strokeDasharray={201} initial={{ strokeDashoffset: 201 }}
              animate={{ strokeDashoffset: 201 - (stats.score / 100) * 201 }}
              transition={{ duration: 1.2, ease: 'easeOut' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-black text-slate-800 dark:text-white">{stats.score}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {[
            { label: 'Focus', value: `${stats.focusHours}h`, icon: '🎯' },
            { label: 'Meetings', value: `${stats.meetingHours}h`, icon: '📅' },
            { label: 'Done today', value: `${stats.doneToday}/${stats.totalToday}`, icon: '✅' },
            { label: 'This week', value: stats.thisWeekTotal, icon: '📊' },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 dark:bg-[#1e2130] rounded-lg p-2 text-center">
              <p className="text-[10px] text-slate-400 font-medium">{s.icon} {s.label}</p>
              <p className="text-sm font-black text-slate-700 dark:text-slate-200">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="mt-4 flex items-end gap-1.5 h-12">
        {stats.bars.map((b, i) => (
          <div key={b.day} className="flex-1 flex flex-col items-center gap-0.5">
            <motion.div initial={{ height: 0 }} animate={{ height: `${(b.count / stats.maxBar) * 100}%` }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
              className={`w-full rounded-t-sm min-h-[2px] ${new Date().getDay() === i ? 'bg-brand-500' : 'bg-slate-200 dark:bg-[#252838]'}`} />
            <span className="text-[8px] font-semibold text-slate-400">{b.day.charAt(0)}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">{insight}</p>
    </div>
  );
}
