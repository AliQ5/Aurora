/**
 * Aurora UI Translations
 * Covers all main navigation labels, headers, and common UI strings.
 */

export const LOCALES = {
  English:  { code: 'en-US', dir: 'ltr', nativeName: 'English',    flag: '🇺🇸' },
  Urdu:     { code: 'ur-PK', dir: 'rtl', nativeName: 'اردو',       flag: '🇵🇰' },
  Arabic:   { code: 'ar-SA', dir: 'rtl', nativeName: 'العربية',    flag: '🇸🇦' },
  Chinese:  { code: 'zh-CN', dir: 'ltr', nativeName: '中文',        flag: '🇨🇳' },
  Japanese: { code: 'ja-JP', dir: 'ltr', nativeName: '日本語',      flag: '🇯🇵' },
  French:   { code: 'fr-FR', dir: 'ltr', nativeName: 'Français',   flag: '🇫🇷' },
  Spanish:  { code: 'es-ES', dir: 'ltr', nativeName: 'Español',    flag: '🇪🇸' },
  German:   { code: 'de-DE', dir: 'ltr', nativeName: 'Deutsch',    flag: '🇩🇪' },
  Korean:   { code: 'ko-KR', dir: 'ltr', nativeName: '한국어',      flag: '🇰🇷' },
  Swahili:  { code: 'sw-KE', dir: 'ltr', nativeName: 'Kiswahili',  flag: '🇰🇪' },
};

const T = {
  // ── Navigation ──────────────────────────────────────────
  nav_dashboard: {
    English: 'Dashboard', Urdu: 'ڈیش بورڈ', Arabic: 'لوحة القيادة',
    Chinese: '仪表盘', Japanese: 'ダッシュボード', French: 'Tableau de bord',
    Spanish: 'Panel', German: 'Übersicht', Korean: '대시보드', Swahili: 'Dashibodi',
  },
  nav_calendar: {
    English: 'Calendar', Urdu: 'کیلنڈر', Arabic: 'التقويم',
    Chinese: '日历', Japanese: 'カレンダー', French: 'Calendrier',
    Spanish: 'Calendario', German: 'Kalender', Korean: '캘린더', Swahili: 'Kalenda',
  },
  nav_ai: {
    English: 'AI Insights', Urdu: 'AI بصیرت', Arabic: 'رؤى الذكاء الاصطناعي',
    Chinese: 'AI洞察', Japanese: 'AI分析', French: 'Insights IA',
    Spanish: 'Perspectivas IA', German: 'KI-Einblicke', Korean: 'AI 인사이트', Swahili: 'Maarifa ya AI',
  },
  nav_guide: {
    English: 'User Guide', Urdu: 'صارف گائیڈ', Arabic: 'دليل المستخدم',
    Chinese: '用户指南', Japanese: 'ユーザーガイド', French: 'Guide utilisateur',
    Spanish: 'Guía de usuario', German: 'Benutzerhandbuch', Korean: '사용자 안내서', Swahili: 'Mwongozo',
  },
  nav_settings: {
    English: 'Settings', Urdu: 'ترتیبات', Arabic: 'الإعدادات',
    Chinese: '设置', Japanese: '設定', French: 'Paramètres',
    Spanish: 'Configuración', German: 'Einstellungen', Korean: '설정', Swahili: 'Mipangilio',
  },

  // ── Dashboard page ──────────────────────────────────────
  page_overview: {
    English: 'Overview', Urdu: 'جائزہ', Arabic: 'نظرة عامة',
    Chinese: '概览', Japanese: '概要', French: 'Aperçu',
    Spanish: 'Resumen', German: 'Übersicht', Korean: '개요', Swahili: 'Muhtasari',
  },
  btn_new_event: {
    English: '+ New Event', Urdu: '+ نیا ایونٹ', Arabic: '+ حدث جديد',
    Chinese: '+ 新建事件', Japanese: '+ 新しいイベント', French: '+ Nouvel événement',
    Spanish: '+ Nuevo evento', German: '+ Neues Ereignis', Korean: '+ 새 일정', Swahili: '+ Tukio Jipya',
  },
  label_schedule: {
    English: 'Schedule', Urdu: 'شیڈول', Arabic: 'الجدول الزمني',
    Chinese: '日程', Japanese: 'スケジュール', French: 'Planning',
    Spanish: 'Horario', German: 'Zeitplan', Korean: '일정', Swahili: 'Ratiba',
  },
  label_goals: {
    English: 'Goals', Urdu: 'اہداف', Arabic: 'الأهداف',
    Chinese: '目标', Japanese: '目標', French: 'Objectifs',
    Spanish: 'Objetivos', German: 'Ziele', Korean: '목표', Swahili: 'Malengo',
  },
  label_today: {
    English: 'Today', Urdu: 'آج', Arabic: 'اليوم',
    Chinese: '今天', Japanese: '今日', French: "Aujourd'hui",
    Spanish: 'Hoy', German: 'Heute', Korean: '오늘', Swahili: 'Leo',
  },
  label_events: {
    English: 'events', Urdu: 'ایونٹس', Arabic: 'أحداث',
    Chinese: '事件', Japanese: 'イベント', French: 'événements',
    Spanish: 'eventos', German: 'Ereignisse', Korean: '일정', Swahili: 'matukio',
  },

  // ── Agenda / time labels ────────────────────────────────
  label_now: {
    English: 'Now', Urdu: 'ابھی', Arabic: 'الآن',
    Chinese: '现在', Japanese: '現在', French: 'Maintenant',
    Spanish: 'Ahora', German: 'Jetzt', Korean: '지금', Swahili: 'Sasa',
  },
  label_done: {
    English: 'done', Urdu: 'مکمل', Arabic: 'منجز',
    Chinese: '完成', Japanese: '完了', French: 'fait',
    Spanish: 'completado', German: 'erledigt', Korean: '완료', Swahili: 'imekamilika',
  },
  label_no_events: {
    English: 'No events today', Urdu: 'آج کوئی ایونٹ نہیں', Arabic: 'لا أحداث اليوم',
    Chinese: '今天没有事件', Japanese: '今日はイベントなし', French: "Pas d'événements aujourd'hui",
    Spanish: 'Sin eventos hoy', German: 'Keine Ereignisse heute', Korean: '오늘 일정 없음', Swahili: 'Hakuna matukio leo',
  },

  // ── AI panel ────────────────────────────────────────────
  label_ai_insights: {
    English: 'AI Insights', Urdu: 'AI تجزیات', Arabic: 'رؤى الذكاء الاصطناعي',
    Chinese: 'AI洞察', Japanese: 'AI分析', French: 'Analyses IA',
    Spanish: 'Análisis IA', German: 'KI-Analysen', Korean: 'AI 분석', Swahili: 'Uchanganuzi wa AI',
  },
  label_productivity: {
    English: 'Productivity Score', Urdu: 'پیداواریت اسکور', Arabic: 'نقاط الإنتاجية',
    Chinese: '生产力评分', Japanese: '生産性スコア', French: 'Score de productivité',
    Spanish: 'Puntuación de productividad', German: 'Produktivitätswert', Korean: '생산성 점수', Swahili: 'Alama ya Tija',
  },

  // ── Common actions ──────────────────────────────────────
  btn_save: {
    English: 'Save Changes', Urdu: 'تبدیلیاں محفوظ کریں', Arabic: 'حفظ التغييرات',
    Chinese: '保存更改', Japanese: '変更を保存', French: 'Enregistrer',
    Spanish: 'Guardar', German: 'Speichern', Korean: '저장', Swahili: 'Hifadhi',
  },
  btn_cancel: {
    English: 'Cancel', Urdu: 'منسوخ', Arabic: 'إلغاء',
    Chinese: '取消', Japanese: 'キャンセル', French: 'Annuler',
    Spanish: 'Cancelar', German: 'Abbrechen', Korean: '취소', Swahili: 'Ghairi',
  },
  btn_confirm: {
    English: 'Confirm', Urdu: 'تصدیق', Arabic: 'تأكيد',
    Chinese: '确认', Japanese: '確認', French: 'Confirmer',
    Spanish: 'Confirmar', German: 'Bestätigen', Korean: '확인', Swahili: 'Thibitisha',
  },
  label_theme: {
    English: 'Theme', Urdu: 'تھیم', Arabic: 'المظهر',
    Chinese: '主题', Japanese: 'テーマ', French: 'Thème',
    Spanish: 'Tema', German: 'Design', Korean: '테마', Swahili: 'Mandhari',
  },
  label_notifications: {
    English: 'Notifications', Urdu: 'اطلاعات', Arabic: 'الإشعارات',
    Chinese: '通知', Japanese: '通知', French: 'Notifications',
    Spanish: 'Notificaciones', German: 'Benachrichtigungen', Korean: '알림', Swahili: 'Arifa',
  },
  label_premium: {
    English: 'Premium Plan', Urdu: 'پریمیم پلان', Arabic: 'الخطة المميزة',
    Chinese: '高级计划', Japanese: 'プレミアムプラン', French: 'Plan Premium',
    Spanish: 'Plan Premium', German: 'Premium-Plan', Korean: '프리미엄 플랜', Swahili: 'Mpango wa Juu',
  },
};

export default T;
