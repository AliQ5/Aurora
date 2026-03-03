import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEventStore } from '../../context/EventStore';

function timeToMins(t) { const [h,m]=(t||'0:0').split(':').map(Number); return h*60+m; }
function fmtTime(mins) { const h=Math.floor(mins/60)%24, m=mins%60; const s=h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${s}`; }

export default function ReschedulingAssistant() {
  const { events, addEvent, deleteEvent } = useEventStore();
  const [rescheduled, setRescheduled] = useState(new Set());

  const suggestions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const nowMins  = now.getHours() * 60 + now.getMinutes();

    const tmrw = new Date(); tmrw.setDate(tmrw.getDate()+1);
    const tmrwStr = tmrw.toISOString().split('T')[0];

    const today = events.filter(e => e.date === todayStr && !e.done).sort((a,b)=>a.startTime.localeCompare(b.startTime));

    // Find events that could benefit from rescheduling
    const results = [];

    // 1. Past-due events still not done
    const pastDue = today.filter(e => timeToMins(e.endTime) < nowMins);
    pastDue.forEach(ev => {
      // Find free slot tomorrow
      const tmrwEvts = events.filter(e => e.date === tmrwStr && !e.done);
      const tmrwBusy = tmrwEvts.map(e => ({ s:timeToMins(e.startTime), e:timeToMins(e.endTime) })).sort((a,b)=>a.s-b.s);
      let slot = 9*60; // try 9am
      for (const b of tmrwBusy) {
        if (b.s >= slot + 60) break;
        slot = Math.max(slot, b.e + 15);
      }

      results.push({
        event: ev,
        reason: `Missed today — was scheduled at ${ev.startTime}`,
        suggestion: `Tomorrow at ${fmtTime(slot)}`,
        newDate: tmrwStr,
        newStart: `${String(Math.floor(slot/60)).padStart(2,'0')}:${String(slot%60).padStart(2,'0')}`,
        confidence: 88,
      });
    });

    // 2. Events overlapping with others
    for (let i = 1; i < today.length; i++) {
      const prev = today[i-1], curr = today[i];
      if (timeToMins(prev.endTime) > timeToMins(curr.startTime)) {
        // Find next free slot today
        const lastEnd = Math.max(...today.map(e => timeToMins(e.endTime)));
        const freeStart = lastEnd + 15;
        if (freeStart < 19*60) {
          results.push({
            event: curr,
            reason: `Conflicts with "${prev.title}"`,
            suggestion: `Today at ${fmtTime(freeStart)}`,
            newDate: todayStr,
            newStart: `${String(Math.floor(freeStart/60)).padStart(2,'0')}:${String(freeStart%60).padStart(2,'0')}`,
            confidence: 78,
          });
        }
      }
    }

    return results.filter(r => !rescheduled.has(r.event.id));
  }, [events, rescheduled]);

  const handleReschedule = (s) => {
    // Create new event at suggested time; delete old
    const newEv = { ...s.event, date: s.newDate, startTime: s.newStart };
    // Recompute endTime
    const durMins = (() => {
      const h=s.event.duration?.match(/(\d+(?:\.\d+)?)\s*h/), m=s.event.duration?.match(/(\d+)\s*m/);
      let t=0; if(h)t+=parseFloat(h[1])*60; if(m)t+=parseInt(m[1]); return t||60;
    })();
    const endMins = timeToMins(s.newStart) + durMins;
    newEv.endTime = `${String(Math.floor(endMins/60)%24).padStart(2,'0')}:${String(endMins%60).padStart(2,'0')}`;
    delete newEv.id; // let addEvent generate a new ID
    deleteEvent(s.event.id);
    addEvent(newEv);
    setRescheduled(prev => new Set([...prev, s.event.id]));
  };

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-xl sm:rounded-2xl border border-slate-100 dark:border-[#2a2d3d] shadow-premium p-4 sm:p-5 h-full">
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw size={16} className="text-brand-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Reschedule Assistant</h3>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-2xl mb-1">✨</p>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">All events on track</p>
          <p className="text-xs text-slate-400 mt-1">No rescheduling needed right now</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {suggestions.map((s, i) => (
            <div key={s.event.id} className="bg-slate-50 dark:bg-[#1e2130] rounded-xl p-3 border border-slate-100 dark:border-[#2a2d3d]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.event.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.reason}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <ArrowRight size={10} className="text-brand-400" />
                    <span className="text-[11px] font-semibold text-brand-500">{s.suggestion}</span>
                    <span className="text-[9px] font-bold text-slate-400 ml-1">{s.confidence}% match</span>
                  </div>
                </div>
                <button onClick={() => handleReschedule(s)}
                  className="shrink-0 px-3 py-1.5 bg-brand-500 text-white text-[10px] font-bold rounded-lg hover:bg-brand-600 transition-colors shadow-sm">
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {rescheduled.size > 0 && (
        <div className="mt-3 flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
          <CheckCircle2 size={12} className="text-green-500" />
          <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold">
            {rescheduled.size} event{rescheduled.size > 1 ? 's' : ''} rescheduled ✓
          </span>
        </div>
      )}
    </div>
  );
}
