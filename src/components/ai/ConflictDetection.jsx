import { useMemo } from 'react';
import { AlertCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { useEventStore } from '../../context/EventStore';

function timeToMins(t) { const [h,m]=(t||'0:0').split(':').map(Number); return h*60+m; }
function fmtTime(mins) { const h=Math.floor(mins/60)%24, m=mins%60; const s=h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${s}`; }

export default function ConflictDetection() {
  const { events } = useEventStore();

  const conflicts = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const today = events.filter(e => e.date === todayStr && !e.done).sort((a,b) => a.startTime.localeCompare(b.startTime));
    const result = [];

    for (let i = 1; i < today.length; i++) {
      const prev = today[i-1], curr = today[i];
      const prevEnd = timeToMins(prev.endTime);
      const currStart = timeToMins(curr.startTime);
      const gap = currStart - prevEnd;

      if (gap < 0) {
        result.push({
          type: 'overlap', severity: 'high',
          summary: `"${prev.title}" overlaps with "${curr.title}" (${fmtTime(timeToMins(prev.startTime))}–${fmtTime(prevEnd)} ↔ ${fmtTime(currStart)}–${fmtTime(timeToMins(curr.endTime))})`,
          suggestion: `Move "${curr.title}" to ${fmtTime(prevEnd + 15)}`,
        });
      } else if (gap === 0) {
        result.push({
          type: 'tight', severity: 'medium',
          summary: `No gap between "${prev.title}" and "${curr.title}"`,
          suggestion: `Add a 15-min buffer — start "${curr.title}" at ${fmtTime(currStart + 15)}`,
        });
      } else if (gap < 15) {
        result.push({
          type: 'tight', severity: 'low',
          summary: `Only ${gap}min between "${prev.title}" and "${curr.title}"`,
          suggestion: 'Consider adding a short break for context switching',
        });
      }
    }

    // Overload check
    if (today.length >= 5) {
      result.push({
        type: 'overload', severity: 'medium',
        summary: `${today.length} events scheduled today — heavy day`,
        suggestion: 'Consider rescheduling non-essential items to tomorrow',
      });
    }

    return result;
  }, [events]);

  const severityColors = {
    high:   { bg: 'bg-red-50 dark:bg-red-900/20',   border: 'border-red-200 dark:border-red-800',   icon: 'text-red-500',   text: 'text-red-700 dark:text-red-400' },
    medium: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-500', text: 'text-amber-700 dark:text-amber-400' },
    low:    { bg: 'bg-blue-50 dark:bg-blue-900/20',  border: 'border-blue-200 dark:border-blue-800', icon: 'text-blue-500',  text: 'text-blue-700 dark:text-blue-400' },
  };

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-xl sm:rounded-2xl border border-slate-100 dark:border-[#2a2d3d] shadow-premium p-4 sm:p-5 h-full">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={16} className="text-brand-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Conflict Detection</h3>
        {conflicts.length > 0 && (
          <span className="ml-auto text-[10px] font-black bg-red-100 dark:bg-red-900/20 text-red-500 px-2 py-0.5 rounded-full">
            {conflicts.length} issue{conflicts.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {conflicts.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-2xl mb-1">✅</p>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">No conflicts detected</p>
          <p className="text-xs text-slate-400 mt-1">Your schedule looks clean</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {conflicts.map((c, i) => {
            const s = severityColors[c.severity];
            return (
              <div key={i} className={`${s.bg} rounded-xl p-3 border ${s.border}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle size={13} className={`${s.icon} mt-0.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${s.text}`}>{c.summary}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <ArrowRight size={10} className="text-slate-400" />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{c.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
