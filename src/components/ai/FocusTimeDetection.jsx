import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, Zap } from 'lucide-react';
import { useEventStore } from '../../context/EventStore';

function timeToMins(t) { const [h,m]=(t||'0:0').split(':').map(Number); return h*60+m; }
function fmtTime(mins) { const h=Math.floor(mins/60)%24, m=mins%60; const s=h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${s}`; }

export default function FocusTimeDetection() {
  const { events } = useEventStore();

  const data = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const today = events.filter(e => e.date === todayStr && !e.done).sort((a,b) => a.startTime.localeCompare(b.startTime));

    // Find free slots between 8am and 8pm
    const workStart = 8 * 60, workEnd = 20 * 60;
    const busy = today.map(e => ({ s: timeToMins(e.startTime), e: timeToMins(e.endTime) }));
    busy.sort((a,b) => a.s - b.s);

    const free = [];
    let cursor = workStart;
    for (const b of busy) {
      if (b.s > cursor && b.s - cursor >= 30) {
        free.push({ start: cursor, end: b.s, len: b.s - cursor });
      }
      cursor = Math.max(cursor, b.e);
    }
    if (workEnd > cursor && workEnd - cursor >= 30) {
      free.push({ start: cursor, end: workEnd, len: workEnd - cursor });
    }

    // Best focus block (longest free slot)
    free.sort((a,b) => b.len - a.len);
    const best = free[0];

    if (!best) {
      return { block: 'No free time found', confidence: 'Low', reason: 'Your schedule is fully packed today.', slots: [] };
    }

    const confidence = best.len >= 120 ? 'High' : best.len >= 60 ? 'Medium' : 'Low';
    const blockLabel = `${fmtTime(best.start)} – ${fmtTime(best.end)}`;
    const reason = best.len >= 120
      ? `${Math.round(best.len/60)}h uninterrupted block. Perfect for deep work.`
      : best.len >= 60
      ? `${Math.round(best.len/60)}h free — enough for focused work.`
      : `${best.len}min slot — short but usable for quick tasks.`;

    const slots = free.slice(0, 3).map(s => ({
      label: `${fmtTime(s.start)} – ${fmtTime(s.end)}`,
      mins: s.len,
    }));

    return { block: blockLabel, confidence, reason, slots };
  }, [events]);

  const confColors = { High: 'text-green-500 bg-green-50', Medium: 'text-amber-500 bg-amber-50', Low: 'text-red-500 bg-red-50' };

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-xl sm:rounded-2xl border border-slate-100 dark:border-[#2a2d3d] shadow-premium p-4 sm:p-5 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Eye size={16} className="text-brand-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Focus Time</h3>
      </div>

      <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3 mb-3">
        <p className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">Best Window</p>
        <p className="text-base font-black text-brand-600 dark:text-brand-400">{data.block}</p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${confColors[data.confidence] || confColors.Low}`}>
          {data.confidence} confidence
        </span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{data.reason}</p>

      {data.slots.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">All Free Slots</p>
          {data.slots.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-2 py-1.5 bg-slate-50 dark:bg-[#1e2130] rounded-lg">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{s.label}</span>
              <span className="text-[10px] font-semibold text-slate-400">{s.mins}min</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
