import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative flex items-center rounded-full transition-colors duration-300 border
        ${compact
          ? 'w-9 h-9 justify-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
          : 'w-14 h-7 px-1 gap-1 bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
        }
      `}
    >
      {compact ? (
        // Simple icon button mode
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark
            ? <Sun  size={16} className="text-amber-400" />
            : <Moon size={16} className="text-slate-500" />
          }
        </motion.div>
      ) : (
        // Pill toggle mode
        <>
          <Sun  size={12} className={`transition-colors ${isDark ? 'text-slate-500' : 'text-amber-500'}`} />
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`absolute w-5 h-5 rounded-full shadow-md flex items-center justify-center
              ${isDark
                ? 'right-1 bg-slate-900'
                : 'left-1 bg-white'
              }
            `}
          >
            {isDark
              ? <Moon  size={10} className="text-brand-400" />
              : <Sun   size={10} className="text-amber-500" />
            }
          </motion.div>
          <Moon size={12} className={`ml-auto transition-colors ${isDark ? 'text-brand-400' : 'text-slate-400'}`} />
        </>
      )}
    </motion.button>
  );
}
