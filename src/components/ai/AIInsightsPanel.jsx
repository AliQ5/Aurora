import { motion } from 'framer-motion';
import ProductivityScore from './ProductivityScore';
import SmartTimeSuggestion from './SmartTimeSuggestion';
import ConflictDetection from './ConflictDetection';
import AutoTaskBreakdown from './AutoTaskBreakdown';
import FocusTimeDetection from './FocusTimeDetection';
import BurnoutAlert from './BurnoutAlert';
import SmartReminders from './SmartReminders';
import ReschedulingAssistant from './ReschedulingAssistant';

export default function AIInsightsPanel() {
  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-8 sm:pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8"
      >
        {/* Top Row: Productivity Score + Burnout Alert */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="md:col-span-7"
          >
            <ProductivityScore />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-5"
          >
            <BurnoutAlert />
          </motion.div>
        </div>

        {/* Middle Row: Focus Time + Smart Time Suggestion */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-5"
          >
            <FocusTimeDetection />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-7 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-premium p-4 sm:p-5"
          >
            <SmartTimeSuggestion />
          </motion.div>
        </div>

        {/* Third Row: Task Breakdown + Conflict Detection */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="md:col-span-7 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-premium p-4 sm:p-5"
          >
            <AutoTaskBreakdown />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-5"
          >
            <ConflictDetection />
          </motion.div>
        </div>

        {/* Bottom Row: Smart Reminders + Rescheduling */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="md:col-span-5"
          >
            <SmartReminders />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-7"
          >
            <ReschedulingAssistant />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
