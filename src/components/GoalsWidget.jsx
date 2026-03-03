import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';
import { useEventStore } from '../context/EventStore';

export default function GoalsWidget() {
  const { todayEvents, history, events } = useEventStore();

  // Compute real goals from actual event data
  const goals = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const allToday = [...todayEvents, ...history.filter(h => h.date === todayStr)];
    const doneToday = allToday.filter(e => e.done);

    // Goal 1: Complete today's tasks
    const todayTotal = allToday.length || 1;
    const todayDone  = doneToday.length;
    const todayPct   = Math.round((todayDone / todayTotal) * 100);

    // Goal 2: Work tasks done
    const workAll  = allToday.filter(e => e.category === 'work');
    const workDone = workAll.filter(e => e.done);
    const workPct  = workAll.length ? Math.round((workDone.length / workAll.length) * 100) : 0;

    // Goal 3: Personal / health balance
    const balanceAll  = allToday.filter(e => e.category === 'personal' || e.category === 'health');
    const balanceDone = balanceAll.filter(e => e.done);
    const balancePct  = balanceAll.length ? Math.round((balanceDone.length / balanceAll.length) * 100) : 0;

    // Goal 4: Weekly productivity (based on history this week)
    const weekAgo   = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekHist  = history.filter(h => new Date(h.doneAt || h.date) >= weekAgo);
    const weekTarget = 15; // target 15 completed events per week
    const weekPct   = Math.min(100, Math.round((weekHist.length / weekTarget) * 100));

    return [
      { id: 'g1', title: `Today's schedule (${todayDone}/${todayTotal})`, progress: todayPct },
      { id: 'g2', title: `Work tasks (${workDone.length}/${workAll.length})`, progress: workPct },
      { id: 'g3', title: `Life balance (${balanceDone.length}/${balanceAll.length})`, progress: balancePct },
      { id: 'g4', title: `Weekly target (${weekHist.length}/${weekTarget})`, progress: weekPct },
    ];
  }, [todayEvents, history, events]);

  const totalProgress = Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length);
  const completed = goals.filter(g => g.progress >= 100).length;

  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (totalProgress / 100) * circumference;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 sm:mb-4 shrink-0">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Goals</h3>
        <span className="text-[10px] sm:text-xs text-brand-500 font-semibold bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-lg">
          {completed}/{goals.length} done
        </span>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 overflow-hidden">
        {/* Progress Circle */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke="currentColor" strokeWidth={strokeWidth}
              fill="transparent" className="text-slate-100 dark:text-[#252838]"
            />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx={size / 2} cy={size / 2} r={radius}
              stroke="url(#goalGradient)" strokeWidth={strokeWidth}
              fill="transparent" strokeDasharray={circumference}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="goalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--brand-500, #8b5cf6)" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100"
            >
              {totalProgress}%
            </motion.span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Overall</span>
          </div>
        </div>

        {/* Goal List */}
        <div className="flex-1 w-full min-w-0 space-y-2 overflow-y-auto no-scrollbar">
          {goals.map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2.5 group"
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                goal.progress >= 100 ? 'bg-emerald-500' : 'border-2 border-slate-200 dark:border-slate-600'
              }`}>
                {goal.progress >= 100 && <CheckCircle2 size={10} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-[11px] sm:text-xs font-medium truncate ${goal.progress >= 100 ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                    {goal.title}
                  </p>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 shrink-0">{goal.progress}%</span>
                </div>
                <div className="w-full h-1 sm:h-1.5 bg-slate-100 dark:bg-[#252838] rounded-full mt-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    className={`h-full rounded-full ${
                      goal.progress >= 100 ? 'bg-emerald-400'
                        : goal.progress >= 70 ? 'bg-brand-400'
                          : goal.progress >= 40 ? 'bg-amber-400'
                            : 'bg-red-300'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
