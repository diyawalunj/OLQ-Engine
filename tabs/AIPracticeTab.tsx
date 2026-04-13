import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ChevronDown, 
  Loader2, 
  Activity, 
  Target, 
  Users, 
  Brain, 
  Zap,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon,
  Download,
  Lightbulb,
  LayoutGrid,
  MessageSquare,
  HeartHandshake,
  Rocket,
  UserCheck,
  Clock,
  Users2,
  Sun,
  Flame,
  Dumbbell,
  Linkedin,
  Instagram
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeResponses, AnalysisResult, GeminiError } from '../geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
// @ts-ignore
import html2pdf from 'html2pdf.js';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to get icon based on OLQ name
const getOlqIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('intelligence')) return <Brain className="w-4 h-4" />;
  if (n.includes('reasoning')) return <Lightbulb className="w-4 h-4" />;
  if (n.includes('organizing')) return <LayoutGrid className="w-4 h-4" />;
  if (n.includes('expression')) return <MessageSquare className="w-4 h-4" />;
  if (n.includes('adaptability')) return <Users className="w-4 h-4" />;
  if (n.includes('cooperation')) return <HeartHandshake className="w-4 h-4" />;
  if (n.includes('responsibility')) return <Shield className="w-4 h-4" />;
  if (n.includes('initiative')) return <Rocket className="w-4 h-4" />;
  if (n.includes('confidence')) return <UserCheck className="w-4 h-4" />;
  if (n.includes('decision')) return <Clock className="w-4 h-4" />;
  if (n.includes('influence')) return <Users2 className="w-4 h-4" />;
  if (n.includes('liveliness')) return <Sun className="w-4 h-4" />;
  if (n.includes('determination')) return <Target className="w-4 h-4" />;
  if (n.includes('courage')) return <Flame className="w-4 h-4" />;
  if (n.includes('stamina')) return <Dumbbell className="w-4 h-4" />;
  return <Activity className="w-4 h-4" />;
};

// Helper for strength visualization
function StrengthIndicator({ strength }: { strength: 'STRONG' | 'ADEQUATE' | 'MARGINAL' }) {
  const levels = {
    'STRONG': 3,
    'ADEQUATE': 2,
    'MARGINAL': 1
  };
  
  const colors = {
    'STRONG': 'bg-olq-gold shadow-[0_0_8px_rgba(197,160,89,0.6)]',
    'ADEQUATE': 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]',
    'MARGINAL': 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
  };

  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map((i) => (
        <div 
          key={i}
          className={cn(
            "w-3 h-1 rounded-full transition-all duration-500",
            i <= levels[strength] ? colors[strength] : "bg-gray-800"
          )}
        />
      ))}
      <span className={cn(
        "text-[8px] font-bold ml-2 uppercase tracking-widest",
        strength === 'STRONG' && "text-olq-gold",
        strength === 'ADEQUATE' && "text-yellow-500",
        strength === 'MARGINAL' && "text-red-500"
      )}>
        {strength}
      </span>
    </div>
  );
}

type Status = 'idle' | 'processing' | 'complete' | 'error';
type Protocol = 'WAT' | 'TAT' | 'SRT';

const PROTOCOLS = [
  { id: 'WAT', name: 'Word Association', description: 'Analyze subconscious associations', imageRequired: false },
  { id: 'TAT', name: 'Thematic Apperception', description: 'Story-based projection analysis', imageRequired: true },
  { id: 'SRT', name: 'Situation Reaction', description: 'Practical decision making', imageRequired: false },
];

export default function AIPracticeTab() {
  const [candidateName, setCandidateName] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [protocol, setProtocol] = useState<Protocol>('WAT');
  const [responses, setResponses] = useState('');
  const [srtResponses, setSrtResponses] = useState<{situation: string, response: string}[]>(
    Array(5).fill(null).map(() => ({ situation: '', response: '' }))
  );
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<{ message: string; type: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const STEPS = [
    "Initializing Assessment Engine...",
    "Parsing Candidate Responses...",
    "Evaluating Officer Like Qualities...",
    "Analyzing Psychological Depth...",
    "Checking Cross-Protocol Consistency...",
    "Simulating Panel Risks...",
    "Finalizing Assessment Report..."
  ];

  useEffect(() => {
    let interval: any;
    if (status === 'processing') {
      setProgress(0);
      setCurrentStep(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          const next = prev + Math.random() * 10;
          return next > 95 ? 95 : next;
        });
        setCurrentStep(prev => {
          if (prev < STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 1200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setResponses('');
    setSrtResponses(Array(5).fill(null).map(() => ({ situation: '', response: '' })));
    setImage(null);
  };

  const handleLoadSample = () => {
    if (protocol === 'SRT') {
      setSrtResponses([
        { situation: 'He was going to attend an interview and on the way he saw a person injured in an accident.', response: 'He gave him first aid, took him to the hospital, informed his family and then went for the interview.' },
        { situation: 'His captain was injured just before a crucial match.', response: 'He took over the captaincy, motivated the team, and won the match.' },
        { situation: 'He was in a train and saw a thief snatching a lady\'s purse.', response: 'He chased the thief, caught him, handed him over to the police and returned the purse.' },
        { situation: 'He was preparing for exams and the lights went out.', response: 'He used a candle/emergency light and continued his studies.' },
        { situation: 'He lost his way in a dense forest.', response: 'He used a compass/sun/stars for direction, found a trail and reached safety.' }
      ]);
      return;
    }
    const samples = {
      'WAT': 'Responsibility - He willingly accepts responsibility for his actions.\nDetermination - He showed great determination in completing the task despite obstacles.\nCooperation - He worked well with his team to achieve the common goal.',
      'TAT': 'The hero is a young officer leading his platoon through a difficult mountain pass. He remains calm and composed, making quick decisions to ensure the safety of his men. They successfully complete the mission and return to base.',
      'SRT': 'Situation: You are on a train and see someone stealing a bag. Reaction: I would immediately alert the railway police and try to stop the person with the help of other passengers.',
    };
    setResponses(samples[protocol] || '');
  };

  const protocolConfig = PROTOCOLS.find(p => p.id === protocol);
  const isImageRequired = protocolConfig?.imageRequired;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPDF = async () => {
    if (!resultsRef.current || !result) return;
    
    setIsExporting(true);
    try {
      const element = resultsRef.current;
      const opt = {
        margin: 10,
        filename: `${candidateName || 'Candidate'}_OLQ_Assessment_${protocol}_${new Date().getTime()}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#0c0e0c',
          onclone: (clonedDoc: Document) => {
            // Fix for html2canvas not supporting modern CSS color functions in Tailwind v4
            const colorRegex = /(oklch|oklab|color-mix|hwb|lab|lch|light-dark|color)\s*\((?:[^()]+|\([^()]*\))*\)/gi;
            
            // Aggressively sanitize the entire document's HTML to catch all style definitions
            if (clonedDoc.head) {
              clonedDoc.head.innerHTML = clonedDoc.head.innerHTML.replace(colorRegex, '#444');
            }
            if (clonedDoc.body) {
              clonedDoc.body.innerHTML = clonedDoc.body.innerHTML.replace(colorRegex, '#444');
            }
            
            // Remove link tags that might contain modern CSS
            const linkElements = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
            linkElements.forEach(link => link.remove());
          }
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Export Error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleInitiate = async () => {
    let finalResponses = responses;
    if (protocol === 'SRT') {
      finalResponses = srtResponses
        .map((s, i) => `SRT ${i + 1}:\nSituation: ${s.situation}\nResponse: ${s.response}`)
        .join('\n\n');
    }

    if (!finalResponses.trim()) return;
    if (isImageRequired && !image) {
      alert(`Image upload is compulsory for ${protocol} analysis.`);
      return;
    }

    setStatus('processing');
    setError(null);
    try {
      const data = await analyzeResponses(protocol, finalResponses, image || undefined);
      setResult(data);
      setStatus('complete');
      
      // Auto-scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      if (err instanceof GeminiError) {
        setError({ message: err.message, type: err.type });
      } else {
        setError({ message: "An unexpected error occurred. Please try again.", type: "UNKNOWN" });
      }
    }
  };

  return (
    <div className="flex flex-col selection:bg-olq-gold/30 w-full animate-in fade-in duration-500">
      {/* Status Bar for AIPracticeTab */}
      <div className="flex items-center justify-end gap-3 mb-6">
        {status === 'complete' && (
          <button 
            onClick={handleReset}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-olq-border text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:bg-olq-card hover:text-white transition-all font-display"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-bold tracking-[0.15em] uppercase transition-all duration-500 font-display",
          status === 'idle' && "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)]",
          status === 'processing' && "bg-blue-500/10 border-blue-500/30 text-blue-500 animate-pulse shadow-[0_0_20px_-3px_rgba(59,130,246,0.4)]",
          status === 'complete' && "bg-olq-green/10 border-olq-green/30 text-olq-green shadow-[0_0_15px_-3px_rgba(132,141,98,0.3)]",
          status === 'error' && "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]"
        )}>
          <div className={cn(
            "w-1.5 h-1.5 rounded-full transition-all duration-500",
            status === 'idle' && "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]",
            status === 'processing' && "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]",
            status === 'complete' && "bg-olq-green shadow-[0_0_8px_rgba(132,141,98,0.8)]",
            status === 'error' && "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
          )} />
          {status === 'idle' ? 'Standby' : status === 'processing' ? 'Processing' : status === 'complete' ? 'Assessment Complete' : 'System Error'}
        </div>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 w-full print:block">
        {/* Left Panel: Input */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0 print:hidden">
          <div className="bg-olq-card border border-olq-border rounded-xl p-6 shadow-2xl">
            <h2 className="text-xs font-bold text-olq-gold uppercase tracking-[0.25em] mb-6 flex items-center gap-2 font-display">
              <div className="w-1.5 h-1.5 bg-olq-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.6)]" />
              Input Parameters
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Candidate Name (Optional)</label>
                <input 
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter candidate name..."
                  className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-display focus:outline-none focus:border-olq-gold/40 transition-colors"
                />
              </div>

              <div className="relative">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block font-display">Select Test Protocol</label>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 flex items-center justify-between hover:border-olq-gold/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-olq-gold/60" />
                    <span className="text-sm font-medium">{protocol} - {PROTOCOLS.find(p => p.id === protocol)?.name}</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-olq-gold/60 transition-transform", isDropdownOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-olq-card border border-olq-border rounded-lg overflow-hidden z-20 shadow-2xl"
                    >
                      {PROTOCOLS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setProtocol(p.id as Protocol);
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left hover:bg-olq-gold/10 transition-colors flex flex-col gap-0.5",
                            protocol === p.id && "bg-olq-gold/5"
                          )}
                        >
                          <span className="text-sm font-bold text-white">{p.id}</span>
                          <span className="text-[11px] text-gray-500 uppercase tracking-wider">{p.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Image Upload for TAT */}
              <AnimatePresence>
                {isImageRequired && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block flex items-center justify-between font-display">
                      <span>Upload Reference Image (Compulsory)</span>
                      {image && <CheckCircle2 className="w-3 h-3 text-olq-gold" />}
                    </label>
                    
                    {!image ? (
                      <label className="w-full h-32 border-2 border-dashed border-olq-border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-olq-gold/40 hover:bg-olq-gold/5 transition-all group">
                        <Upload className="w-6 h-6 text-gray-600 group-hover:text-olq-gold/60 transition-colors" />
                        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Click to upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    ) : (
                      <div className="relative group">
                        <img 
                          src={image} 
                          alt="Uploaded" 
                          className="w-full h-32 object-cover rounded-lg border border-olq-border"
                        />
                        <button 
                          onClick={() => setImage(null)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] block font-display">Candidate Response Set</label>
                  <button 
                    onClick={handleClear}
                    className="text-[9px] font-bold text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1"
                  >
                    <X className="w-2.5 h-2.5" />
                    Clear
                  </button>
                </div>
                <div className="flex gap-2 mb-3">
                  <button 
                    onClick={handleLoadSample}
                    className="text-[9px] font-bold text-olq-gold/60 hover:text-olq-gold uppercase tracking-widest transition-colors border border-olq-gold/20 px-2 py-1 rounded"
                  >
                    Load Sample Data
                  </button>
                </div>
                {protocol === 'SRT' ? (
                  <div className="space-y-6">
                    {srtResponses.map((srt, idx) => (
                      <div key={idx} className="bg-olq-card border border-olq-border rounded-xl p-5 space-y-4 shadow-sm hover:border-olq-gold/20 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-olq-gold uppercase tracking-[0.2em] font-display">SRT {idx + 1}</span>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block">Situation</label>
                          <textarea 
                            value={srt.situation}
                            onChange={(e) => {
                              const newSrt = [...srtResponses];
                              newSrt[idx].situation = e.target.value;
                              setSrtResponses(newSrt);
                            }}
                            placeholder="Describe the situation..."
                            className="w-full bg-olq-bg/50 border border-olq-border rounded-lg px-3 py-2 text-xs font-mono min-h-[80px] focus:outline-none focus:border-olq-gold/40 transition-colors resize-none leading-relaxed text-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block">Response</label>
                          <textarea 
                            value={srt.response}
                            onChange={(e) => {
                              const newSrt = [...srtResponses];
                              newSrt[idx].response = e.target.value;
                              setSrtResponses(newSrt);
                            }}
                            placeholder="How did the candidate react?"
                            className="w-full bg-olq-bg/50 border border-olq-border rounded-lg px-3 py-2 text-xs font-mono min-h-[80px] focus:outline-none focus:border-olq-gold/40 transition-colors resize-none leading-relaxed text-gray-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    <textarea 
                      value={responses}
                      onChange={(e) => setResponses(e.target.value)}
                      placeholder="Enter candidate responses here... (e.g., Responsibility - He willingly accepts responsibility...)"
                      className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono min-h-[300px] focus:outline-none focus:border-olq-gold/40 transition-colors resize-none leading-relaxed"
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-gray-700 pointer-events-none">
                      {responses.length} chars
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleInitiate}
                disabled={status === 'processing' || (protocol !== 'SRT' && !responses.trim()) || (protocol === 'SRT' && !srtResponses.some(s => s.situation.trim() || s.response.trim())) || (isImageRequired && !image)}
                className={cn(
                  "w-full py-4 rounded-lg font-bold uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 font-display",
                  (status === 'processing' || (protocol !== 'SRT' && !responses.trim()) || (protocol === 'SRT' && !srtResponses.some(s => s.situation.trim() || s.response.trim())) || (isImageRequired && !image))
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                    : "bg-olq-olive text-white hover:bg-olq-olive/90 active:scale-[0.98] shadow-[0_0_20px_rgba(61,68,30,0.3)] hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] border border-olq-gold/20 hover:border-olq-gold/50"
                )}
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Initiate Analysis'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-olq-border rounded-2xl bg-olq-card/30"
              >
                <div className="text-center space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-olq-gold/40 uppercase tracking-[0.3em] font-display">System Ready</h3>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest font-display">Awaiting Data Input</p>
                </div>
              </motion.div>
            )}

            {status === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-blue-500/20 rounded-2xl bg-blue-500/5 relative overflow-hidden"
              >
                {/* Background Scanning Effect */}
                <motion.div 
                  initial={{ top: "-100%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent pointer-events-none"
                />

                <div className="text-center space-y-8 px-4 relative z-10 w-full max-w-md">
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-4xl font-bold text-olq-gold/80 uppercase tracking-[0.4em] font-display animate-pulse">Assessing</h3>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      />
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest font-display">System Progress</span>
                      <span className="text-[10px] font-mono text-blue-400">{Math.round(progress)}%</span>
                    </div>
                  </div>

                  <div className="h-12 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-[11px] text-olq-gold/60 font-bold uppercase tracking-[0.2em] font-display text-center"
                      >
                        {STEPS[currentStep]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'error' && error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-red-500/20 rounded-2xl bg-red-500/5 p-8"
              >
                <div className="text-center space-y-6 max-w-md">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider font-display">Analysis Failed</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {error.message}
                    </p>
                  </div>
                  
                  {error.type === 'API_KEY' && (
                    <div className="bg-olq-card border border-olq-border rounded-lg p-4 text-left space-y-3">
                      <p className="text-[11px] font-bold text-olq-gold uppercase tracking-widest">Troubleshooting Steps:</p>
                      <ul className="text-[11px] text-gray-500 space-y-2 list-disc pl-4">
                        <li>Open <strong>Settings</strong> (gear icon) in the top right.</li>
                        <li>Go to <strong>Secrets</strong>.</li>
                        <li>Ensure <code>GEMINI_API_KEY</code> is set with a valid key.</li>
                      </ul>
                    </div>
                  )}

                  <button 
                    onClick={() => setStatus('idle')}
                    className="px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-[11px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-500/20 transition-all"
                  >
                    Dismiss & Retry
                  </button>
                </div>
              </motion.div>
            )}

            {status === 'complete' && result && (
              <motion.div 
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                ref={resultsRef}
              >
                {/* Score & Summary */}
                <div className="bg-olq-card border border-olq-border rounded-xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-olq-gold/5 blur-[100px] -mr-32 -mt-32" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 relative gap-6">
                    <div>
                      <div className="mb-4">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display block mb-1">Candidate Profile</span>
                        <h2 className="text-2xl font-bold text-white font-display">{candidateName || 'Anonymous Candidate'}</h2>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-olq-gold mb-2 font-display uppercase tracking-wider drop-shadow-[0_0_10px_rgba(197,160,89,0.3)]">Readiness Score</h3>
                      <div className="w-full sm:w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.readinessScore * 10}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-olq-olive to-olq-gold shadow-[0_0_15px_rgba(197,160,89,0.5)]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <button 
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-olq-gold/10 border border-olq-gold/30 rounded-lg text-[11px] font-bold text-olq-gold uppercase tracking-widest hover:bg-olq-gold/20 transition-all print:hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isExporting ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                        {isExporting ? 'Exporting...' : 'Download Report'}
                      </button>
                      <div className="text-right">
                        <span className="text-4xl sm:text-5xl font-bold text-white font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{result.readinessScore}</span>
                        <span className="text-lg sm:text-xl text-gray-500 font-mono">/10</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed italic border-l-2 border-olq-gold/30 pl-6 py-2">
                    "{result.summary}"
                  </p>
                </div>

                {/* Overall Assessment */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-olq-card border border-olq-border rounded-xl p-6 text-center">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Psychological Profile</h4>
                    <span className={cn(
                      "text-sm font-bold uppercase tracking-wider",
                      result.overallAssessment.psychologicalProfile === 'Officer Like' ? "text-olq-green" : 
                      result.overallAssessment.psychologicalProfile === 'Borderline' ? "text-yellow-500" : "text-red-500"
                    )}>
                      {result.overallAssessment.psychologicalProfile}
                    </span>
                  </div>
                  <div className="bg-olq-card border border-olq-border rounded-xl p-6 text-center">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Recommendation</h4>
                    <span className={cn(
                      "text-sm font-bold uppercase tracking-wider",
                      result.overallAssessment.recommendation === 'Recommended' ? "text-olq-green" : "text-red-500"
                    )}>
                      {result.overallAssessment.recommendation}
                    </span>
                  </div>
                  <div className="bg-olq-card border border-olq-border rounded-xl p-6 text-center">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Confidence Level</h4>
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                      {result.overallAssessment.confidenceLevel}
                    </span>
                  </div>
                </div>

                {/* OLQ-Wise Analysis */}
                <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                  <h2 className="text-xs font-bold text-olq-gold uppercase tracking-[0.25em] mb-8 flex items-center gap-2 font-display">
                    <div className="w-1.5 h-1.5 bg-olq-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.6)]" />
                    OLQ-Wise Detailed Analysis
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-olq-border">
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">OLQ</th>
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score</th>
                          <th className="py-4 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Evidence & Reasoning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.olqWiseAnalysis.map((olq, idx) => (
                          <tr key={idx} className="border-b border-olq-border/50 hover:bg-olq-bg/30 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-olq-bg border border-olq-border flex items-center justify-center text-olq-gold/40">
                                  {getOlqIcon(olq.name)}
                                </div>
                                <span className="text-xs font-bold text-white">{olq.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-white">{olq.score}</span>
                                <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-olq-gold" 
                                    style={{ width: `${olq.score * 10}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                <p className="text-[10px] text-gray-300"><span className="text-olq-gold/60 font-bold uppercase tracking-tighter mr-1">Evidence:</span> {olq.evidence}</p>
                                <p className="text-[10px] text-gray-500 italic"><span className="text-gray-600 font-bold uppercase tracking-tighter mr-1">Reasoning:</span> {olq.reasoning}</p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Test-Wise Analysis */}
                <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                  <h2 className="text-xs font-bold text-olq-gold uppercase tracking-[0.25em] mb-8 flex items-center gap-2 font-display">
                    <div className="w-1.5 h-1.5 bg-olq-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.6)]" />
                    Test-Wise Insights
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.testWiseAnalysis.wat && (
                      <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 flex flex-col items-end">
                          <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Score</span>
                          <span className="text-lg font-bold text-olq-gold font-mono">{result.testWiseAnalysis.wat.score}/10</span>
                        </div>
                        <h4 className="text-[10px] font-bold text-olq-gold uppercase tracking-widest mb-4">WAT Analysis</h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Reasoning</span>
                            <p className="text-xs text-gray-300 italic mb-3">{result.testWiseAnalysis.wat.reasoning}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Thought Pattern</span>
                            <p className="text-xs text-gray-300">{result.testWiseAnalysis.wat.thoughtPattern}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">OLQ Indicators</span>
                            <p className="text-xs text-gray-300">{result.testWiseAnalysis.wat.olqIndicators}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {result.testWiseAnalysis.srt && (
                      <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 flex flex-col items-end">
                          <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Score</span>
                          <span className="text-lg font-bold text-olq-gold font-mono">{result.testWiseAnalysis.srt.score}/10</span>
                        </div>
                        <h4 className="text-[10px] font-bold text-olq-gold uppercase tracking-widest mb-4">SRT Analysis</h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Reasoning</span>
                            <p className="text-xs text-gray-300 italic mb-3">{result.testWiseAnalysis.srt.reasoning}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Decision Making</span>
                            <p className="text-xs text-gray-300">{result.testWiseAnalysis.srt.decisionMaking}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Practicality</span>
                            <p className="text-xs text-gray-300">{result.testWiseAnalysis.srt.practicality}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Responsibility</span>
                            <p className="text-xs text-gray-300">{result.testWiseAnalysis.srt.responsibility}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {result.testWiseAnalysis.tat && (
                      <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 flex flex-col items-end">
                          <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Score</span>
                          <span className="text-lg font-bold text-olq-gold font-mono">{result.testWiseAnalysis.tat.score}/10</span>
                        </div>
                        <h4 className="text-[10px] font-bold text-olq-gold uppercase tracking-widest mb-4">TAT Analysis</h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Reasoning</span>
                            <p className="text-xs text-gray-300 italic mb-3">{result.testWiseAnalysis.tat.reasoning}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Theme</span>
                            <p className="text-xs text-gray-300">{result.testWiseAnalysis.tat.theme}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Character Behavior</span>
                            <p className="text-xs text-gray-300">{result.testWiseAnalysis.tat.characterBehavior}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Outcome</span>
                            <p className="text-xs text-gray-300">{result.testWiseAnalysis.tat.outcome}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                    <h2 className="text-xs font-bold text-olq-green uppercase tracking-[0.25em] mb-6 flex items-center gap-2 font-display">
                      <CheckCircle2 className="w-4 h-4" />
                      Key Strengths
                    </h2>
                    <ul className="space-y-3">
                      {result.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-gray-300">
                          <div className="w-1.5 h-1.5 bg-olq-green rounded-full mt-1.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                    <h2 className="text-xs font-bold text-red-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-2 font-display">
                      <AlertCircle className="w-4 h-4" />
                      Areas for Improvement
                    </h2>
                    <ul className="space-y-3">
                      {result.weaknesses.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-gray-300">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Failure Analysis & Ideal Responses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Failure Analysis */}
                  {result.failureAnalysis && result.failureAnalysis.length > 0 && (
                    <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                      <h2 className="text-xs font-bold text-red-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-2 font-display">
                        <AlertCircle className="w-4 h-4" />
                        Failure Analysis (Rejection Risks)
                      </h2>
                      <div className="space-y-4">
                        {result.failureAnalysis.map((fa, idx) => (
                          <div key={idx} className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-2">{fa.issue}</span>
                            <p className="text-xs text-gray-300 italic">"{fa.reasonForRejection}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ideal Response Hints */}
                  {result.idealResponseHints && result.idealResponseHints.length > 0 && (
                    <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                      <h2 className="text-xs font-bold text-olq-gold uppercase tracking-[0.25em] mb-6 flex items-center gap-2 font-display">
                        <Lightbulb className="w-4 h-4" />
                        Ideal Response Hints
                      </h2>
                      <div className="space-y-4">
                        {result.idealResponseHints.map((hint, idx) => (
                          <div key={idx} className="bg-olq-gold/5 border border-olq-gold/20 rounded-lg p-4">
                            <span className="text-[10px] font-bold text-olq-gold/60 uppercase tracking-widest block mb-2">{hint.context}</span>
                            <p className="text-xs text-gray-300">"{hint.hint}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Improvement Plan */}
                <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                  <h2 className="text-xs font-bold text-olq-gold uppercase tracking-[0.25em] mb-8 flex items-center gap-2 font-display">
                    <div className="w-1.5 h-1.5 bg-olq-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.6)]" />
                    Strategic Improvement Plan
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-5">
                      <h4 className="text-[10px] font-bold text-olq-gold uppercase tracking-widest mb-4">OLQ-Wise Suggestions</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.improvementPlan.olqWiseSuggestions.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-xs text-gray-300">
                            <div className="w-1 h-1 bg-olq-gold rounded-full mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {result.improvementPlan.watCorrection && (
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block">WAT Correction</span>
                          <p className="text-xs text-gray-400 italic">"{result.improvementPlan.watCorrection}"</p>
                        </div>
                      )}
                      {result.improvementPlan.srtImprovement && (
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block">SRT Improvement</span>
                          <p className="text-xs text-gray-400 italic">"{result.improvementPlan.srtImprovement}"</p>
                        </div>
                      )}
                      {result.improvementPlan.tatStructuring && (
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block">TAT Structuring</span>
                          <p className="text-xs text-gray-400 italic">"{result.improvementPlan.tatStructuring}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] font-display">Realism Score</h4>
                      <span className="text-xl font-bold text-white font-mono">{result.realismScore}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.realismScore * 10}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className="h-full bg-olq-gold shadow-[0_0_10px_rgba(197,160,89,0.4)]"
                      />
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {result.realismDescription}
                    </p>
                  </div>
                  <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] font-display">Artificiality Risk</h4>
                      <span className={cn(
                        "text-[11px] font-bold px-3 py-1 rounded border uppercase tracking-widest font-display shadow-sm",
                        result.artificialityRisk === 'HIGH' && "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
                        result.artificialityRisk === 'MEDIUM' && "bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
                        result.artificialityRisk === 'LOW' && "bg-olq-gold/10 border-olq-gold/30 text-olq-gold shadow-[0_0_10px_rgba(197,160,89,0.2)]"
                      )}>
                        {result.artificialityRisk}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {result.artificialityDescription}
                    </p>
                  </div>
                </div>

                {/* Profile Summary */}
                <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                  <h2 className="text-xs font-bold text-olq-gold uppercase tracking-[0.25em] mb-8 flex items-center gap-2 font-display">
                    <div className="w-1.5 h-1.5 bg-olq-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.6)]" />
                    Psychological Profile Summary
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ProfileCard 
                      icon={<Brain className="w-4 h-4" />}
                      title="Emotional Stability"
                      content={result.profile.emotionalStability}
                    />
                    <ProfileCard 
                      icon={<Users className="w-4 h-4" />}
                      title="Social Adaptability"
                      content={result.profile.socialAdaptability}
                    />
                    <ProfileCard 
                      icon={<Zap className="w-4 h-4" />}
                      title="Leadership Potential"
                      content={result.profile.leadershipPotential}
                    />
                    <ProfileCard 
                      icon={<Target className="w-4 h-4" />}
                      title="Decision Making"
                      content={result.profile.decisionMaking}
                    />
                  </div>
                </div>

                {/* Identified OLQs */}
                <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                  <h2 className="text-xs font-bold text-olq-gold uppercase tracking-[0.25em] mb-8 flex items-center gap-2 font-display">
                    <div className="w-1.5 h-1.5 bg-olq-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.6)]" />
                    Identified Officer Like Qualities
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {result.identifiedOlqs.map((olq, idx) => (
                      <div key={idx} className="bg-olq-bg/50 border border-olq-border rounded-lg p-5 group hover:border-olq-gold/30 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-olq-bg border border-olq-border flex items-center justify-center text-olq-gold/40 group-hover:text-olq-gold group-hover:border-olq-gold/50 transition-all shrink-0">
                              {getOlqIcon(olq.name)}
                            </div>
                            <h4 className="text-sm font-bold text-white">{olq.name}</h4>
                          </div>
                          <StrengthIndicator strength={olq.strength} />
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed sm:pl-11">
                          {olq.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel Risk Simulation */}
                <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                  <h2 className="text-xs font-bold text-olq-gold uppercase tracking-[0.25em] mb-8 flex items-center gap-2 font-display">
                    <div className="w-1.5 h-1.5 bg-olq-gold rounded-full shadow-[0_0_10px_rgba(197,160,89,0.6)]" />
                    Panel Risk Simulation
                  </h2>

                  <div className="space-y-6">
                    {result.riskSimulation.map((risk, idx) => (
                      <div key={idx} className="border-l-2 border-red-500/30 pl-4 sm:pl-6 py-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[11px] font-bold text-red-500">
                            {idx + 1}
                          </div>
                          <h4 className="text-sm font-bold text-white">{risk.title}</h4>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {risk.description}
                        </p>
                        <div className="bg-olq-bg border border-olq-border rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-olq-gold uppercase tracking-[0.15em] font-display">
                            <Zap className="w-3 h-3" />
                            Recommended Probe
                          </div>
                          <p className="text-xs text-gray-300 italic leading-relaxed">
                            "{risk.recommendedProbe}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ProfileCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="space-y-3 group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-olq-bg border border-olq-border flex items-center justify-center text-olq-gold/40 group-hover:text-olq-gold group-hover:border-olq-gold/50 group-hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all">
          {icon}
        </div>
        <h5 className="text-[11px] font-bold text-olq-gold/60 uppercase tracking-[0.15em] font-display group-hover:text-olq-gold transition-colors">{title}</h5>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed pl-11">
        {content}
      </p>
    </div>
  );
}
