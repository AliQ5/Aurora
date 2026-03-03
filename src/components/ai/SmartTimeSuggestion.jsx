import { useMemo } from 'react';
import { Clock, Zap, Sunrise, Moon } from 'lucide-react';
import { useEventStore } from '../../context/EventStore';

function timeToMins(t) { const [h,m]=(t||'0:0').split(':').map(Number); return h*60+m; }
function fmtTime(mins) { const h=Math.floor(mins/60)%24, m=mins%60; const s=h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${s}`; }

export default function SmartTimeSuggestion() {
  const { events } = useEventStore();

  const slots = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tmrw = new Date(); tmrw.setDate(tmrw.getDate()+1);
    const tmrwStr = tmrw.toISOString().split('T')[0];

    const findFree = (dayStr, label) => {
      const dayEvts = events.filter(e => e.date === dayStr && !e.done).sort((a,b)=>a.startTime.localeCompare(b.startTime));
      const busy = dayEvts.map(e=>({ s:timeToMins(e.startTime), e:timeToMins(e.endTime) }));
      busy.sort((a,b)=>a.s-b.s);
      const free = [];
      let cursor = 8*60;
      for (const b of busy) {
        if (b.s > cursor && b.s - cursor >= 30) free.push({ s:cursor, e:b.s, len:b.s-cursor, day:label });
        cursor = Math.max(cursor, b.e);
      }
      if (20*60 > cursor) free.push({ s:cursor, e:20*60, len:20*60-cursor, day:label });
      return free;
    };

    const todayFree = findFree(todayStr, 'Today');
    const tmrwFree  = findFree(tmrwStr, 'Tomorrow');
    const all = [...todayFree, ...tmrwFree].sort((a,b) => b.len - a.len).slice(0, 3);

    return all.map((s, i) => {
      const conf = s.len >= 120 ? 95 : s.len >= 60 ? 82 : 68;
      const icon = s.s < 12*60 ? '☀️' : s.s < 17*60 ? '🎯' : '🌅';
      const reason = s.len >= 120 ? `${Math.round(s.len/60)}h uninterrupted — best for deep work`
        : s.len >= 60 ? `${Math.round(s.len/60)}h free slot, low interruption`
        : `${s.len}min quick window`;
      return {
        time: `${s.day} ${fmtTime(s.s)} – ${fmtTime(s.e)}`,
        confidence: conf - i * 5,
        reason, icon,
      };
    });
  }, [events]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-brand-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Smart Time Slots</h3>
      </div>

      {slots.length === 0 ? (
        <p className="text-xs text-slate-500 py-6 text-center">No free slots detected today or tomorrow.</p>
      ) : (
        <div className="space-y-2.5">
          {slots.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#1e2130] border border-slate-100 dark:border-[#2a2d3d] hover:shadow-sm transition-shadow">
              <span className="text-xl shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-100">{s.time}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{s.reason}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-[#252838] rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${s.confidence}%` }} />
                </div>
                <span className="text-[9px] font-bold text-brand-500">{s.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
