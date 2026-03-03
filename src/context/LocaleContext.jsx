import { createContext, useContext, useCallback, useMemo } from 'react';
import T, { LOCALES } from '../data/translations';
import { useSettings } from './SettingsContext';

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const { regional } = useSettings();
  const language = regional?.language || 'English';
  const locale = LOCALES[language] || LOCALES.English;
  const dateFormatPref = regional?.dateFormat || 'DD/MM/YYYY';

  // Apply document-level locale effects
  const applyLocale = useCallback((lang) => {
    const loc = LOCALES[lang] || LOCALES.English;
    document.documentElement.lang = loc.code;
    document.documentElement.dir = loc.dir;
  }, []);

  // Apply on every render (catches page refresh)
  applyLocale(language);

  // t(key) — translate a UI string
  const t = useCallback((key) => {
    const map = T[key];
    if (!map) return key;
    return map[language] || map.English || key;
  }, [language]);

  // Format a Date object to a locale-aware date string
  const formatDate = useCallback((date, opts = {}) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return '';
    const { code } = locale;
    try {
      // Respect the user's chosen date format
      if (!opts.full && !opts.time) {
        const parts = new Intl.DateTimeFormat(code, { day: '2-digit', month: '2-digit', year: 'numeric' })
          .formatToParts(d).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
        if (dateFormatPref === 'MM/DD/YYYY') return `${parts.month}/${parts.day}/${parts.year}`;
        if (dateFormatPref === 'YYYY-MM-DD') return `${parts.year}-${parts.month}-${parts.day}`;
        if (dateFormatPref === 'D MMM YYYY') return new Intl.DateTimeFormat(code, { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
        return `${parts.day}/${parts.month}/${parts.year}`; // DD/MM/YYYY
      }
      if (opts.time) {
        return new Intl.DateTimeFormat(code, { hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
      }
      return new Intl.DateTimeFormat(code, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(d);
    } catch {
      return d.toLocaleDateString();
    }
  }, [locale, dateFormatPref]);

  // Format a time string "HH:MM" according to locale (12h/24h from calendar settings)
  const formatTime = useCallback((timeStr, use24h = false) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(); d.setHours(h, m, 0);
    try {
      return new Intl.DateTimeFormat(locale.code, { hour: '2-digit', minute: '2-digit', hour12: !use24h }).format(d);
    } catch { return timeStr; }
  }, [locale]);

  // Format numbers locale-aware
  const formatNumber = useCallback((n, opts = {}) => {
    try { return new Intl.NumberFormat(locale.code, opts).format(n); }
    catch { return String(n); }
  }, [locale]);

  // Today's date formatted in the current locale
  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat(locale.code, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());
  }, [locale]);

  // Is the current locale RTL?
  const isRTL = locale.dir === 'rtl';

  const value = { t, formatDate, formatTime, formatNumber, todayFormatted, isRTL, locale, language };
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be inside LocaleProvider');
  return ctx;
}
