import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, Mic, Check, Edit2, X } from 'lucide-react';
import { parseNaturalLanguageEvent } from '../../services/aiService';

export default function NaturalLanguageInput({ onEventCreated }) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedEvent, setParsedEvent] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | parsing | preview | success | error
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsTyping(input.length > 0);
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setStatus('parsing');
    setParsedEvent(null);

    try {
      const event = await parseNaturalLanguageEvent(input);
      setParsedEvent(event);
      setConfidence(event.confidence || 75);
      setStatus('preview');
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    setStatus('success');
    onEventCreated?.(parsedEvent);
    setTimeout(() => {
      setInput('');
      setParsedEvent(null);
      setStatus('idle');
      setConfidence(0);
    }, 2000);
  };

  const handleCancel = () => {
    setParsedEvent(null);
    setStatus('idle');
    setConfidence(0);
  };

  const confidenceColor = confidence >= 80 ? 'from-emerald-500 to-green-400' :
                           confidence >= 60 ? 'from-indigo-500 to-violet-500' :
                           'from-amber-400 to-orange-400';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Sparkles className="text-white" size={16} />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800">AI Scheduler</h2>
          <p className="text-[11px] text-slate-400 font-medium -mt-0.5">Type naturally to create events</p>
        </div>
      </div>

      {/* Input */}
      <div className="mt-4 relative">
        <form onSubmit={handleSubmit} className="relative">
          <div className={`relative rounded-2xl transition-all duration-300 ${isTyping ? 'ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/5' : ''}`}>
            <Sparkles size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 z-10" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Meeting tomorrow 8pm for 1 hour..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-2xl py-4 pl-11 pr-24 focus:outline-none focus:border-indigo-400 transition-all font-medium placeholder:text-slate-400"
              disabled={status === 'parsing'}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button type="button" className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600">
                <Mic size={16} />
              </button>
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-indigo-500/20 disabled:shadow-none"
              >
                {isProcessing ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </div>
        </form>

        {/* AI Processing Indicator */}
        <AnimatePresence>
          {status === 'parsing' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 flex items-center gap-2 text-sm text-indigo-600 font-medium"
            >
              <div className="flex gap-1">
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              </div>
              <span>AI is parsing your request...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Parsed Event Preview */}
        <AnimatePresence>
          {status === 'preview' && parsedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Parsed Event</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-500">AI Confidence</span>
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${confidence}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${confidenceColor}`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600">{confidence}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    ['Title', parsedEvent.title],
                    ['Date', parsedEvent.date],
                    ['Time', parsedEvent.startTime],
                    ['Duration', parsedEvent.duration],
                    ['Category', parsedEvent.category],
                  ].map(([label, value]) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`bg-slate-50 rounded-xl p-2.5 ${label === 'Title' ? 'col-span-2' : ''}`}
                    >
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">{label}</span>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex border-t border-slate-100">
                <button
                  onClick={handleConfirm}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all"
                >
                  <Check size={16} /> Confirm
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors border-l border-slate-100"
                >
                  <Edit2 size={14} /> Edit Manually
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Confirmation */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 bg-emerald-50 text-emerald-700 text-sm font-medium p-3 rounded-xl border border-emerald-100 flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.4 }}
              >
                <Check size={16} className="text-emerald-500" />
              </motion.div>
              <span>✨ "{parsedEvent?.title}" added to Calendar!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-100 flex items-center gap-2"
            >
              <X size={16} /> Could not parse. Try rephrasing.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
