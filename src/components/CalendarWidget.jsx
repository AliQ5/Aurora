import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
             {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-600">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-600">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-medium text-slate-400 text-sm py-2" key={i}>
          {format(addDays(startDate, i), 'eee')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        // Add random dots for demo purposes
        const hasWorkEvent = i === 2 && day.getDate() % 3 === 0;
        const hasPersonalEvent = i === 5 && day.getDate() % 2 === 0;

        days.push(
          <div
            className={`p-2 relative flex flex-col items-center justify-center cursor-pointer transition-colors
              ${!isSameMonth(day, monthStart) ? 'text-slate-300' : 'text-slate-700'}
            `}
            key={day}
          >
            <motion.div 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               className={`w-10 h-10 flex items-center justify-center rounded-2xl z-10 transition-colors
                 ${isSameDay(day, new Date()) 
                     ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30 font-semibold' 
                     : 'hover:bg-slate-100'
                 }
               `}
            >
               {formattedDate}
            </motion.div>
            
            <div className="flex gap-1 mt-1 shrink-0 h-1">
               {hasWorkEvent && <div className="w-1 h-1 rounded-full bg-accent-purple"></div>}
               {hasPersonalEvent && <div className="w-1 h-1 rounded-full bg-accent-green"></div>}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="flex flex-col h-full">
      {renderHeader()}
      {renderDays()}
      <AnimatePresence mode="wait">
        <motion.div
           key={currentDate.toISOString()}
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: 10 }}
           transition={{ duration: 0.2 }}
           className="flex-1"
        >
          {renderCells()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
