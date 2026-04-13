import React, { useState, useEffect } from 'react';
import { User, Clock, Play, Square, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { useAuthStore } from '../stores/authStore';

const SDT_PROMPTS = [
  { id: 'parents', label: 'What your parents think about you', hint: 'Describe how your parents perceive your personality, strengths, and habits.' },
  { id: 'teachers', label: 'What your teachers/professors think about you', hint: 'How do your teachers view your academic approach, discipline, and leadership?' },
  { id: 'friends', label: 'What your friends think about you', hint: 'How do your friends perceive you in social settings, group activities, and personal interactions?' },
  { id: 'self', label: 'What you think about yourself', hint: 'Be honest about your strengths, weaknesses, ambitions, and core values.' },
  { id: 'ideal', label: 'What kind of person you want to be', hint: 'Describe your ideal self — the qualities you aspire to develop and goals you want to achieve.' },
];

type SDTState = 'ready' | 'active' | 'complete';

export default function SDTTab() {
  const { user, setShowAuthModal } = useAuthStore();
  const [state, setState] = useState<SDTState>('ready');
  const [responses, setResponses] = useState<Record<string, string>>(
    Object.fromEntries(SDT_PROMPTS.map(p => [p.id, '']))
  );
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes total

  useEffect(() => {
    if (state !== 'active') return;
    if (timeLeft <= 0) {
      setState('complete');
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [state, timeLeft]);

  const startTest = () => {
    if (!user) { setShowAuthModal(true); return; }
    setResponses(Object.fromEntries(SDT_PROMPTS.map(p => [p.id, ''])));
    setCurrentPrompt(0);
    setTimeLeft(900);
    setState('active');
  };

  const resetTest = () => {
    setState('ready');
    setTimeLeft(900);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const filledCount = Object.values(responses).filter((r: string) => r.trim().length > 10).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AnimatePresence mode="wait">
        {state === 'ready' && (
          <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-olq-card border border-olq-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <User className="text-purple-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">SDT Simulator</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Self Description Test • 15 Minutes</p>
                </div>
              </div>

              <div className="relative z-10 space-y-3 mb-8">
                {SDT_PROMPTS.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3 bg-olq-bg/50 border border-olq-border rounded-lg">
                    <span className="text-xs font-mono text-gray-500 w-5">{i + 1}.</span>
                    <span className="text-xs text-gray-300">{p.label}</span>
                  </div>
                ))}
              </div>

              <button onClick={startTest} className="w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-sm bg-olq-olive text-white border border-olq-gold/20 hover:border-olq-gold/50 transition-all shadow-[0_0_20px_rgba(61,68,30,0.3)] flex items-center justify-center gap-3 font-display">
                <Play className="w-4 h-4 fill-current" /> Start SDT
              </button>
            </div>
          </motion.div>
        )}

        {state === 'active' && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Timer */}
            <div className="flex items-center justify-between bg-olq-card border border-olq-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">
                  {filledCount}/{SDT_PROMPTS.length} Completed
                </span>
              </div>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-lg font-bold",
                timeLeft <= 60 ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" : "bg-olq-bg border-olq-border text-white"
              )}>
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Prompt Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SDT_PROMPTS.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentPrompt(i)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border flex items-center gap-2",
                    currentPrompt === i
                      ? "bg-olq-gold/10 border-olq-gold/30 text-olq-gold"
                      : responses[p.id].trim().length > 10
                        ? "bg-olq-green/10 border-olq-green/30 text-olq-green"
                        : "bg-olq-card border-olq-border text-gray-500 hover:text-white"
                  )}
                >
                  {responses[p.id].trim().length > 10 && <CheckCircle2 className="w-3 h-3" />}
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Writing Area */}
            <div className="bg-olq-card border border-olq-border rounded-xl p-6 shadow-2xl space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{SDT_PROMPTS[currentPrompt].label}</h3>
                <p className="text-[10px] text-gray-500 italic">{SDT_PROMPTS[currentPrompt].hint}</p>
              </div>
              <textarea
                value={responses[SDT_PROMPTS[currentPrompt].id]}
                onChange={(e) => setResponses({ ...responses, [SDT_PROMPTS[currentPrompt].id]: e.target.value })}
                placeholder="Write your response..."
                className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors resize-none min-h-[200px] leading-relaxed placeholder:text-gray-700"
              />
              <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>{responses[SDT_PROMPTS[currentPrompt].id].split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

            <button onClick={() => setState('complete')} className="w-full py-3 rounded-lg bg-olq-olive text-white font-bold uppercase tracking-widest text-xs border border-olq-gold/20 hover:border-olq-gold/50 transition-all flex items-center justify-center gap-2 font-display">
              <Square className="w-3 h-3 fill-current" /> Submit SDT
            </button>
          </motion.div>
        )}

        {state === 'complete' && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-olq-card border border-olq-gold/30 rounded-xl p-8 shadow-2xl text-center space-y-4">
              <h2 className="text-2xl font-bold text-olq-gold uppercase tracking-wider font-display">SDT Complete</h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">Review your self-description below. An assessor checks for consistency across all five perspectives.</p>
            </div>

            {SDT_PROMPTS.map((p) => (
              <div key={p.id} className="bg-olq-card border border-olq-border rounded-xl p-5">
                <h4 className="text-xs font-bold text-olq-gold uppercase tracking-widest mb-3">{p.label}</h4>
                <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{responses[p.id] || 'Not answered'}</p>
              </div>
            ))}

            <button onClick={resetTest} className="w-full py-3 rounded-lg border border-olq-border text-gray-400 font-bold uppercase tracking-widest text-xs hover:bg-olq-card hover:text-white transition-all flex items-center justify-center gap-2 font-display">
              <RefreshCw className="w-4 h-4" /> Practice Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
