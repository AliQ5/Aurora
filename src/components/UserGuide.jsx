import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Globe, ChevronRight, ChevronDown, ArrowUp } from 'lucide-react';
import guideContent from '../data/guideContent';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ur', label: 'اردو',    flag: '🇵🇰', dir: 'rtl' },
  { code: 'zh', label: '中文',    flag: '🇨🇳', dir: 'ltr' },
];

export default function UserGuide() {
  const [lang, setLang] = useState('en');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef(null);
  const chapterRefs = useRef({});

  const currentLang = LANGUAGES.find(l => l.code === lang);
  const isRTL = currentLang?.dir === 'rtl';

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToChapter = (id) => {
    setExpandedChapter(id);
    setTimeout(() => {
      chapterRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} className="font-bold text-slate-800 dark:text-slate-100 mt-4 mb-1.5 text-sm sm:text-base">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.startsWith('- ')) {
        const content = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <div key={i} className="flex gap-2 mt-1.5 ml-2">
            <span className="text-brand-400 mt-0.5 shrink-0">•</span>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)[1];
        const content = line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <div key={i} className="flex gap-2.5 mt-2 ml-1">
            <span className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {num}
            </span>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        );
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      const content = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <p key={i} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1"
          dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="shrink-0 mb-4 sm:mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Book className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                {guideContent.title[lang]}
              </h2>
              <p className="text-[11px] sm:text-sm text-slate-400 dark:text-slate-500 font-medium">
                {guideContent.subtitle[lang]}
              </p>
            </div>
          </div>

          {/* Language Picker */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLangPicker(!showLangPicker)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-[#1a1d27] rounded-xl border border-slate-200 dark:border-[#2a2d3d] shadow-sm hover:shadow-md transition-all text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <Globe size={16} className="text-brand-500" />
              <span>{currentLang?.flag} {currentLang?.label}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showLangPicker ? 'rotate-180' : ''}`} />
            </motion.button>
            <AnimatePresence>
              {showLangPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className={`absolute top-full mt-2 bg-white dark:bg-[#1a1d27] rounded-xl border border-slate-100 dark:border-[#2a2d3d] shadow-lg overflow-hidden z-30 min-w-[160px] ${isRTL ? 'left-0' : 'right-0'}`}
                >
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#252838] transition-colors ${lang === l.code ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      <span className="text-lg">{l.flag}</span>
                      <span>{l.label}</span>
                      {lang === l.code && <span className="ml-auto text-brand-500 text-xs">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">

          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a1d27] rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-[#2a2d3d] shadow-sm p-4 sm:p-6"
          >
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-lg">📑</span> {guideContent.tableOfContents[lang]}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {guideContent.chapters.map((ch, i) => (
                <motion.button
                  key={ch.id}
                  whileHover={{ x: isRTL ? -3 : 3 }}
                  onClick={() => scrollToChapter(ch.id)}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1e2130] transition-colors text-left group w-full"
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{ch.title[lang]}</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 truncate">{ch.description[lang]}</p>
                  </div>
                  <ChevronRight size={14} className={`text-slate-300 group-hover:text-brand-500 transition-colors shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Chapter Cards */}
          {guideContent.chapters.map((chapter, chapterIndex) => (
            <motion.div
              key={chapter.id}
              ref={(el) => { chapterRefs.current[chapter.id] = el; }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * chapterIndex }}
              className="bg-white dark:bg-[#1a1d27] rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-[#2a2d3d] shadow-sm overflow-hidden"
            >
              {/* Chapter Header */}
              <button
                onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                className="w-full text-left p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:bg-slate-50/50 dark:hover:bg-[#1e2130]/50 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50 dark:from-brand-900/30 dark:to-violet-900/20 flex items-center justify-center text-xl sm:text-2xl shrink-0 border border-brand-100 dark:border-brand-900/30">
                  {chapter.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-bold text-brand-500 uppercase tracking-wider">
                    {lang === 'ur' ? 'باب' : lang === 'zh' ? '第' : 'Chapter'} {chapterIndex + 1}
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{chapter.title[lang]}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{chapter.description[lang]}</p>
                </div>
                <motion.div
                  animate={{ rotate: expandedChapter === chapter.id ? 180 : 0 }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 dark:bg-[#252838] flex items-center justify-center shrink-0"
                >
                  <ChevronDown size={16} className="text-slate-400" />
                </motion.div>
              </button>

              {/* Chapter Content */}
              <AnimatePresence>
                {expandedChapter === chapter.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-5 sm:pb-7 space-y-4 sm:space-y-5">
                      {/* Chapter hero image */}
                      {chapter.image && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 dark:border-[#2a2d3d] shadow-sm"
                        >
                          <img
                            src={chapter.image}
                            alt={chapter.title[lang]}
                            className="w-full h-44 sm:h-64 object-cover object-top"
                          />
                        </motion.div>
                      )}

                      {/* Sections */}
                      {chapter.sections.map((section, sIndex) => (
                        <motion.div
                          key={sIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 + sIndex * 0.06 }}
                          className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 dark:border-[#2a2d3d]"
                        >
                          {/* Section title bar */}
                          <div className="bg-slate-50 dark:bg-[#1e2130] px-4 py-3 border-b border-slate-100 dark:border-[#2a2d3d] flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-brand-400 rounded-full shrink-0" />
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                              {section.title[lang]}
                            </h4>
                          </div>

                          {/* Content */}
                          <div className={`px-4 py-4 sm:px-5 sm:py-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {renderContent(section.content[lang])}
                          </div>

                          {/* Pro Tip callout */}
                          {section.tip?.[lang] && (
                            <div className="mx-4 mb-4 p-3 rounded-xl bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30">
                              <p className="text-xs text-brand-700 dark:text-brand-400 leading-relaxed">
                                {section.tip[lang]}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Footer */}
          <div className="text-center py-6 sm:py-8">
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-600 font-medium">
              {lang === 'en' ? '✨ Aurora v2.0 — AI-Powered Calendar' : lang === 'ur' ? '✨ اورورا v2.0 — AI سے چلنے والا کیلنڈر' : '✨ Aurora v2.0 — AI驱动日历'}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className={`fixed bottom-20 lg:bottom-8 z-40 w-10 h-10 bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center hover:bg-brand-600 transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
