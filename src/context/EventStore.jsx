import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const EventStoreContext = createContext(null);

// ─── Storage keys ──────────────────────────────────────────────────
const LS_KEY         = 'aurora_events';
const LS_HISTORY_KEY = 'aurora_history';
const LS_SEEDED_KEY  = 'aurora_events_seeded'; // flag: prevents re-seeding after clear

// ─── Helpers ──────────────────────────────────────────────────────
function loadFromLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    // null means key doesn't exist; "" or "null" is invalid → fallback
    if (raw === null || raw === '' || raw === 'null') return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}

function saveToLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function removeFromLS(key) {
  try { localStorage.removeItem(key); } catch {}
}

function genId() {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function timeToMins(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function durationToMins(d) {
  if (!d) return 60;
  const hoursMatch = d.match(/(\d+(?:\.\d+)?)\s*h/);
  const minsMatch  = d.match(/(\d+)\s*m/);
  let total = 0;
  if (hoursMatch) total += parseFloat(hoursMatch[1]) * 60;
  if (minsMatch)  total += parseInt(minsMatch[1]);
  return total || 60;
}

function computeEndTime(startTime, duration) {
  const start = timeToMins(startTime);
  const end   = start + durationToMins(duration);
  return `${String(Math.floor(end / 60) % 24).padStart(2,'0')}:${String(end % 60).padStart(2,'0')}`;
}

// ─── Seed events (only on very first launch) ──────────────────────
function seedEvents() {
  const today = new Date().toISOString().split('T')[0];
  return [
    { id: genId(), title: 'Team Standup',        date: today, startTime: '09:00', endTime: '09:30', duration: '30 minutes', category: 'work',     color: 'purple', location: 'Zoom',        attendees: ['Ahmad','Sara'],  done: false, doneAt: null, createdAt: new Date().toISOString() },
    { id: genId(), title: 'Design Review',        date: today, startTime: '11:00', endTime: '12:00', duration: '1 hour',     category: 'work',     color: 'blue',   location: 'Board Room',  attendees: ['Raza','Amina'],  done: false, doneAt: null, createdAt: new Date().toISOString() },
    { id: genId(), title: 'Lunch Break',          date: today, startTime: '13:00', endTime: '14:00', duration: '1 hour',     category: 'personal', color: 'green',  location: '',            attendees: [],               done: false, doneAt: null, createdAt: new Date().toISOString() },
    { id: genId(), title: 'Client Presentation',  date: today, startTime: '15:00', endTime: '16:30', duration: '1.5 hours',  category: 'work',     color: 'amber',  location: 'Google Meet', attendees: ['Omar','Client'], done: false, doneAt: null, createdAt: new Date().toISOString() },
    { id: genId(), title: 'Sprint Planning',      date: today, startTime: '17:00', endTime: '18:00', duration: '1 hour',     category: 'work',     color: 'purple', location: 'Zoom',        attendees: ['Team'],         done: false, doneAt: null, createdAt: new Date().toISOString() },
  ];
}

// ─── Provider ─────────────────────────────────────────────────────
export function EventStoreProvider({ children }) {
  const [events, setEvents] = useState(() => {
    // KEY FIX: Check if key EXISTS in localStorage, NOT if array is non-empty.
    // This means: if the user has deleted all events, we respect that (empty []).
    // Only seed on the very first ever launch (key has never been written).
    const hasEverBeenSeeded = localStorage.getItem(LS_SEEDED_KEY) === 'true';
    const stored = loadFromLS(LS_KEY, null);

    if (stored !== null) {
      // Data has been saved before — use it (even if it's an empty array)
      return stored;
    }
    if (hasEverBeenSeeded) {
      // Cache was cleared after seeding — don't re-seed, start fresh
      return [];
    }
    // First ever launch: seed and mark as seeded
    const seed = seedEvents();
    saveToLS(LS_SEEDED_KEY, true);
    return seed;
  });

  const [history, setHistory] = useState(() => loadFromLS(LS_HISTORY_KEY, []));

  // Persist events and history on every change
  useEffect(() => { saveToLS(LS_KEY, events); }, [events]);
  useEffect(() => { saveToLS(LS_HISTORY_KEY, history); }, [history]);

  // ── Auto-mark done when event's endTime passes ─────────────────
  const autoMarkRef = useRef();
  const checkAutoMark = useCallback(() => {
    const now      = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const nowMins  = now.getHours() * 60 + now.getMinutes();

    setEvents(prev => {
      let changed = false;
      const updated = prev.map(ev => {
        if (ev.done) return ev;
        if (ev.date !== todayStr) return ev;
        const endMins = timeToMins(ev.endTime);
        if (nowMins >= endMins) {
          changed = true;
          return { ...ev, done: true, doneAt: new Date().toISOString(), autoMarked: true };
        }
        return ev;
      });
      return changed ? updated : prev;
    });
  }, []);

  useEffect(() => {
    checkAutoMark();
    autoMarkRef.current = setInterval(checkAutoMark, 60_000);
    return () => clearInterval(autoMarkRef.current);
  }, [checkAutoMark]);

  // ── Move done events to history after 3 seconds ────────────────
  const doneTimers = useRef({});
  useEffect(() => {
    events.forEach(ev => {
      if (ev.done && !doneTimers.current[ev.id]) {
        doneTimers.current[ev.id] = setTimeout(() => {
          setEvents(prev => prev.filter(e => e.id !== ev.id));
          setHistory(prev => {
            if (prev.some(h => h.id === ev.id)) return prev;
            return [ev, ...prev];
          });
          delete doneTimers.current[ev.id];
        }, 3000);
      }
    });
  }, [events]);

  // ── Add a new event ────────────────────────────────────────────
  const addEvent = useCallback((partial) => {
    const endTime  = computeEndTime(partial.startTime, partial.duration);
    const colorMap = { work: 'purple', personal: 'green', health: 'blue', social: 'amber' };
    const ev = {
      id:         genId(),
      title:      partial.title     || 'Untitled Event',
      date:       partial.date      || new Date().toISOString().split('T')[0],
      startTime:  partial.startTime || '09:00',
      endTime:    partial.endTime   || endTime,
      duration:   partial.duration  || '1 hour',
      category:   partial.category  || 'work',
      color:      partial.color     || colorMap[partial.category] || 'purple',
      location:   partial.location  || '',
      attendees:  partial.attendees || [],
      done:       false,
      doneAt:     null,
      autoMarked: false,
      createdAt:  new Date().toISOString(),
    };
    setEvents(prev => [...prev, ev].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    return ev;
  }, []);

  // ── Mark event done manually ───────────────────────────────────
  const markDone = useCallback((id) => {
    setEvents(prev => prev.map(ev =>
      ev.id === id ? { ...ev, done: true, doneAt: new Date().toISOString(), autoMarked: false } : ev
    ));
  }, []);

  // ── Undo done ─────────────────────────────────────────────────
  const undoDone = useCallback((id) => {
    if (doneTimers.current[id]) {
      clearTimeout(doneTimers.current[id]);
      delete doneTimers.current[id];
    }
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, done: false, doneAt: null } : ev));
  }, []);

  // ── Delete an event permanently ────────────────────────────────
  const deleteEvent = useCallback((id) => {
    // Cancel any pending done→history migration for this event
    if (doneTimers.current[id]) {
      clearTimeout(doneTimers.current[id]);
      delete doneTimers.current[id];
    }
    setEvents(prev => {
      const updated = prev.filter(ev => ev.id !== id);
      // Save immediately so refresh sees the deletion
      saveToLS(LS_KEY, updated);
      return updated;
    });
  }, []);

  // ── Delete single history item ─────────────────────────────────
  const deleteHistoryItem = useCallback((id) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      // Save immediately so refresh sees the deletion
      saveToLS(LS_HISTORY_KEY, updated);
      return updated;
    });
  }, []);

  // ── Clear history only ─────────────────────────────────────────
  const clearHistory = useCallback(() => {
    setHistory([]);
    removeFromLS(LS_HISTORY_KEY);
    saveToLS(LS_HISTORY_KEY, []); // Write empty array so null check works
  }, []);

  // ── FULL Clear Cache — wipes everything aurora_* ───────────────
  const clearAll = useCallback(() => {
    // Cancel all pending timers
    Object.values(doneTimers.current).forEach(clearTimeout);
    doneTimers.current = {};

    // Clear every aurora_ key
    const keysToRemove = Object.keys(localStorage).filter(k => k.startsWith('aurora_'));
    keysToRemove.forEach(k => removeFromLS(k));

    // Reset state in memory
    setEvents([]);
    setHistory([]);

    // Mark seeded=true so we don't auto-seed again after a clear
    saveToLS(LS_SEEDED_KEY, true);
    // Write explicit empty arrays
    saveToLS(LS_KEY, []);
    saveToLS(LS_HISTORY_KEY, []);
  }, []);

  // ── Computed views ────────────────────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = events
    .filter(ev => ev.date === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const upcomingEvents = events
    .filter(ev => ev.date > todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  const value = {
    events, history, todayEvents, upcomingEvents,
    addEvent, markDone, undoDone, deleteEvent,
    deleteHistoryItem, clearHistory, clearAll,
  };

  return <EventStoreContext.Provider value={value}>{children}</EventStoreContext.Provider>;
}

export function useEventStore() {
  const ctx = useContext(EventStoreContext);
  if (!ctx) throw new Error('useEventStore must be inside EventStoreProvider');
  return ctx;
}
