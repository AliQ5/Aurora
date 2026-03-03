import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Globe, Calendar, ChevronRight, ChevronLeft, Check, Sparkles, Eye, EyeOff } from 'lucide-react';

const AVATARS = [
  { seed: 'Aurora',   label: 'Aurora' },
  { seed: 'Stellar',  label: 'Stellar' },
  { seed: 'Nova',     label: 'Nova' },
  { seed: 'Cosmos',   label: 'Cosmos' },
  { seed: 'Pixel',    label: 'Pixel' },
  { seed: 'Ember',    label: 'Ember' },
  { seed: 'Zephyr',   label: 'Zephyr' },
  { seed: 'Ivy',      label: 'Ivy' },
  { seed: 'Orion',    label: 'Orion' },
  { seed: 'Luna',     label: 'Luna' },
  { seed: 'Atlas',    label: 'Atlas' },
  { seed: 'Sage',     label: 'Sage' },
  { seed: 'Felix',    label: 'Felix' },
  { seed: 'Milo',     label: 'Milo' },
  { seed: 'Cleo',     label: 'Cleo' },
  { seed: 'Raven',    label: 'Raven' },
];

const COUNTRIES = [
  'Pakistan', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'India', 'China', 'Japan', 'Germany', 'France', 'Brazil', 'Mexico',
  'South Korea', 'Turkey', 'Saudi Arabia', 'UAE', 'Egypt', 'Nigeria',
  'South Africa', 'Indonesia', 'Malaysia', 'Russia', 'Italy', 'Spain',
  'Netherlands', 'Sweden', 'Switzerland', 'Singapore', 'Philippines', 'Other',
];

const LANGUAGES = [
  'English', 'اردو (Urdu)', '中文 (Chinese)', 'العربية (Arabic)',
  'Français (French)', 'Español (Spanish)', 'Deutsch (German)',
  '日本語 (Japanese)', '한국어 (Korean)', 'Português (Portuguese)',
  'Italiano (Italian)', 'Türkçe (Turkish)', 'हिन्दी (Hindi)',
];

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/8.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export default function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    age: '',
    country: '',
    language: 'English',
    email: '',
    password: '',
    phone: '',
    avatarPreset: 0,
  });

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.age || form.age < 10 || form.age > 120) e.age = 'Enter a valid age (10–120)';
      if (!form.country) e.country = 'Select your country';
    }
    if (step === 1) {
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
      if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    if (!validateStep()) return;
    const seed = AVATARS[form.avatarPreset]?.seed || 'Aurora';
    const profileData = {
      name: form.name.trim(),
      age: parseInt(form.age),
      country: form.country,
      language: form.language,
      email: form.email.trim(),
      phone: form.phone.trim(),
      bio: '',
      avatarSeed: seed,
      avatarStyle: 'preset',
      avatarPreset: form.avatarPreset,
      avatarUrl: null,
    };
    // Save password hash (simple for local-only)
    localStorage.setItem('aurora_settings_password', form.password);
    localStorage.setItem('aurora_onboarded', 'true');
    onComplete(profileData);
  };

  const steps = [
    { title: 'Tell us about you', subtitle: 'Your basic information', icon: '👋' },
    { title: 'Account details', subtitle: 'Email & security', icon: '🔐' },
    { title: 'Choose your avatar', subtitle: 'Pick a look that\'s you', icon: '🎨' },
  ];

  const inputClass = (field) => `w-full px-4 py-3 bg-white/5 border ${errors[field] ? 'border-red-400 ring-2 ring-red-400/20' : 'border-white/10 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'} rounded-xl text-white placeholder-white/30 outline-none transition-all`;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0f0c29] via-[#1a1040] to-[#24243e] flex items-center justify-center p-4 overflow-y-auto">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + Math.random()*4, repeat: Infinity, delay: Math.random()*3 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Aurora</h1>
          </div>
          <p className="text-sm text-violet-300/60 font-medium">AI-Powered Calendar</p>
        </motion.div>

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Step indicator */}
          <div className="px-6 pt-6">
            <div className="flex items-center gap-2 mb-4">
              {steps.map((s, i) => (
                <div key={i} className="flex-1 flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: i === step ? 1.1 : 1,
                      backgroundColor: i < step ? '#8b5cf6' : i === step ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.05)',
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 shrink-0"
                  >
                    {i < step ? (
                      <Check size={14} className="text-white" />
                    ) : (
                      <span className={`text-xs font-bold ${i === step ? 'text-violet-300' : 'text-white/20'}`}>{i + 1}</span>
                    )}
                  </motion.div>
                  {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-violet-500' : 'bg-white/5'}`} />}
                </div>
              ))}
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">{steps[step].icon}</span> {steps[step].title}
            </h2>
            <p className="text-sm text-violet-300/50 mt-0.5 mb-4">{steps[step].subtitle}</p>
          </div>

          {/* Form content */}
          <div className="px-6 pb-6">
            <AnimatePresence mode="wait">
              {/* Step 0: Basic Info */}
              {step === 0 && (
                <motion.div key="s0" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-violet-300/70 uppercase tracking-wider mb-1.5 block">Full Name *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400/50" />
                      <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="e.g. Ali Ahmad" className={`${inputClass('name')} pl-10`} />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1 font-medium">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-violet-300/70 uppercase tracking-wider mb-1.5 block">Age *</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400/50" />
                        <input type="number" value={form.age} onChange={e => set('age', e.target.value)}
                          placeholder="25" min="10" max="120" className={`${inputClass('age')} pl-10`} />
                      </div>
                      {errors.age && <p className="text-xs text-red-400 mt-1 font-medium">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-violet-300/70 uppercase tracking-wider mb-1.5 block">Language</label>
                      <select value={form.language} onChange={e => set('language', e.target.value)}
                        className={`${inputClass('language')} appearance-none cursor-pointer`}>
                        {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#1a1040] text-white">{l}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-violet-300/70 uppercase tracking-wider mb-1.5 block">Country *</label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400/50" />
                      <select value={form.country} onChange={e => set('country', e.target.value)}
                        className={`${inputClass('country')} pl-10 appearance-none cursor-pointer`}>
                        <option value="" className="bg-[#1a1040] text-white/40">Select your country</option>
                        {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#1a1040] text-white">{c}</option>)}
                      </select>
                    </div>
                    {errors.country && <p className="text-xs text-red-400 mt-1 font-medium">{errors.country}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Account */}
              {step === 1 && (
                <motion.div key="s1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-violet-300/70 uppercase tracking-wider mb-1.5 block">Email Address *</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400/50" />
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="you@example.com" className={`${inputClass('email')} pl-10`} />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 mt-1 font-medium">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-violet-300/70 uppercase tracking-wider mb-1.5 block">Password *</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400/50" />
                      <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                        placeholder="Min 6 characters" className={`${inputClass('password')} pl-10 pr-10`} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-violet-400/50 hover:text-violet-300 transition-colors">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-400 mt-1 font-medium">{errors.password}</p>}
                    {form.password.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`flex-1 h-1 rounded-full ${form.password.length >= i * 3 ? (i >= 3 ? 'bg-green-400' : i >= 2 ? 'bg-amber-400' : 'bg-red-400') : 'bg-white/10'}`} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-violet-300/70 uppercase tracking-wider mb-1.5 block">Phone Number <span className="text-white/20">(optional)</span></label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400/50" />
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                        placeholder="+92 300 1234567" className={`${inputClass('phone')} pl-10`} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Avatar */}
              {step === 2 && (
                <motion.div key="s2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ duration: 0.25 }}>
                  {/* Selected Avatar Preview */}
                  <div className="flex flex-col items-center mb-5">
                    <motion.div
                      key={form.avatarPreset}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-24 h-24 rounded-full overflow-hidden border-4 border-violet-500/40 shadow-xl shadow-violet-500/20 mb-2"
                    >
                      <img src={getAvatarUrl(AVATARS[form.avatarPreset].seed)} alt="Avatar" className="w-full h-full object-cover" />
                    </motion.div>
                    <p className="text-sm font-bold text-white">{AVATARS[form.avatarPreset].label}</p>
                    <p className="text-xs text-violet-300/40">Tap to select</p>
                  </div>

                  {/* Avatar Grid */}
                  <div className="grid grid-cols-4 gap-3 max-h-52 overflow-y-auto no-scrollbar pr-1">
                    {AVATARS.map((av, i) => (
                      <motion.button
                        key={av.seed}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => set('avatarPreset', i)}
                        className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                          form.avatarPreset === i
                            ? 'bg-violet-500/20 border-2 border-violet-400 shadow-lg shadow-violet-500/10'
                            : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                        }`}
                      >
                        <img src={getAvatarUrl(av.seed)} alt={av.label} className="w-12 h-12 rounded-full" />
                        <span className="text-[10px] font-semibold text-white/60">{av.label}</span>
                        {form.avatarPreset === i && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center border-2 border-[#1a1040]"
                          >
                            <Check size={10} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.06]">
              {step > 0 ? (
                <button onClick={prevStep}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-violet-300/70 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                  <ChevronLeft size={16} /> Back
                </button>
              ) : <div />}

              {step < 2 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
                >
                  Continue <ChevronRight size={16} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFinish}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-shadow"
                >
                  <Sparkles size={16} /> Get Started
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-violet-300/20 mt-4 font-medium">
          All your data is stored locally on this device. No server involved.
        </p>
      </motion.div>
    </div>
  );
}
