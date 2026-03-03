/**
 * Centralised user data store for the Aurora calendar app.
 * All AI components consume this data so insights are real, consistent, and derived
 * from the user's actual schedule, tasks, and behaviour patterns.
 */

import { createContext, useContext } from 'react';

// ─── User Profile ─────────────────────────────────────────────────
export const userProfile = {
  name: 'Alex Doe',
  email: 'alex.doe@aurora.dev',
  plan: 'Premium',
  avatar: 'https://ui-avatars.com/api/?name=Alex+Doe&background=8b5cf6&color=fff',
  timezone: 'UTC+5',
  workStart: '09:00',
  workEnd: '18:00',
  preferredFocusTime: 'morning',
  averagePrepTime: 20, // minutes before meetings
};

// ─── Today's Events (Mar 3 2026 - Monday) ─────────────────────────
export const todayEvents = [
  {
    id: 'e1',
    title: 'Team Standup',
    startTime: '09:00',
    endTime: '09:30',
    duration: '30 min',
    category: 'work',
    location: 'Zoom',
    attendees: ['Sarah', 'Ahmed', 'Fatima'],
    color: 'purple',
    status: 'upcoming',
  },
  {
    id: 'e2',
    title: 'Sprint Planning',
    startTime: '09:30',
    endTime: '11:00',
    duration: '1.5 hours',
    category: 'work',
    location: 'Google Meet',
    attendees: ['Ahmed', 'Omar', 'Sarah', 'Zain'],
    color: 'blue',
    status: 'upcoming',
  },
  {
    id: 'e3',
    title: 'Design Review with Fatima',
    startTime: '11:00',
    endTime: '12:00',
    duration: '1 hour',
    category: 'work',
    location: 'Tech Room',
    attendees: ['Fatima', 'Sarah'],
    color: 'green',
    status: 'upcoming',
  },
  {
    id: 'e4',
    title: 'Lunch Break',
    startTime: '12:00',
    endTime: '13:00',
    duration: '1 hour',
    category: 'personal',
    location: '',
    attendees: [],
    color: 'amber',
    status: 'upcoming',
  },
  {
    id: 'e5',
    title: 'Client Presentation - Aurora Demo',
    startTime: '14:00',
    endTime: '15:30',
    duration: '1.5 hours',
    category: 'work',
    location: 'Board Room',
    attendees: ['Ahmed', 'Client Team', 'Omar'],
    color: 'red',
    status: 'upcoming',
    isHighFocus: true,
  },
  {
    id: 'e6',
    title: '1:1 with Ahmed',
    startTime: '16:00',
    endTime: '16:30',
    duration: '30 min',
    category: 'work',
    location: 'Zoom',
    attendees: ['Ahmed'],
    color: 'purple',
    status: 'upcoming',
  },
];

// ─── Missed / Declined Events ──────────────────────────────────────
export const missedEvent = {
  id: 'e-missed',
  title: 'Weekly Sync with Omar',
  originalTime: 'Friday 3:00 PM',
  date: '2026-02-28',
  status: 'missed',
  attendees: ['Omar', 'Sarah'],
  reason: 'Conflict with client call',
};

// ─── Weekly Schedule Data (Feb 24 - Mar 2) ─────────────────────────
export const weeklyData = {
  days: [
    { day: 'Mon', events: 5, focusHours: 2.5, meetingHours: 4, tasksCompleted: 4, tasksTotal: 5 },
    { day: 'Tue', events: 4, focusHours: 3, meetingHours: 3.5, tasksCompleted: 3, tasksTotal: 4 },
    { day: 'Wed', events: 6, focusHours: 1.5, meetingHours: 5, tasksCompleted: 5, tasksTotal: 7 },
    { day: 'Thu', events: 3, focusHours: 4, meetingHours: 2, tasksCompleted: 4, tasksTotal: 4 },
    { day: 'Fri', events: 5, focusHours: 3, meetingHours: 3.5, tasksCompleted: 3, tasksTotal: 5 },
    { day: 'Sat', events: 1, focusHours: 5, meetingHours: 0.5, tasksCompleted: 2, tasksTotal: 2 },
    { day: 'Sun', events: 2, focusHours: 3.5, meetingHours: 1, tasksCompleted: 1, tasksTotal: 2 },
  ],
  totalFocusHours: 22.5,
  totalMeetingHours: 19.5,
  totalTasksCompleted: 22,
  totalTasks: 29,
  get taskCompletionRate() { return Math.round((this.totalTasksCompleted / this.totalTasks) * 100); },
  get productivityScore() { 
    // Weighted: focus ratio (40%) + task completion (40%) + balance penalty (20%)
    const focusRatio = this.totalFocusHours / (this.totalFocusHours + this.totalMeetingHours);
    const taskRate = this.totalTasksCompleted / this.totalTasks;
    const balance = 1 - Math.abs(focusRatio - 0.55); // ideal ~55% focus
    return Math.round((focusRatio * 40 + taskRate * 40 + balance * 20));
  },
  previousWeekScore: 69,
  get scoreChange() { return this.productivityScore - this.previousWeekScore; },
};

// ─── Heatmap: Hourly Intensity (6am-10pm) ──────────────────────────
// Derived from actual meeting density across the week
export const hourlyIntensity = [
  { hour: 6, intensity: 5 },
  { hour: 7, intensity: 10 },
  { hour: 8, intensity: 25 },
  { hour: 9, intensity: 85 },  // standup + sprint planning
  { hour: 10, intensity: 70 }, // sprint planning continues
  { hour: 11, intensity: 60 }, // design review
  { hour: 12, intensity: 15 }, // lunch
  { hour: 13, intensity: 10 }, // free
  { hour: 14, intensity: 90 }, // client presentation
  { hour: 15, intensity: 65 }, // presentation overrun
  { hour: 16, intensity: 45 }, // 1:1
  { hour: 17, intensity: 20 }, // winding down
  { hour: 18, intensity: 5 },
  { hour: 19, intensity: 5 },
  { hour: 20, intensity: 0 },
  { hour: 21, intensity: 0 },
  { hour: 22, intensity: 0 },
];

// ─── Detected Conflicts ────────────────────────────────────────────
export const detectedConflicts = [
  {
    type: 'overlap',
    severity: 'high',
    summary: 'Standup runs into Sprint Planning (9:00–9:30 overlaps 9:30–11:00)',
    suggestion: 'Start Sprint Planning at 9:45 AM for a 15-min buffer',
    events: ['e1', 'e2'],
  },
  {
    type: 'overload',
    severity: 'medium',
    summary: '3 back-to-back meetings from 9:00 AM to 12:00 PM',
    suggestion: 'Add a 15-min break between Design Review and Lunch',
    events: ['e1', 'e2', 'e3'],
  },
];

// ─── Burnout Metrics ───────────────────────────────────────────────
export const burnoutData = {
  riskLevel: 'medium',
  message: '3 back-to-back meetings this morning (9 AM – 12 PM)',
  suggestedAction: 'Insert 15-min break after Sprint Planning',
  backToBackCount: 3,
  workHoursToday: 7.5,
  consecutiveLongDays: 3, // 3 days over 8h this week
};

// ─── Focus Time Windows ────────────────────────────────────────────
export const focusTimeData = {
  suggestedBlock: '1:00 PM – 2:00 PM',
  confidence: 'High',
  reason: 'No meetings, post-lunch dip recovery period. You had focused deep work here last 4 Mondays.',
  focusHours: [13], // 1pm
  allFreeSlots: [
    { start: '13:00', end: '14:00', label: '1:00 PM – 2:00 PM' },
    { start: '17:00', end: '18:00', label: '5:00 PM – 6:00 PM' },
  ],
};

// ─── Smart Time Slot Suggestions ───────────────────────────────────
export const suggestedSlots = [
  { time: '1:00 PM – 2:00 PM', confidence: 94, reason: 'Only free slot before 4 PM', icon: '🎯' },
  { time: '5:00 PM – 6:00 PM', confidence: 72, reason: 'End of day, low interruption', icon: '🌅' },
  { time: 'Tomorrow 8:00 AM', confidence: 88, reason: 'Fresh start, no early meetings', icon: '☀️' },
];

// ─── Smart Reminder Behaviour ──────────────────────────────────────
export const reminderBehaviour = {
  recommendedTime: '20 minutes before',
  behaviorNote: 'You opened prep docs 20 min before your last 8 meetings',
  autoMode: true,
  snoozePattern: 'You snooze 5-min reminders 80% of the time',
  upcomingEvent: todayEvents[0], // next event
};

// ─── Reschedule Suggestions ────────────────────────────────────────
export const rescheduleSuggestions = [
  { time: 'Monday 1:00 PM (Today)', reason: 'Both free, no conflicts', confidence: 94 },
  { time: 'Tuesday 10:00 AM', reason: 'Omar has light schedule', confidence: 82 },
  { time: 'Wednesday 3:00 PM', reason: 'Matches original recurring slot', confidence: 75 },
];

// ─── User Goals ────────────────────────────────────────────────────
export const userGoals = [
  { id: 'g1', title: 'Complete Aurora v2 dashboard', progress: 75, deadline: 'Mar 7' },
  { id: 'g2', title: 'Prepare client demo deck', progress: 40, deadline: 'Mar 3' },
  { id: 'g3', title: 'Review PRs from team', progress: 90, deadline: 'Mar 4' },
  { id: 'g4', title: 'Write API documentation', progress: 20, deadline: 'Mar 10' },
];

// ─── Context (for sharing across component tree) ───────────────────
export const UserDataContext = createContext(null);

export function useUserData() {
  return useContext(UserDataContext);
}
