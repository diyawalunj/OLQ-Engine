import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Clock, Play, Square, PenTool, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { useAuthStore } from '../stores/authStore';

const PPDT_IMAGES = [
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
];

type PPDTPhase = 'ready' | 'viewing' | 'writing' | 'narrating' | 'complete';

export default function PPDTTab() {
  const { user, setShowAuthModal } = useAuthStore();
  const [phase, setPhase] = useState<PPDTPhase>('ready');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentImage, setCurrentImage] = useState('');
  const [story, setStory] = useState('');
  const [characters, setCharacters] = useState('');
  const [actionSequence, setActionSequence] = useState('');
  const [mood, setMood] = useState<'positive' | 'negative' | 'neutral'>('positive');

  const PHASE_DURATIONS: Record<string, number> = {
    viewing: 30,       // 30 seconds to view the image
    writing: 240,      // 4 minutes to write
    narrating: 60,     // 1 minute narration timer
  };

  useEffect(() => {
    if (phase === 'ready' || phase === 'complete') return;
    if (timeLeft <= 0) {
      if (phase === 'viewing') { setPhase('writing'); setTimeLeft(PHASE_DURATIONS.writing); }
      else if (phase === 'writing') { setPhase('narrating'); setTimeLeft(PHASE_DURATIONS.narrating); }
      else if (phase === 'narrating') { setPhase('complete'); }
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const startTest = () => {
    if (!user) { setShowAuthModal(true); return; }
    const img = PPDT_IMAGES[Math.floor(Math.random() * PPDT_IMAGES.length)];
    setCurrentImage(img);
    setStory('');
    setCharacters('');
    setActionSequence('');
    setMood('positive');
    setPhase('viewing');
    setTimeLeft(PHASE_DURATIONS.viewing);
  };

  const resetTest = () => {
    setPhase('ready');
    setTimeLeft(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Timer Bar */}
      {phase !== 'ready' && phase !== 'complete' && (
        <div className="flex items-center justify-between bg-olq-card border border-olq-border rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full",
              phase === 'viewing' ? "bg-blue-500 animate-pulse" :
              phase === 'writing' ? "bg-olq-gold animate-pulse" :
              "bg-green-500 animate-pulse"
            )} />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-display">
              {phase === 'viewing' ? 'Observe the Image' : phase === 'writing' ? 'Write Your Story' : 'Narration Timer'}
            </span>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-lg font-bold",
            timeLeft <= 10 ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" : "bg-olq-bg border-olq-border text-white"
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* READY STATE */}
        {phase === 'ready' && (
          <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-olq-card border border-olq-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <ImageIcon className="text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">PPDT Simulator</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Picture Perception & Discussion Test</p>
                </div>
              </div>

              <div className="relative z-10 space-y-4 mb-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-4 text-center">
                    <Eye className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">View Image</p>
                    <p className="text-sm font-mono text-white">30 sec</p>
                  </div>
                  <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-4 text-center">
                    <PenTool className="w-5 h-5 text-olq-gold mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Write Story</p>
                    <p className="text-sm font-mono text-white">4 min</p>
                  </div>
                  <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-4 text-center">
                    <Clock className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Narrate</p>
                    <p className="text-sm font-mono text-white">60 sec</p>
                  </div>
                </div>
              </div>

              <button onClick={startTest} className="w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-sm bg-olq-olive text-white border border-olq-gold/20 hover:border-olq-gold/50 transition-all shadow-[0_0_20px_rgba(61,68,30,0.3)] flex items-center justify-center gap-3 font-display">
                <Play className="w-4 h-4 fill-current" /> Start PPDT
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEWING STATE */}
        {phase === 'viewing' && (
          <motion.div key="viewing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-olq-card border border-blue-500/30 rounded-xl p-8 shadow-2xl flex items-center justify-center min-h-[400px]">
              <img src={currentImage} alt="PPDT Stimulus" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl border border-olq-border" />
            </div>
            <p className="text-center text-xs text-gray-500 mt-4 uppercase tracking-widest font-display">Memorize the scene. Identify characters, mood, and potential story.</p>
          </motion.div>
        )}

        {/* WRITING STATE */}
        {phase === 'writing' && (
          <motion.div key="writing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-olq-card border border-olq-gold/30 rounded-xl p-6 shadow-2xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block">Number of Characters</label>
                  <input type="text" value={characters} onChange={(e) => setCharacters(e.target.value)} placeholder="e.g., 3 — a soldier, a doctor, a villager" className="w-full bg-olq-bg border border-olq-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block">Mood</label>
                  <div className="flex gap-2">
                    {(['positive', 'negative', 'neutral'] as const).map(m => (
                      <button key={m} onClick={() => setMood(m)} className={cn("flex-1 py-2 rounded text-[10px] font-bold uppercase tracking-widest border transition-all", mood === m ? "bg-olq-gold/10 border-olq-gold/30 text-olq-gold" : "bg-olq-bg border-olq-border text-gray-500")}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block">Action Sequence</label>
                  <input type="text" value={actionSequence} onChange={(e) => setActionSequence(e.target.value)} placeholder="What happened → action → outcome" className="w-full bg-olq-bg border border-olq-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2 block">Your Story</label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Write your story based on the image you saw. Include: Who is the main character? What is happening? What action does the hero take? What is the outcome?"
                  className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors resize-none min-h-[250px] leading-relaxed placeholder:text-gray-700"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-gray-600 font-mono">{story.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* NARRATION STATE */}
        {phase === 'narrating' && (
          <motion.div key="narrating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-olq-card border border-green-500/30 rounded-xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 animate-pulse">
                <Clock className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider font-display">Narrate Your Story</h3>
              <p className="text-sm text-gray-400 max-w-md">Practice narrating your story aloud. Stay concise, confident, and cover: characters, action, and outcome.</p>
              <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-4 max-w-lg max-h-[200px] overflow-y-auto text-left">
                <p className="text-xs text-gray-300 font-mono whitespace-pre-wrap">{story || 'No story written.'}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* COMPLETE */}
        {phase === 'complete' && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-olq-card border border-olq-gold/30 rounded-xl p-8 shadow-2xl text-center space-y-6">
              <h2 className="text-2xl font-bold text-olq-gold uppercase tracking-wider font-display">PPDT Complete</h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Review your story below. In a real SSB, you would now narrate this to a group and participate in a group discussion.
              </p>
              <div className="bg-olq-bg border border-olq-border rounded-lg p-6 text-left max-w-2xl mx-auto space-y-3">
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-500 uppercase tracking-widest">Characters:</span>
                  <span className="text-white">{characters || 'Not specified'}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-500 uppercase tracking-widest">Mood:</span>
                  <span className="text-white capitalize">{mood}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-gray-500 uppercase tracking-widest">Action:</span>
                  <span className="text-white">{actionSequence || 'Not specified'}</span>
                </div>
                <hr className="border-olq-border" />
                <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{story || 'No story written.'}</p>
              </div>
            </div>

            <button onClick={resetTest} className="w-full py-3 rounded-lg border border-olq-border text-gray-400 font-bold uppercase tracking-widest text-xs hover:bg-olq-card hover:text-white transition-all flex items-center justify-center gap-2 font-display">
              <RefreshCw className="w-4 h-4" /> Practice Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
