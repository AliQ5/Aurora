const guideContent = {
  title: { en: 'Aurora User Guide', ur: 'اورورا صارف گائیڈ', zh: 'Aurora 用户指南' },
  subtitle: { en: 'Your complete guide to mastering the AI-powered calendar', ur: 'AI سے چلنے والے کیلنڈر میں مہارت حاصل کرنے کی مکمل گائیڈ', zh: '掌握AI日历的完整指南' },
  tableOfContents: { en: 'Table of Contents', ur: 'فہرست', zh: '目录' },

  chapters: [
    {
      id: 'getting-started',
      icon: '🚀',
      image: '/guide/ch1_dashboard.png',
      title: { en: 'Getting Started', ur: 'شروع کرنا', zh: '入门指南' },
      description: { en: 'Learn the basics and navigate your workspace.', ur: 'بنیادی باتیں سیکھیں اور ورک اسپیس میں نیویگیٹ کریں۔', zh: '了解基础知识并浏览您的工作区。' },
      sections: [
        {
          title: { en: 'The Overview Dashboard', ur: 'جائزہ ڈیش بورڈ', zh: '概览仪表盘' },
          tip: { en: '💡 Pro Tip: The dashboard updates in real-time — your schedule refreshes automatically as you add events.', ur: '💡 پرو ٹپ: ڈیش بورڈ ریئل ٹائم میں اپ ڈیٹ ہوتا ہے۔', zh: '💡 专业提示：仪表盘会实时更新。' },
          content: {
            en: 'When you first open Aurora, you see the **Overview Dashboard** — your command center.\n\n**Four key areas:**\n- **Calendar Widget** (left) — Browse months, today is highlighted in purple\n- **Schedule Panel** (right) — All events for the day with attendee avatars, locations, and time slots. Color-coded by type: purple = meetings, green = focus, yellow = lunch\n- **Goals Widget** (bottom-left) — Track 4 dynamic goals computed from your real event data: today\'s schedule, work tasks, life balance, and weekly target\n- **AI Scheduler** (bottom-right) — Type natural language to instantly create events\n\n**Reading the schedule:**\n1. Events show start–end time on the left\n2. Attendee avatars (up to 3 shown, +N for extras)\n3. Location chip with 📍 or Zoom/Meet icon\n4. A red **NOW** line with timestamp shows current time position and pulses\n5. Active event shows a **LIVE** badge that pulses\n6. ✓ button on each event to **mark it done** manually\n7. 🗑 button appears on hover to **delete** with confirmation\n8. Done events animate out and move to **History** after 3 seconds',
            ur: 'جب آپ اورورا کھولتے ہیں تو **جائزہ ڈیش بورڈ** نظر آتا ہے۔\n\n**چار اہم حصے:**\n- **کیلنڈر ویجٹ** (بائیں) — مہینے براؤز کریں\n- **شیڈول پینل** (دائیں) — دن کے ایونٹس\n- **اہداف ویجٹ** (نیچے) — حقیقی ڈیٹا سے 4 اہداف\n- **AI شیڈیولر** — قدرتی زبان سے ایونٹ بنائیں',
            zh: '打开Aurora时，您会看到**概览仪表盘**。\n\n**四个关键区域：**\n- **日历小部件**（左）— 浏览月份\n- **日程面板**（右）— 当天所有事件\n- **目标小部件**（下）— 从真实数据计算的4个目标\n- **AI调度器** — 用自然语言创建事件',
          },
        },
        {
          title: { en: 'Navigation — Desktop & Mobile', ur: 'نیویگیشن — ڈیسک ٹاپ اور موبائل', zh: '导航 — 桌面与移动端' },
          content: {
            en: '**Desktop sidebar (left):**\n- 🏠 Dashboard — Daily overview with schedule, goals, and AI scheduler\n- 📅 Calendar — Full month view\n- 📋 History — All completed events grouped by date\n- ⚙️ Settings — 10 settings sections\n- 🌙 Theme toggle — Switch light/dark at the bottom\n\n**Mobile bottom nav:**\n- Tap icons to switch sections\n- Center **＋ FAB** creates a new event instantly\n- Active tab shows a purple underline indicator\n\n**Keyboard shortcuts (desktop):**\n- ⌘K — Command palette\n- ⌘N — New event\n- ⌘T — Toggle theme\n- G C — Go to Calendar\n- G D — Go to Dashboard',
            ur: '**ڈیسک ٹاپ سائیڈ بار (بائیں):**\n- 🏠 ڈیش بورڈ\n- 📅 کیلنڈر\n- 📋 ہسٹری — مکمل شدہ ایونٹس\n- ⚙️ ترتیبات\n- 🌙 تھیم ٹوگل\n\n**موبائل نیچے نیو:**\n- آئیکنز ٹیپ کریں\n- درمیانی ＋ بٹن — نیا ایونٹ',
            zh: '**桌面侧边栏（左）：**\n- 🏠 仪表盘\n- 📅 日历\n- 📋 历史\n- ⚙️ 设置\n- 🌙 主题切换\n\n**移动端底部导航：**\n- 点击图标切换\n- 中间＋按钮创建新事件',
          },
        },
      ],
    },

    {
      id: 'schedule-events',
      icon: '📅',
      title: { en: 'Live Schedule & Event Management', ur: 'لائیو شیڈول اور ایونٹ مینجمنٹ', zh: '实时日程和事件管理' },
      description: { en: 'Create, manage, and track events in real-time.', ur: 'ریئل ٹائم میں ایونٹس بنائیں، منظم کریں اور ٹریک کریں۔', zh: '实时创建、管理和跟踪事件。' },
      sections: [
        {
          title: { en: 'Creating & Viewing Events', ur: 'ایونٹس بنانا اور دیکھنا', zh: '创建和查看事件' },
          tip: { en: '💡 Pro Tip: New events are sorted by time automatically and appear instantly in the schedule. Try "Gym tomorrow 7am for 1 hour" — it creates a health-category event with green color.', ur: '💡 پرو ٹپ: نئے ایونٹ خودکار وقت کے مطابق ترتیب دیے جاتے ہیں۔', zh: '💡 专业提示：新事件自动按时间排序并立即显示。' },
          content: {
            en: '**How events are born:**\n1. Type in the **AI Scheduler** box at the bottom of the Dashboard\n2. Examples: "Team standup tomorrow 9am Zoom 30 minutes" or "Lunch Friday noon"\n3. The AI parser extracts: title, date, time, duration, category, location\n4. Event appears **instantly** in your Schedule panel — no page reload needed\n\n**What you see on each event card:**\n- 🕐 Start and end time (12-hour format)\n- 📝 Event title in bold\n- ⏱ Duration (e.g. "1 hour", "30 minutes")\n- 📍 Location with Zoom/Meet icon if virtual\n- 👥 Attendee badges (up to 3 shown)\n- Color-coded by category: purple = work, green = personal, blue = health, amber = social\n\n**The NOW line:**\n- A pulsing red dot with current time\n- Appears between past and upcoming events\n- Updates every 30 seconds\n- Shows "Now 2:15 PM" label\n\n**LIVE badge:**\n- When an event is currently happening, it gets a glowing purple "LIVE" badge\n- The event card gets a subtle ring highlight\n- The timeline connector turns purple\n\n**Upcoming events:**\n- Events from future dates appear in a separate "Upcoming" section at the bottom\n- Shows date, time, and a small colored dot',
          },
        },
        {
          title: { en: 'Marking Events Done & Auto-Completion', ur: 'ایونٹس مکمل اور خودکار تکمیل', zh: '标记完成和自动完成' },
          tip: { en: '💡 Pro Tip: You have 3 seconds to undo a "done" mark before it moves to History. Hit the ↩ button quickly!', ur: '💡 پرو ٹپ: مکمل کو واپس کرنے کے لیے 3 سیکنڈ ہیں۔ ↩ بٹن جلدی دبائیں!', zh: '💡 专业提示：标记完成后有3秒时间撤销。' },
          content: {
            en: '**Manual completion:**\n1. Click the ✓ (check) button on any event card\n2. Event gets a "✓ Done" badge and title shows strikethrough\n3. Card fades to 40% opacity\n4. After **3 seconds**, event smoothly animates out and moves to **History**\n5. Within those 3 seconds, click ↩ (undo) to keep it in your schedule\n\n**Auto-completion:**\n- Events are automatically marked done when their **end time passes**\n- Checked every 60 seconds by the system\n- Auto-completed events get a special "auto" badge in History\n- This means you never have stale events cluttering your schedule\n\n**Deleting events:**\n1. Hover over an event to reveal the 🗑 trash icon\n2. Click it once — a confirmation appears (✕ to confirm, ↩ to cancel)\n3. Deleted events are **permanently removed** — they don\'t go to History\n4. Deletion persists even after page refresh\n\n**Data persistence:**\n- All events are saved in **localStorage** — they survive page refreshes and browser restarts\n- When you delete an event, it stays deleted forever\n- No internet connection required for any event operations',
          },
        },
      ],
    },

    {
      id: 'history',
      icon: '📋',
      title: { en: 'History — Your Completed Events Archive', ur: 'ہسٹری — آپ کا مکمل شدہ ایونٹس آرکائیو', zh: '历史记录 — 已完成事件存档' },
      description: { en: 'Browse, search, and manage all your past events.', ur: 'اپنے تمام ماضی کے ایونٹس براؤز، تلاش اور انتظام کریں۔', zh: '浏览、搜索和管理所有过去的事件。' },
      sections: [
        {
          title: { en: 'History Page Overview', ur: 'ہسٹری پیج کا جائزہ', zh: '历史页面概述' },
          tip: { en: '💡 Pro Tip: Use the search bar to find any old event instantly. Try searching by title, date, or category keyword.', ur: '💡 پرو ٹپ: سرچ بار سے پرانے ایونٹ فوری تلاش کریں۔', zh: '💡 专业提示：使用搜索栏即时查找任何旧事件。' },
          content: {
            en: 'Navigate to the **History** tab from the sidebar or bottom nav to see all your completed events.\n\n**Page layout:**\n- **Header** — Shows total completed items count and a "Clear All" button (with confirmation)\n- **Overview stats** (expandable) — 6 stat cards showing:\n  - Total completed events\n  - Total hours spent\n  - Work events count\n  - Personal events count\n  - Health events count\n  - Social events count\n\n**5 Filter tabs:**\n- **All History** — Every completed event\n- **Work** — Only work-category events (💼 icon)\n- **Personal** — Personal events (👤 icon)\n- **Health** — Health events (❤️ icon)\n- **Social** — Social events (👥 icon)\n- Each tab shows a count badge if it has items\n\n**Search bar:**\n- Type to instantly filter by event title\n- Clear (✕) button to reset\n\n**Timeline view:**\n- Events grouped by date (newest first)\n- Sticky date headers: "Wednesday, Mar 4 (3 items)"\n- Each event card shows:\n  - Category icon with color\n  - Title with strikethrough (marked done)\n  - "✓ Done" badge + optional "auto" badge if auto-completed\n  - Date, time range, duration, location\n  - "Completed Mar 4, 2026 at 2:30 PM" timestamp',
          },
        },
        {
          title: { en: 'Managing History', ur: 'ہسٹری کا انتظام', zh: '管理历史记录' },
          content: {
            en: '**Deleting individual items:**\n1. Hover over a history card to reveal the 🗑 trash icon\n2. Click it — "Delete" and "Keep" buttons appear\n3. Click "Delete" to permanently remove from history\n4. Deletion is instant and saved to localStorage\n\n**Clearing all history:**\n1. Click the red **"Clear All"** button at the top\n2. A confirmation banner appears: "This permanently deletes all history"\n3. Click **"Yes, clear"** to wipe everything, or **"Cancel"** to keep it\n4. This removes all history from localStorage\n\n**Clearing from Settings:**\n1. Go to **Settings → Data & Sync**\n2. Click **"Clear Cache"** button\n3. This wipes ALL Aurora data: events, history, preferences\n4. After clearing, the schedule starts fresh (no re-seeded sample events)\n\n**History is permanent:**\n- History data is saved in localStorage under the key `aurora_history`\n- It survives page refreshes, browser restarts, and app updates\n- The only ways to remove history are: individual delete, Clear All, or Settings Clear Cache',
          },
        },
      ],
    },

    {
      id: 'goals',
      icon: '🎯',
      title: { en: 'Dynamic Goals — Real-Time Progress', ur: 'متحرک اہداف — ریئل ٹائم پیشرفت', zh: '动态目标 — 实时进度' },
      description: { en: 'Track 4 smart goals computed from your actual events.', ur: 'اپنے اصل ایونٹس سے 4 سمارٹ اہداف ٹریک کریں۔', zh: '从实际事件计算的4个智能目标。' },
      sections: [
        {
          title: { en: 'How Goals Work', ur: 'اہداف کیسے کام کرتے ہیں', zh: '目标如何运作' },
          tip: { en: '💡 Pro Tip: Complete your events consistently and watch your "Weekly Target" goal fill up! The target is 15 events/week.', ur: '💡 پرو ٹپ: مسلسل ایونٹس مکمل کریں اور ہفتہ وار ہدف بھرتا دیکھیں!', zh: '💡 专业提示：持续完成事件，观察"每周目标"进度条填满！' },
          content: {
            en: 'The Goals widget on the Dashboard is **fully dynamic** — no dummy data. It computes 4 real goals from your EventStore:\n\n**Goal 1: Today\'s Schedule**\n- Formula: completed today\'s events ÷ total today\'s events\n- Shows: "Today\'s schedule (3/5)" → 60%\n- Includes both active events and today\'s history items\n\n**Goal 2: Work Tasks**\n- Formula: completed work-category events ÷ total work events today\n- Shows: "Work tasks (2/4)" → 50%\n- Only counts events with category = "work"\n\n**Goal 3: Life Balance**\n- Formula: completed personal + health events ÷ total personal + health events\n- Shows: "Life balance (1/2)" → 50%\n- Encourages maintaining non-work activities\n\n**Goal 4: Weekly Target**\n- Formula: history items completed in last 7 days ÷ 15 (target)\n- Shows: "Weekly target (12/15)" → 80%\n- Motivates consistent daily productivity\n\n**Visual elements:**\n- **Circular progress ring** — Animated gradient ring showing overall % (average of all 4 goals)\n- **Individual bars** — Color-coded: green ≥100%, purple ≥70%, amber ≥40%, red <40%\n- **Checkmark icon** — Filled green circle for completed goals (100%)\n- **Done counter** — "2/4 done" badge in the header\n- All values update **instantly** when you mark events done or add new ones',
          },
        },
      ],
    },

    {
      id: 'natural-language',
      icon: '✨',
      image: '/guide/ch2_natural_language.png',
      title: { en: 'Natural Language Event Creation', ur: 'قدرتی زبان سے ایونٹ بنانا', zh: '自然语言创建事件' },
      description: { en: 'Type naturally — AI understands and creates your event.', ur: 'قدرتی طور پر لکھیں — AI سمجھ کر ایونٹ بناتا ہے۔', zh: '自然输入，AI理解并创建事件。' },
      sections: [
        {
          title: { en: 'How to Create Events with Natural Language', ur: 'قدرتی زبان سے ایونٹ کیسے بنائیں', zh: '如何用自然语言创建事件' },
          tip: { en: '💡 Pro Tip: Include multiple details in one sentence: "Lunch with Sarah Friday noon Google Meet 1 hour" — the parser handles all of it offline!', ur: '💡 پرو ٹپ: ایک جملے میں تمام تفصیلات شامل کریں۔', zh: '💡 专业提示：一句话包含所有细节。' },
          content: {
            en: '1. Click **"+ New Event"** or use the AI Scheduler box on the Dashboard\n2. Type naturally: **"Meeting with Ahmed tomorrow at 3pm Board Room for 2 hours"**\n3. AI parses and shows a preview card with:\n   - **Title:** Meeting with Ahmed\n   - **Date:** Tomorrow (auto-resolved to actual date)\n   - **Time:** 3:00 PM\n   - **Duration:** 2 hours\n   - **Location:** Board Room\n   - **Category:** work (auto-detected)\n   - **Confidence:** 94% ✅\n4. Click **Confirm** to save — it appears instantly in your Schedule!\n\n**The parser works 100% offline.** It uses smart regex, not an API. Here\'s what it detects:\n\n**Date parsing:**\n- Relative: "today", "tomorrow", "next week"\n- Named days: "Monday", "next Friday", "this Wednesday"\n- Named months: "March 15", "Jan 20"\n- Full dates: "2026-03-15"\n\n**Time parsing:**\n- 12-hour: "3pm", "10:30 AM", "3:45pm"\n- 24-hour: "15:00", "09:30"\n- Keywords: "morning" (9 AM), "noon" (12 PM), "afternoon" (2 PM), "evening" (6 PM)\n\n**Duration parsing:**\n- "for 2 hours", "30 minutes", "1.5 hours"\n- "half hour", "quarter hour"\n\n**Category auto-detection:**\n- 💼 **Work**: meeting, standup, review, sprint, presentation\n- 🏃 **Health**: gym, workout, run, yoga, dentist, doctor\n- 👥 **Social**: lunch, dinner, coffee, party, drinks\n- 👤 **Personal**: everything else\n\n**More examples:**\n- "Dentist March 15 at 2pm"\n- "Sprint review next Monday 10am for 2 hours"\n- "Gym tomorrow morning"\n- "Lunch with team Friday noon"\n- "Client call at 4:30pm 45 minutes"',
          },
        },
      ],
    },

    {
      id: 'productivity-wellness',
      icon: '📊',
      title: { en: 'Productivity Score & Wellness Alert', ur: 'پیداواری اسکور اور صحت الرٹ', zh: '生产力评分与健康警报' },
      description: { en: 'Monitor performance and prevent burnout with real data.', ur: 'حقیقی ڈیٹا سے کارکردگی کی نگرانی اور برن آؤٹ سے بچاؤ۔', zh: '用真实数据监控表现并预防倦怠。' },
      sections: [
        {
          title: { en: 'Productivity Score — How It\'s Calculated', ur: 'پیداواری اسکور — کیسے حساب ہوتا ہے', zh: '生产力评分 — 如何计算' },
          tip: { en: '💡 Pro Tip: Block 2 hours of focus time daily. This alone can push your score from 65 to 80+.', ur: '💡 پرو ٹپ: روزانہ 2 گھنٹے فوکس ٹائم بلاک کریں۔', zh: '💡 专业提示：每天锁定2小时专注时间。' },
          content: {
            en: 'The Productivity Score uses **real data from your EventStore** — not dummy numbers.\n\n**Score formula (0–100):**\n- **Focus ratio (40%)** — Solo events ÷ total completed events this week\n- **Task completion (40%)** — Whether you completed any tasks\n- **Balance (20%)** — How close your focus/meeting ratio is to the ideal 55%\n\n**What you see on the card:**\n- Animated circular ring with your current score\n- **±X%** trend compared to last week (green = up, red = down)\n- 4 stat boxes: Focus hours, Meeting hours, Done today, This week total\n- **Daily bar chart** — 7 bars (Sun–Mon) showing completed events per day\n- Today\'s bar is highlighted in your accent color\n- AI insight message at the bottom: "🔥 Excellent!" / "👍 Good" / "⚡ Room for improvement"\n\n**Score ranges:**\n- 🟢 **80–100** — Excellent, sustainable pace\n- 🟡 **60–79** — Good, room for improvement\n- 🔴 **Below 60** — Warning: overloaded or under-focused',
          },
        },
        {
          title: { en: 'Wellness Alert — Burnout Prevention', ur: 'صحت الرٹ — برن آؤٹ سے بچاؤ', zh: '健康警报 — 预防倦怠' },
          content: {
            en: 'The Wellness Alert monitors your **actual schedule** for burnout risk.\n\n**What it checks:**\n1. **Back-to-back meetings** — Events with less than 15 minutes gap\n2. **Total work hours** — Sum of all event durations today\n\n**Risk levels:**\n- 🟢 **LOW** (green card) — Schedule looks balanced. Back-to-back < 2, work < 7h\n  - Advice: "Keep maintaining breaks between meetings"\n- 🟡 **MEDIUM** (amber card) — 2+ back-to-back meetings OR 7+ hours\n  - Advice: "Insert a 15-min break between meetings"\n- 🔴 **HIGH** (red card) — 3+ back-to-back OR 9+ hours\n  - Advice: "Take a break now — schedule a 30-min recovery block"\n\n**Visual indicators:**\n- Battery icon with total work hours\n- Coffee icon with back-to-back count\n- Heart icon with action suggestion\n- Card background color matches risk level',
          },
        },
      ],
    },

    {
      id: 'focus-time',
      icon: '👁️',
      title: { en: 'Focus Time Detection', ur: 'فوکس ٹائم ڈیٹیکشن', zh: '专注时间检测' },
      description: { en: 'AI finds your best deep-work windows automatically.', ur: 'AI آپ کی بہترین ڈیپ ورک ونڈوز خودکار تلاش کرتا ہے۔', zh: 'AI自动找到最佳深度工作窗口。' },
      sections: [
        {
          title: { en: 'How Focus Time Works', ur: 'فوکس ٹائم کیسے کام کرتا ہے', zh: '专注时间如何工作' },
          tip: { en: '💡 Pro Tip: The longest free slot is always shown first. Schedule your most important deep work there!', ur: '💡 پرو ٹپ: سب سے لمبا خالی سلاٹ پہلے دکھایا جاتا ہے۔', zh: '💡 专业提示：最长空闲时段总是首先显示。' },
          content: {
            en: 'Focus Time Detection scans your **actual today\'s schedule** to find free slots between 8 AM and 8 PM.\n\n**How it works:**\n1. Collects all your today\'s non-done events\n2. Sorts them by start time\n3. Finds gaps ≥ 30 minutes between events\n4. Ranks them by length (longest = best)\n\n**The "Best Window" card shows:**\n- Time range (e.g. "1:00 PM – 3:00 PM")\n- Confidence badge: High (≥2h), Medium (≥1h), Low (<1h)\n- Reason: "2h uninterrupted block. Perfect for deep work."\n\n**All Free Slots list:**\n- Shows up to 3 available slots with their duration in minutes\n- Updates live as you add/remove/complete events\n\n**Confidence levels:**\n- **High** — 2+ hours uninterrupted. Ideal for deep focus work\n- **Medium** — 1–2 hours. Enough for focused tasks\n- **Low** — Under 1 hour. Good for quick tasks only\n\n**If no free time exists:**\n- Shows "No free time found" with message "Your schedule is fully packed today"',
          },
        },
      ],
    },

    {
      id: 'smart-time',
      icon: '⏰',
      title: { en: 'Smart Time Slot Suggestions', ur: 'سمارٹ ٹائم سلاٹ تجاویز', zh: '智能时间段建议' },
      description: { en: 'AI finds the best time for your next meeting across today and tomorrow.', ur: 'AI آج اور کل میں بہترین وقت تلاش کرتا ہے۔', zh: 'AI在今明两天找到最佳时间。' },
      sections: [
        {
          title: { en: 'Reading Smart Time Suggestions', ur: 'سمارٹ ٹائم تجاویز سمجھنا', zh: '阅读智能时间建议' },
          tip: { en: '💡 Pro Tip: Morning slots (☀️) tend to have higher confidence — fewer interruptions early in the day.', ur: '💡 پرو ٹپ: صبح کے سلاٹس (☀️) میں اعتماد زیادہ ہوتا ہے۔', zh: '💡 专业提示：上午时段置信度更高。' },
          content: {
            en: '**How slots are found:**\n1. AI scans **today\'s and tomorrow\'s** events from your EventStore\n2. Finds all gaps ≥ 30 minutes between 8 AM and 8 PM\n3. Ranks the **top 3** by length (longer = more confident)\n4. Assigns icons based on time of day\n\n**Slot card format:**\n- Time range: "Today 1:00 PM – 3:00 PM"\n- Reason: "2h uninterrupted — best for deep work"\n- Confidence bar with percentage\n- Day icon: ☀️ (morning), 🎯 (afternoon), 🌅 (evening)\n\n**Confidence scoring:**\n- **90%+** — 2+ hour gap with no nearby events\n- **70–89%** — 1–2 hour gap\n- **Below 70%** — Short gap, but still usable\n\n**Empty state:**\n- If no slots found: "No free slots detected today or tomorrow"\n- This means your schedule is fully packed — consider rescheduling!',
          },
        },
      ],
    },

    {
      id: 'conflict-detection',
      icon: '⚠️',
      title: { en: 'AI Conflict Detection', ur: 'AI تنازعات کی نشاندہی', zh: 'AI冲突检测' },
      description: { en: 'Automatically detect scheduling issues and get fixes.', ur: 'شیڈولنگ مسائل خودکار تلاش اور حل تجاویز۔', zh: '自动检测日程问题并获取修复建议。' },
      sections: [
        {
          title: { en: 'Types of Conflicts', ur: 'تنازعات کی اقسام', zh: '冲突类型' },
          tip: { en: '💡 Pro Tip: Overlapping events show as "HIGH" severity — fix these first! Tight gaps are just warnings.', ur: '💡 پرو ٹپ: اوور لیپنگ ایونٹس "اعلی" شدت دکھاتے ہیں — پہلے ان کو ٹھیک کریں!', zh: '💡 专业提示：重叠事件显示为"高"严重度 — 优先修复！' },
          content: {
            en: 'Conflict Detection scans your **actual today\'s events** and detects 4 types of issues:\n\n**🔴 HIGH — Overlap**\nTwo events share the same time. Example: "Design Review" ends at 12:00 but "Client Call" starts at 11:45.\n- Shows: exact overlap times for both events\n- Suggestion: "Move Client Call to 12:15 PM"\n\n**🟡 MEDIUM — Zero Gap**\nOne event ends exactly when another starts — no transition time.\n- Shows: "No gap between Design Review and Client Call"\n- Suggestion: "Add a 15-min buffer — start Client Call at 12:15"\n\n**🔵 LOW — Tight Gap**\nLess than 15 minutes between events — not enough for context switching.\n- Shows: "Only 10min between Meeting A and Meeting B"\n- Suggestion: "Consider adding a short break for context switching"\n\n**🟡 MEDIUM — Overload**\n5+ events scheduled in a single day — heavy workload.\n- Shows: "6 events scheduled today — heavy day"\n- Suggestion: "Consider rescheduling non-essential items to tomorrow"\n\n**Clean schedule:**\n- If no conflicts: shows ✅ "No conflicts detected — Your schedule looks clean"\n\n**Each conflict card shows:**\n- Severity badge (HIGH/MEDIUM/LOW) with color\n- Warning icon matching severity\n- Description of the issue\n- ➡️ Suggested fix',
          },
        },
      ],
    },

    {
      id: 'task-breakdown',
      icon: '📝',
      title: { en: 'Auto Task Breakdown', ur: 'خودکار ٹاسک تقسیم', zh: '自动任务分解' },
      description: { en: 'AI splits long events into manageable subtasks.', ur: 'AI طویل ایونٹس کو قابل انتظام ذیلی کاموں میں تقسیم کرتا ہے۔', zh: 'AI将长事件分解为可管理的子任务。' },
      sections: [
        {
          title: { en: 'How Task Breakdown Works', ur: 'ٹاسک تقسیم کیسے کام کرتی ہے', zh: '任务分解如何工作' },
          tip: { en: '💡 Pro Tip: Only events ≥ 45 minutes get broken down. Short meetings don\'t need subtasks!', ur: '💡 پرو ٹپ: صرف 45+ منٹ کے ایونٹس تقسیم ہوتے ہیں۔', zh: '💡 专业提示：仅≥45分钟的事件会被分解。' },
          content: {
            en: 'Task Breakdown automatically generates **smart subtasks** for events ≥ 45 minutes based on their category:\n\n**Work meetings with attendees:**\n1. Prep & review materials (15% of time)\n2. The meeting itself (65% of time)\n3. Document action items (20% of time)\n\n**Solo work events:**\n1. Set focus mode (5 min)\n2. Deep work session (70% of time)\n3. Review & wrap up (20% of time)\n4. Quick break (5 min)\n\n**Health events:**\n1. Warm up (15% of time)\n2. Main activity (70% of time)\n3. Cool down & stretch (15% of time)\n\n**Other events:**\n1. Main event (80% of time)\n2. Transition time (20% of time)\n\n**Using the card:**\n- Each event appears as a collapsible row\n- Shows event title, time, duration, and "X steps" count\n- Click to expand and see all subtasks with time allocations\n- Each subtask shows a checkbox and time in minutes\n- Count badge shows how many events have breakdowns',
          },
        },
      ],
    },

    {
      id: 'smart-reminders',
      icon: '🔔',
      title: { en: 'Smart Reminders & Push Notifications', ur: 'سمارٹ ریمائنڈرز اور پش اطلاعات', zh: '智能提醒和推送通知' },
      description: { en: 'Get real-time alerts before your events start.', ur: 'ایونٹس شروع ہونے سے پہلے ریئل ٹائم الرٹس حاصل کریں۔', zh: '在事件开始前获得实时提醒。' },
      sections: [
        {
          title: { en: 'How Smart Reminders Work', ur: 'سمارٹ ریمائنڈرز کیسے کام کرتے ہیں', zh: '智能提醒如何工作' },
          tip: { en: '💡 Pro Tip: Enable browser push notifications in Settings → Notifications. You\'ll get a native OS notification when events are about to start!', ur: '💡 پرو ٹپ: ترتیبات → اطلاعات میں پش اطلاعات فعال کریں!', zh: '💡 专业提示：在设置→通知中启用推送通知！' },
          content: {
            en: '**What Smart Reminders shows:**\n\n**Next Up card:**\n- Your very next upcoming event with title, time, and location\n- Countdown: "Starting in 12 min!" with pulsing bell icon when imminent\n- Badge changes from grey to amber when event is within reminder time\n- Location shown with 📍 icon\n\n**Later Today list:**\n- Up to 3 additional upcoming events\n- Compact list with dot indicator, title, and time\n\n**Push notification status:**\n- Shows 🔔 "Push notifications active" or 🔕 "Enable notifications in Settings"\n\n**How notifications fire:**\n1. When an event is within your reminder time (configured in Settings → Notifications)\n2. Default reminder time: 15 minutes before\n3. Browser sends a **real push notification** with title and location\n4. Only fires once per event (dismissed after sending)\n5. Requires notification permission: Settings → Notifications → "Enable Notifications"\n\n**Configure in Settings → Notifications:**\n- Default time: 5 min / 10 min / 15 min / 30 min / 1 hour\n- Toggle: Event Reminders, Push Notifications, Smart Reminders\n- Do Not Disturb schedule (e.g. 10 PM – 7 AM)',
          },
        },
      ],
    },

    {
      id: 'rescheduling',
      icon: '🔄',
      title: { en: 'AI Rescheduling Assistant', ur: 'AI دوبارہ شیڈولنگ اسسٹنٹ', zh: 'AI重新调度助手' },
      description: { en: 'Recover missed and conflicting events with one click.', ur: 'ایک کلک سے چھوٹے اور متضاد ایونٹس بحال کریں۔', zh: '一键恢复错过的和冲突事件。' },
      sections: [
        {
          title: { en: 'How Rescheduling Works', ur: 'دوبارہ شیڈولنگ کیسے کام کرتی ہے', zh: '重新调度如何工作' },
          tip: { en: '💡 Pro Tip: The Reschedule button actually moves the event! It deletes the old one and creates a new one at the suggested time.', ur: '💡 پرو ٹپ: ری شیڈول بٹن واقعی ایونٹ منتقل کرتا ہے!', zh: '💡 专业提示：重新安排按钮会真正移动事件！' },
          content: {
            en: 'The Rescheduling Assistant detects events that need to be moved and **actually reschedules them** with one click.\n\n**What it detects:**\n\n**1. Missed events (past-due):**\n- Events whose end time has passed but weren\'t completed\n- Shows: "Missed today — was scheduled at 2:00 PM"\n- Suggests: "Tomorrow at 9:00 AM" (finds first free slot)\n\n**2. Overlapping events:**\n- Events that conflict with each other\n- Shows: "Conflicts with Design Review"\n- Suggests: Moving to the next free slot today\n\n**How to reschedule:**\n1. Go to **AI Insights** → find the **Reschedule Assistant** card\n2. See suggestion cards with: event title, reason, suggested new time, confidence %\n3. Click the purple **"Reschedule"** button\n4. The old event is **deleted** and a **new event** is created at the suggested time\n5. Green confirmation: "1 event rescheduled ✓"\n\n**What happens behind the scenes:**\n- Old event removed from EventStore + localStorage\n- New event created with same title, duration, category, location\n- End time recalculated from new start time + original duration\n- New event appears instantly in your Schedule\n\n**When no rescheduling is needed:**\n- Shows ✨ "All events on track — No rescheduling needed right now"',
          },
        },
      ],
    },

    {
      id: 'settings-guide',
      icon: '⚙️',
      title: { en: 'Settings & Customisation', ur: 'ترتیبات اور حسب ضرورت', zh: '设置与自定义' },
      description: { en: 'Personalise Aurora to work exactly how you want.', ur: 'Aurora کو اپنی مرضی کے مطابق بنائیں۔', zh: '将Aurora配置为您想要的方式。' },
      sections: [
        {
          title: { en: 'All 10 Settings Sections', ur: 'تمام 10 ترتیبات', zh: '全部10个设置部分' },
          tip: { en: '💡 Pro Tip: Visit Settings → Data & Sync → Clear Cache to wipe everything and start fresh. This removes ALL events, history, and preferences.', ur: '💡 پرو ٹپ: ترتیبات → ڈیٹا → کیش صاف کریں سے سب حذف ہو جاتا ہے۔', zh: '💡 专业提示：设置→数据→清除缓存可清除所有数据。' },
          content: {
            en: '**Profile** — Upload avatar (6 presets or custom photo), update name, email, phone, bio. All saved in localStorage permanently.\n\n**Appearance** — Light / Dark theme, 10 accent colours with custom hex picker, font size (Compact/Comfortable/Spacious), calendar density, animations toggle\n\n**Notifications** — Browser push notification permission, per-channel toggles (event reminders, email, push, smart AI), default reminder time pills, Do Not Disturb with start/end time\n\n**AI Preferences** — Toggle each AI feature: Smart Scheduler, Focus Detection, Task Breakdown, Productivity Scoring, AI Learning. Burnout alert sensitivity (Low/Medium/High)\n\n**Calendar** — Default view (Month/Week/Day/Agenda), week start day, default event duration, time format (12h/24h), working hours, week numbers\n\n**Regional** — Language (7 options: EN, UR, AR, ZH, FR, ES, DE), date format (DD/MM/YYYY etc.), timezone with auto-detect\n\n**Integrations** — Connect Google Calendar, Outlook/M365, Zoom, Slack, Notion. API key management with show/hide and copy\n\n**Security & Privacy** — Change password with validation, 2FA with QR code, active sessions management, revoke devices, export data, delete account with confirmation\n\n**Data & Sync** — Live sync status with spinner, storage usage display, offline mode toggle, auto sync toggle, manual sync button, **Clear Cache** button (wipes ALL aurora_* localStorage keys including events, history, and settings)\n\n**Advanced** — Beta features toggle, command palette, developer mode, full keyboard shortcuts reference, webhook URL configuration',
          },
        },
      ],
    },
    {
      id: 'onboarding',
      icon: '🔐',
      title: { en: 'Onboarding & Login', ur: 'آن بورڈنگ اور لاگ ان', zh: '注册与登录' },
      description: { en: 'First-time setup with a beautiful 3-step flow.', ur: 'خوبصورت 3 مراحل سیٹ اپ پہلی بار۔', zh: '首次使用的3步精美设置流程。' },
      sections: [
        {
          title: { en: 'The 3-Step Setup Flow', ur: '3 مراحل سیٹ اپ', zh: '3步设置流程' },
          tip: { en: '💡 Pro Tip: All your onboarding data is stored locally — no server involved. Your data never leaves your device!', ur: '💡 پرو ٹپ: تمام ڈیٹا مقامی طور پر محفوظ ہے — کوئی سرور نہیں۔', zh: '💡 专业提示：所有数据存储在本地 — 不涉及服务器。' },
          content: {
            en: 'When you open Aurora for the **very first time**, a premium onboarding page appears instead of the dashboard.\n\n**Step 1 — Tell Us About You:**\n- **Full Name** (required) — Your display name throughout the app\n- **Age** (required) — Validated between 10–120\n- **Country** (required) — Dropdown with 30 countries\n- **Language** — 13 language options including English, Urdu, Chinese, Arabic, French, Spanish, German, Japanese, Korean, and more\n- Click **"Continue"** to proceed (validation errors appear in red)\n\n**Step 2 — Account Details:**\n- **Email** (required) — Must be a valid email format\n- **Password** (required) — Minimum 6 characters with a live **strength meter** (4 color-coded bars: red → amber → green)\n- **Phone Number** (optional) — For your profile\n- Click **"Continue"** to proceed\n\n**Step 3 — Choose Your Avatar:**\n- **16 unique avatar presets**: Aurora, Stellar, Nova, Cosmos, Pixel, Ember, Zephyr, Ivy, Orion, Luna, Atlas, Sage, Felix, Milo, Cleo, Raven\n- Large preview shows your selected avatar\n- Selected avatar gets a purple border with ✓ badge\n- Click **"Get Started"** to complete!\n\n**After onboarding:**\n- All info saved permanently in localStorage\n- Profile visible in **Settings → Profile** with your name, email, phone, avatar\n- Dashboard loads with your personalized data\n- The onboarding page **never shows again** unless you clear your data\n\n**How to reset (see onboarding again):**\n- Go to **Settings → Data & Sync → Clear Cache** — wipes everything including the onboarding flag\n- Or **Settings → Security → Delete Account** — same effect\n- Next time you open the app, the onboarding flow reappears',
            ur: 'جب آپ Aurora **پہلی بار** کھولتے ہیں تو آن بورڈنگ پیج ظاہر ہوتا ہے۔\n\n**مرحلہ 1 — بنیادی معلومات:**\n- نام، عمر، ملک، زبان\n\n**مرحلہ 2 — اکاؤنٹ:**\n- ای میل، پاس ورڈ، فون\n\n**مرحلہ 3 — اوتار:**\n- 16 منفرد اوتار میں سے انتخاب\n- "شروع کریں" — مکمل!',
            zh: '首次打开Aurora时，出现入职页面。\n\n**第1步 — 基本信息：**\n- 姓名、年龄、国家、语言\n\n**第2步 — 账户：**\n- 邮箱、密码、电话\n\n**第3步 — 头像：**\n- 16个独特头像可选\n- 点击"开始" — 完成！',
          },
        },
      ],
    },
    {
      id: 'faqs',
      icon: '❓',
      title: { en: 'Frequently Asked Questions', ur: 'اکثر پوچھے گئے سوالات', zh: '常见问题解答' },
      description: { en: 'Common questions and quick answers.', ur: 'عام سوالات اور فوری جوابات۔', zh: '常见问题与快速解答。' },
      sections: [
        {
          title: { en: 'General FAQs', ur: 'عام سوالات', zh: '常规问题' },
          content: {
            en: '**Q: Where is my data stored?**\nA: All your events, history, and profile data are stored locally on your device using `localStorage`. No data is sent to any external server, ensuring 100% privacy.\n\n**Q: How do the AI features work offline?**\nA: Aurora uses advanced local parsing and algorithms to detect conflicts, break down tasks, and suggest times without needing an internet connection or external API.\n\n**Q: Will I lose my data if I clear my browser cookies?**\nA: If you clear your site data or local storage for this domain, your data will be lost. You can use the Export feature in Settings to backup your data beforehand.\n\n**Q: Can I use Aurora on multiple devices?**\nA: Currently, Aurora is a local-first application. Data does not sync across different devices automatically unless you export from one and import to another (coming soon).\n\n**Q: The AI natural language input isn\'t recognizing my event. What should I do?**\nA: Try sticking to standard formats like *"Meeting with Team tomorrow at 3pm for 1 hour"*. The parser looks for relative days, times (am/pm), and durations.',
            ur: '**سوال: میرا ڈیٹا کہاں محفوظ ہے؟**\nجواب: آپ کا تمام ڈیٹا آپ کے ڈیوائس پر مقامی طور پر محفوظ ہے۔',
            zh: '**问：我的数据存储在哪里？**\n答：所有数据均本地存储在您的设备上，100%保证隐私。',
          }
        }
      ]
    },
    {
      id: 'privacy-policy',
      icon: '🛡️',
      title: { en: 'Privacy Policy', ur: 'رازداری کی پالیسی', zh: '隐私政策' },
      description: { en: 'How we protect your data and privacy.', ur: 'ہم آپ کا ڈیٹا کیسے محفوظ رکھتے ہیں۔', zh: '我们如何保护您的数据与隐私。' },
      sections: [
        {
          title: { en: 'Our Commitment to Privacy', ur: 'رازداری کا عہد', zh: '我们的隐私承诺' },
          content: {
            en: '**Local-First Storage:**\nAurora is a local-first application. This means all of your data — including events, personal profile, settings, and history — resides entirely on your device (in your browser\'s local storage). We do not have servers that collect, read, or distribute your calendar data.\n\n**No Third-Party Tracking:**\nWe do not use invasive third-party trackers, analytics, or ads. Your usage habits and schedule remain completely private.\n\n**Push Notifications:**\nBrowser push notifications are handled entirely by your local operating system and browser. The event data used in notifications never leaves your device.\n\n**Export & Deletion:**\nYou have full ownership of your data. You can export your data at any time via Settings, or permanently delete everything using the "Clear Cache" or "Delete Account" options.\n\n*Effective Date: March 2026*',
            ur: 'ارورا ایک مقامی ایپ ہے۔ آپ کا تمام ڈیٹا آپ کے آلے پر رہتا ہے۔ ہم کوئی ڈیٹا ٹریک نہیں کرتے۔',
            zh: 'Aurora是本地优先应用。所有数据都留在您的设备上。我们不跟踪、不收集您的日程安排。',
          }
        }
      ]
    },
  ],
};

export default guideContent;
