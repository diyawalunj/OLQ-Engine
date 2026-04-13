import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Play, Square, Brain, Download } from 'lucide-react';
import { cn } from '../utils';

type Protocol = 'WAT' | 'TAT' | 'SRT';

const sampleWords = [
  "Accept", "Danger", "Delay", "Defeat", "Failure", "Blood", "Death", "Impossible", 
  "Weapon", "Enemy", "Courage", "Family", "Duty", "Sacrifice", "Attack", "Leader", 
  "System", "Officer", "Problem", "Command", "Strategy", "Victory"
];

// Placeholder TAT images (waiting for Admin configuration)
const sampleImages = [
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
];

const sampleSituations = [
  "He was given a task which he found impossible to complete within the time frame.",
  "His subordinates refused to follow his orders during a critical operation.",
  "He saw a venomous snake entering his colleague's sleeping bag.",
  "You are traveling in a train and notice a suspicious unattended bag under a seat.",
  "While patrolling, his patrol gets ambushed and communication with HQ is lost.",
  "He accidentally spills coffee on his commander's important documents right before a meeting.",
  "He is preparing for finals but suddenly his roommate falls severely ill at midnight."
];

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function ManualPracticeTab() {
  const [protocol, setProtocol] = useState<Protocol>('WAT');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeList, setActiveList] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // Time limits per item
  const timeLimits = {
    WAT: 15,
    TAT: 30 * 4 + 60 * 3, // 30s look, 3.5 min write (not standard but mock)
    SRT: 30
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Auto-progress
      handleNext();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleNext = () => {
    if (currentIndex < activeList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(timeLimits[protocol]);
    } else {
      setIsActive(false);
    }
  };

  const getBaseList = (p: Protocol) => {
    switch (p) {
      case 'WAT': return sampleWords;
      case 'TAT': return sampleImages;
      case 'SRT': return sampleSituations;
    }
  };

  const handleStart = () => {
    // Randomize the active list on START
    const baseList = getBaseList(protocol);
    setActiveList(shuffleArray(baseList));
    setCurrentIndex(0);
    setTimeLeft(timeLimits[protocol]);
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const downloadImage = async (url: string) => {
    try {
      setIsDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `TAT_Stimulus_${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to download image:", err);
      // Fallback method
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const currentItem = activeList.length > 0 ? activeList[currentIndex] : '';

  return (
    <div className="bg-olq-bg border border-olq-border rounded-xl flex flex-col min-h-[70vh] animate-in fade-in duration-500 overflow-hidden shadow-2xl">
      {/* Top Bar */}
      <div className="bg-olq-card p-6 border-b border-olq-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-olq-gold/10 rounded-lg flex items-center justify-center border border-olq-gold/20">
            <Brain className="text-olq-gold w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest font-display">Manual Practice</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] font-display">SSB Self-Assessment</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-lg border border-white/5">
          <Clock className={cn("w-5 h-5", timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-olq-gold")} />
          <span className="text-2xl font-mono text-white tracking-widest min-w-[3ch] text-center">
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Controls Panel */}
        <div className="w-full md:w-64 bg-olq-bg/50 border-r border-olq-border p-6 flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block font-display mb-3">Protocol</label>
            <div className="flex flex-col gap-2">
              {(['WAT', 'TAT', 'SRT'] as Protocol[]).map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setProtocol(p);
                    setIsActive(false);
                    setCurrentIndex(0);
                    setTimeLeft(timeLimits[p]);
                  }}
                  disabled={isActive}
                  className={cn(
                    "px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all text-left",
                    protocol === p 
                      ? "bg-olq-gold/10 text-olq-gold border border-olq-gold/30 shadow-[0_0_10px_rgba(197,160,89,0.2)]" 
                      : "bg-olq-card hover:bg-olq-card/80 text-gray-400 border border-olq-border disabled:opacity-50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-3">
            {isActive ? (
              <button onClick={handleStop} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 text-red-500 font-bold uppercase tracking-widest border border-red-500/30 hover:bg-red-500/20 transition-all font-display text-xs">
                <Square className="w-4 h-4 fill-current" /> Stop Test
              </button>
            ) : (
              <button onClick={handleStart} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-olq-olive text-white font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(61,68,30,0.5)] border border-olq-gold/20 hover:border-olq-gold/50 transition-all font-display text-xs">
                <Play className="w-4 h-4 fill-current" /> Start Test
              </button>
            )}
          </div>
        </div>

        {/* Display Panel */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
          {isActive && (
            <div className="absolute top-6 left-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">
              Item {currentIndex + 1} of {activeList.length}
            </div>
          )}

          <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[300px] gap-6">
            {!isActive ? (
              <div className="text-center space-y-4 text-gray-500">
                <RefreshCw className="w-12 h-12 mx-auto opacity-20" />
                <p className="text-xs uppercase tracking-widest font-bold">Press Start to Begin {protocol}</p>
              </div>
            ) : (
              protocol === 'TAT' ? (
                <div className="relative group w-full flex flex-col items-center">
                  <img 
                    src={currentItem} 
                    alt="TAT Stimulus" 
                    className="max-w-full max-h-[400px] object-contain rounded-lg border border-olq-border shadow-2xl"
                  />
                  <div className="mt-6 flex justify-end w-full max-w-md">
                    <button 
                      onClick={() => downloadImage(currentItem)}
                      disabled={isDownloading}
                      className="flex items-center gap-2 px-4 py-2 bg-olq-gold/10 border border-olq-gold/30 rounded-lg text-[10px] font-bold text-olq-gold uppercase tracking-widest hover:bg-olq-gold/20 transition-all disabled:opacity-50"
                    >
                      <Download className="w-3 h-3" />
                      {isDownloading ? 'Downloading...' : 'Download Image'}
                    </button>
                  </div>
                </div>
              ) : protocol === 'WAT' ? (
                <h1 className="text-6xl sm:text-8xl font-bold text-white tracking-wider font-display drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] text-center break-words max-w-full">
                  {currentItem}
                </h1>
              ) : (
                <p className="text-xl sm:text-3xl text-white font-serif leading-relaxed text-center group">
                  <span className="inline-block text-olq-gold opacity-50 text-5xl font-mono mr-2 transform -translate-y-2">"</span>
                  {currentItem}
                  <span className="inline-block text-olq-gold opacity-50 text-5xl font-mono ml-2 transform translate-y-4">"</span>
                </p>
              )
            )}
          </div>

          {/* Progress Bar under the stimulus */}
          {isActive && (
            <div className="w-full max-w-xl mx-auto h-1 bg-gray-800 rounded-full mt-12 overflow-hidden">
              <div 
                className="h-full bg-olq-gold transition-all duration-1000 shadow-[0_0_10px_rgba(197,160,89,0.5)]"
                style={{ width: `${(timeLeft / timeLimits[protocol]) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
