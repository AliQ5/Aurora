import { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIAssistantWidget() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    setMessage('');

    // Simulate AI processing the natural language to create an event
    setTimeout(() => {
      setIsProcessing(false);
      setMessage("✨ 'Lunch with Sarah tomorrow at 1 PM' added to Calendar.");
      setInput('');
      
      setTimeout(() => setMessage(''), 4000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-brand-500" size={20} />
          <h2 className="text-xl font-bold tracking-tight text-slate-800">AI Scheduler</h2>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Type naturally to create events. I'll handle the dates, times, and participants.
        </p>
      </div>

      <div className="mt-6 relative">
         <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Book a flight to NYC next Friday"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-2xl py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium placeholder:text-slate-400 shadow-inner-soft"
            />
            <button 
              type="submit" 
              disabled={isProcessing || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-colors"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
         </form>

         {message && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0 }}
             className="absolute top-full mt-3 left-0 right-0 bg-green-50 text-green-700 text-sm font-medium p-3 rounded-xl border border-green-100 flex items-center gap-2"
           >
             <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
             {message}
           </motion.div>
         )}
      </div>
    </div>
  );
}
