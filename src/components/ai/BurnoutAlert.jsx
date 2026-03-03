import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Heart, Coffee, Battery } from 'lucide-react';
import { useEventStore } from '../../context/EventStore';

function timeToMins(t) { const [h,m]=(t||'0:0').split(':').map(Number); return h*60+m; }

export default function BurnoutAlert() {
  const { todayEvents, events } = useEventStore();

  const data = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const today = events.filter(e => e.date === todayStr).sort((a,b) => a.startTime.localeCompare(b.startTime));

    // Count back-to-back (gap < 15min)
    let b2b = 0;
    for (let i = 1; i < today.length; i++) {
      const prevEnd = timeToMins(today[i-1].endTime);
      const currStart = timeToMins(today[i].startTime);
      if (currStart - prevEnd < 15) b2b++;
    }

    // Total work hours
    const workHours = today.reduce((acc, e) => {
      const dur = e.duration?.match(/(\d+(?:\.\d+)?)\s*h/);
      const min = e.duration?.match(/(\d+)\s*m/);
      if (dur) return acc + parseFloat(dur[1]);
      if (min) return acc + parseInt(min[1]) / 60;
      return acc + 1;
    }, 0);

    // Risk level
    let risk = 'low', color = 'green', message = '', action = '';
    if (b2b >= 3 || workHours >= 9) {
      risk = 'high'; color = 'red';
      message = `${b2b} back-to-back meetings, ${workHours.toFixed(1)}h total work`;
      action = 'Take a break now — schedule a 30-min recovery block';
    } else if (b2b >= 2 || workHours >= 7) {
      risk = 'medium'; color = 'amber';
      message = `${b2b} back-to-back meetings this morning`;
      action = 'Insert a 15-min break between meetings';
    } else {
      message = 'Schedule looks balanced';
      action = 'Keep maintaining breaks between meetings';
    }

    return { risk, color, message, action, b2b, workHours: workHours.toFixed(1) };
  }, [todayEvents, events]);

  const colors = {
    low:    { bg: 'bg-green-50 dark:bg-green-900/20',  border: 'border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400', icon: 'text-green-500' },
    medium: { bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', icon: 'text-amber-500' },
    high:   { bg: 'bg-red-50 dark:bg-red-900/20',      border: 'border-red-200 dark:border-red-800',     text: 'text-red-700 dark:text-red-400',     icon: 'text-red-500' },
  };
  const c = colors[data.risk];

  return (
    <div className={`${c.bg} rounded-xl sm:rounded-2xl border ${c.border} p-4 sm:p-5 h-full`}>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className={c.icon} />
        <h3 className={`text-sm font-bold ${c.text}`}>Wellness Alert</h3>
        <span className={`ml-auto text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
          {data.risk}
        </span>
      </div>

      <p className={`text-xs font-medium ${c.text} mb-2`}>{data.message}</p>

      <div className="flex gap-3 mb-3">
        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-black/10 px-2 py-1.5 rounded-lg">
          <Battery size={12} className={c.icon} />
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{data.workHours}h work</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-black/10 px-2 py-1.5 rounded-lg">
          <Coffee size={12} className={c.icon} />
          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{data.b2b} back-to-back</span>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-white/40 dark:bg-black/10 rounded-lg p-2.5">
        <Heart size={12} className={`${c.icon} mt-0.5 shrink-0`} />
        <p className="text-[11px] text-slate-600 dark:text-slate-400">{data.action}</p>
      </div>
    </div>
  );
}
