import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Bell, Settings, Plus, LayoutDashboard, Brain, BookOpen, History } from 'lucide-react';

// Components
import CalendarWidget from './components/CalendarWidget';
import GoalsWidget from './components/GoalsWidget';
import AgendaWidget from './components/AgendaWidget';
import NaturalLanguageInput from './components/ai/NaturalLanguageInput';
import AIInsightsPanel from './components/ai/AIInsightsPanel';
import UserGuide from './components/UserGuide';
import HistoryPage from './components/HistoryPage';
import ThemeToggle from './components/ThemeToggle';
import SettingsPage from './components/SettingsPage';
import OnboardingPage from './components/OnboardingPage';
import { useLocale } from './context/LocaleContext';
import { useSettings } from './context/SettingsContext';
import { useEventStore } from './context/EventStore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNLModal, setShowNLModal] = useState(false);
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('aurora_onboarded') === 'true');
  const { t, todayFormatted, isRTL } = useLocale();
  const { profile, setProfile } = useSettings();
  const { addEvent } = useEventStore();

  const handleOnboardComplete = useCallback((profileData) => {
    setProfile(profileData);
    setOnboarded(true);
  }, [setProfile]);

  // Show onboarding for first-time users
  if (!onboarded) {
    return <OnboardingPage onComplete={handleOnboardComplete} />;
  }

  const tabItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav_dashboard') },
    { id: 'calendar',  icon: Calendar,        label: t('nav_calendar') },
    { id: 'history',   icon: History,         label: 'History' },
    { id: 'guide',     icon: BookOpen,        label: t('nav_guide') },
    { id: 'settings',  icon: Settings,        label: t('nav_settings') },
  ];

  const pageTitle = activeTab === 'dashboard' ? t('page_overview')
    : activeTab === 'calendar' ? t('nav_calendar')
    : activeTab === 'ai'       ? t('nav_ai')
    : activeTab === 'guide'    ? t('nav_guide')
    : activeTab === 'settings' ? t('nav_settings')
    : activeTab === 'history'  ? 'History'
    : t('page_overview');

  const userAvatar = (() => {
    if (profile?.avatarUrl) return profile.avatarUrl;
    const idx = profile?.avatarPreset ?? 0;
    const seeds = ['Aurora','Stellar','Nova','Cosmos','Pixel','Ember'];
    const seed = seeds[idx] || 'Aurora';
    return `https://api.dicebear.com/8.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  })();

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#0f1117] overflow-hidden text-slate-800 dark:text-slate-100 transition-colors duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Desktop Sidebar — hidden on mobile */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden lg:flex w-64 bg-white dark:bg-[#13151f] border-r border-slate-100 dark:border-[#2a2d3d] flex-col justify-between py-8 items-start shadow-sm z-20 transition-colors duration-300"
      >
        <div className="w-full px-8 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-violet-700 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/20 overflow-hidden p-1.5">
               <img src="/logo-icon.png" alt="Aurora" className="w-full h-full object-contain" />
             </div>
             <span className="font-black text-xl tracking-tight bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">Aurora</span>
          </div>

          <nav className="flex flex-col gap-4 mt-12 w-full">
            <SidebarNavItem icon={<LayoutDashboard size={20} />} label={t('nav_dashboard')} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarNavItem icon={<Calendar size={20} />} label={t('nav_calendar')} active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
            <SidebarNavItem icon={<History size={20} />} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
            <SidebarNavItem icon={<Brain size={20} />} label={t('nav_ai')} active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
            <SidebarNavItem icon={<BookOpen size={20} />} label={t('nav_guide')} active={activeTab === 'guide'} onClick={() => setActiveTab('guide')} />
          </nav>
        </div>

        <div className="w-full px-8 flex flex-col gap-3">
          {/* Theme toggle */}
          <div className="flex items-center justify-between px-1 py-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider">{t('label_theme')}</span>
            <ThemeToggle />
          </div>
          <SidebarNavItem icon={<Settings size={20} />} label={t('nav_settings')} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <div onClick={() => setActiveTab('settings')} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#1e2130] hover:bg-slate-100 dark:hover:bg-[#252838] transition-colors cursor-pointer border border-slate-100 dark:border-[#2a2d3d]">
             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-semibold truncate dark:text-slate-200">{profile?.name || 'Alex Doe'}</span>
               <span className="text-xs text-slate-500 dark:text-slate-500">{t('label_premium')}</span>
             </div>
          </div>
          
          {/* Author Footer */}
          <div className="mt-2 pt-4 border-t border-slate-100 dark:border-[#2a2d3d] text-center w-full">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
              Crafted by <span className="font-bold text-brand-500">ELI_BHAI</span>
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-14 sm:h-16 lg:h-24 px-4 sm:px-8 lg:px-12 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-violet-700 rounded-lg flex items-center justify-center overflow-hidden p-1 shadow-md shadow-brand-500/20 lg:hidden">
              <img src="/logo-icon.png" alt="Aurora" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 font-medium hidden sm:block">{todayFormatted}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle — mobile only, compact icon style */}
            <div className="lg:hidden">
              <ThemeToggle compact />
            </div>
            <button className="w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-[#1a1d27] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow relative border border-slate-100 dark:border-[#2a2d3d]">
              <Bell size={16} className="text-slate-600 dark:text-slate-400" />
              <span className="absolute top-1.5 sm:top-2 right-2 sm:right-2.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white dark:ring-[#0f1117]"></span>
            </button>
            {/* Desktop only New Event button */}
            <button 
              onClick={() => setShowNLModal(true)}
              className="hidden sm:flex bg-brand-500 text-white px-5 py-2.5 rounded-full font-medium items-center gap-2 shadow-md shadow-brand-500/20 hover:bg-brand-600 transition-colors text-sm"
            >
              <Plus size={16} />
              {t('btn_new_event')}
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-8 lg:px-12 pb-24 lg:pb-12 no-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 md:h-[calc(100vh-140px)] md:min-h-[700px] mb-8">
                  <div className="md:col-span-4 flex flex-col gap-4 sm:gap-6 lg:gap-8 md:h-full">
                     <motion.div 
                       whileHover={{ y: -4 }}
                       className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-premium flex flex-col md:h-[60%] border border-slate-50/50"
                     >
                       <CalendarWidget />
                     </motion.div>
                     <motion.div 
                       whileHover={{ y: -4 }}
                       className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-premium flex flex-col md:h-[40%] border border-slate-50/50"
                     >
                       <GoalsWidget />
                     </motion.div>
                  </div>
                  <div className="md:col-span-8 flex flex-col gap-4 sm:gap-6 lg:gap-8 md:h-full">
                     <motion.div 
                       whileHover={{ y: -4 }}
                       className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2rem] shadow-premium flex flex-col md:h-[70%] border border-slate-50/50 relative overflow-hidden"
                     >
                       <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-accent-purple/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                       <AgendaWidget />
                     </motion.div>
                     <motion.div 
                       whileHover={{ y: -4 }}
                       className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2rem] shadow-premium flex flex-col md:h-[30%] border border-slate-50/50 relative overflow-hidden"
                     >
                        <div className="absolute bottom-0 right-0 w-36 sm:w-48 h-36 sm:h-48 bg-brand-50 rounded-full blur-3xl -mr-10 -mb-10 pointer-events-none"></div>
                        <NaturalLanguageInput onEventCreated={(ev) => addEvent(ev)} />
                     </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div key="ai" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4 }}>
                <AIInsightsPanel />
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div key="calendar" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4 }} className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-[#1a1d27] p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[2rem] shadow-premium border border-slate-50/50 dark:border-[#2a2d3d]">
                  <CalendarWidget />
                </div>
              </motion.div>
            )}

            {activeTab === 'guide' && (
              <motion.div key="guide" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4 }} className="h-full">
                <UserGuide />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4 }} className="h-full">
                <HistoryPage />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4 }} className="h-full">
                <SettingsPage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════ Mobile Bottom Navigation Bar ═══════════ */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-2 sm:px-4 pb-3 pt-1">
          {/* Glassmorphism container */}
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-[1.75rem] shadow-[0_-4px_30px_rgba(0,0,0,0.08)] px-1 sm:px-2 py-1.5 flex items-end justify-between">
            
            {/* Left nav items (Dashboard, Calendar) */}
            <div className="flex justify-around flex-1">
              {tabItems.slice(0, 2).map(item => (
                <BottomNavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </div>

            {/* Center FAB — New Event */}
            <div className="relative -mt-5 shrink-0 px-1 sm:px-2">
              {/* Notch / bump background */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[68px] h-[34px] bg-slate-50 rounded-b-[34px]" 
                   style={{ clipPath: 'ellipse(34px 18px at 50% 0%)' }} />
              <motion.button
                onClick={() => setShowNLModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-500 to-violet-600 rounded-[14px] sm:rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 text-white"
              >
                <Plus size={22} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Right nav items (History, Guide, Settings) */}
            <div className="flex justify-around flex-1">
              {tabItems.slice(2).map(item => (
                <BottomNavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                />
              ))}
            </div>
            
          </div>
        </div>
      </main>

      {/* Natural Language Event Creation Modal */}
      <AnimatePresence>
        {showNLModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNLModal(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
            />
            {/* Modal — centered with flexbox (works on all screen sizes) */}
            <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 24 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="w-full max-w-lg pointer-events-auto"
              >
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.15)] p-5 sm:p-8 border border-slate-100/60 relative overflow-hidden">
                  {/* Close button */}
                  <button
                    onClick={() => setShowNLModal(false)}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-500 z-20"
                  >
                    <span className="text-sm font-bold">✕</span>
                  </button>
                  <div className="absolute top-0 right-0 w-36 sm:w-48 h-36 sm:h-48 bg-brand-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-violet-50 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
                  <div className="relative z-10">
                    <NaturalLanguageInput onEventCreated={() => {
                      setTimeout(() => setShowNLModal(false), 2200);
                    }} />
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

// ─── Bottom Nav Item ──────────────────────────────────────────────
function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center gap-0.5 py-2 px-4 min-w-[56px]">
      {/* Active indicator - pill highlight */}
      {active && (
        <motion.div
          layoutId="bottomNavIndicator"
          className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-brand-500 rounded-full"
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        />
      )}
      
      {/* Icon with active background */}
      <motion.div
        animate={active ? { scale: 1.15 } : { scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
          active ? 'bg-brand-50' : ''
        }`}
      >
        <Icon
          size={20}
          className={`transition-colors ${active ? 'text-brand-500' : 'text-slate-400'}`}
          strokeWidth={active ? 2.5 : 1.8}
        />
      </motion.div>
      
      <span className={`text-[10px] font-semibold transition-colors ${
        active ? 'text-brand-600' : 'text-slate-400'
      }`}>
        {label}
      </span>
    </button>
  );
}

// ─── Desktop Sidebar Nav Item ──────────────────────────────────────
function SidebarNavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-full flex items-center gap-4 px-4 p-3 rounded-xl transition-all duration-300 group
        ${active ? 'text-brand-600 bg-brand-50/80 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
      `}
    >
      {active && (
        <motion.div 
          layoutId="sidebarActive" 
          className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-full"
        />
      )}
      <span className={`${active ? 'text-brand-500' : 'group-hover:scale-110 transition-transform'}`}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default App;
