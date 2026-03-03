import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, ChevronDown, ChevronUp, Clock, CheckSquare } from 'lucide-react';
import { useEventStore } from '../../context/EventStore';

function parseDuration(d) {
  if (!d) return 60;
  const h = d.match(/(\d+(?:\.\d+)?)\s*h/);
  const m = d.match(/(\d+)\s*m/);
  let total = 0;
  if (h) total += parseFloat(h[1]) * 60;
  if (m) total += parseInt(m[1]);
  return total || 60;
}

export default function AutoTaskBreakdown() {
  const { todayEvents, events } = useEventStore();
  const [expandedId, setExpandedId] = useState(null);

  // Break down each today event > 30min into subtasks
  const breakdowns = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const today = events.filter(e => e.date === todayStr && !e.done).sort((a,b) => a.startTime.localeCompare(b.startTime));

    return today.filter(e => parseDuration(e.duration) >= 45).map(event => {
      const totalMin = parseDuration(event.duration);
      const subtasks = [];

      // Generate smart subtasks based on category
      if (event.category === 'work') {
        if (event.attendees?.length > 0) {
          subtasks.push({ name: 'Prep & review materials', mins: Math.max(10, Math.round(totalMin * 0.15)) });
          subtasks.push({ name: event.title, mins: Math.round(totalMin * 0.65) });
          subtasks.push({ name: 'Document action items', mins: Math.max(10, Math.round(totalMin * 0.2)) });
        } else {
          subtasks.push({ name: 'Set focus mode', mins: 5 });
          subtasks.push({ name: `Deep work: ${event.title}`, mins: Math.round(totalMin * 0.7) });
          subtasks.push({ name: 'Review & wrap up', mins: Math.round(totalMin * 0.2) });
          subtasks.push({ name: 'Quick break', mins: 5 });
        }
      } else if (event.category === 'health') {
        subtasks.push({ name: 'Warm up', mins: Math.max(5, Math.round(totalMin * 0.15)) });
        subtasks.push({ name: event.title, mins: Math.round(totalMin * 0.7) });
        subtasks.push({ name: 'Cool down & stretch', mins: Math.max(5, Math.round(totalMin * 0.15)) });
      } else {
        subtasks.push({ name: event.title, mins: Math.round(totalMin * 0.8) });
        subtasks.push({ name: 'Transition time', mins: Math.round(totalMin * 0.2) });
      }

      return { event, subtasks, totalMin };
    });
  }, [events, todayEvents]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <ListTodo size={16} className="text-brand-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Task Breakdown</h3>
        {breakdowns.length > 0 && (
          <span className="text-[10px] font-bold bg-brand-50 dark:bg-brand-900/20 text-brand-500 px-2 py-0.5 rounded-full ml-auto">
            {breakdowns.length} event{breakdowns.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {breakdowns.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-2xl mb-1">📋</p>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No long events to break down</p>
          <p className="text-xs text-slate-400 mt-1">Events ≥ 45 minutes will show subtask suggestions</p>
        </div>
      ) : (
        <div className="space-y-2">
          {breakdowns.map(({ event, subtasks, totalMin }) => (
            <div key={event.id} className="bg-slate-50 dark:bg-[#1e2130] rounded-xl border border-slate-100 dark:border-[#2a2d3d] overflow-hidden">
              <button onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-[#252838] transition-colors">
                <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{event.title}</p>
                  <p className="text-[10px] text-slate-400">{event.startTime} · {event.duration}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">{subtasks.length} steps</span>
                {expandedId === event.id ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
              </button>

              <AnimatePresence>
                {expandedId === event.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-3 pb-3 space-y-1.5">
                      {subtasks.map((st, i) => (
                        <div key={i} className="flex items-center gap-2 pl-4">
                          <div className="w-3 h-3 rounded border border-slate-300 dark:border-slate-600 shrink-0" />
                          <span className="text-[11px] text-slate-600 dark:text-slate-300 flex-1">{st.name}</span>
                          <span className="text-[9px] font-semibold text-slate-400 flex items-center gap-0.5 shrink-0">
                            <Clock size={9} /> {st.mins}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
