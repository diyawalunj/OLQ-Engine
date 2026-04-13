import React, { useState, useEffect } from 'react';
import { Users, Clock, Play, RefreshCw, Map, Mic, MessageSquare, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import { useAuthStore } from '../stores/authStore';

type GTOMode = 'select' | 'gpe' | 'lecturette' | 'gd';

// GPE Scenario data
const GPE_SCENARIOS = [
  {
    title: 'Flood Relief Operation',
    situation: 'Your unit is stationed near a river. Due to heavy rains, the river has flooded, affecting 3 villages. Village A (5 km north) has 200 people stranded on rooftops. Village B (3 km east) has a collapsed bridge with 50 people cut off. Village C (8 km west) has a medical camp that is running out of supplies. You have 2 boats, 1 truck, 15 soldiers, and a radio set. You must resolve the situation within 6 hours.',
    problems: [
      'Rescue stranded people in Village A',
      'Restore access to Village B',
      'Resupply medical camp in Village C',
      'Maintain communication with HQ',
      'Ensure safety of your soldiers',
    ],
  },
  {
    title: 'Border Patrol Crisis',
    situation: 'You are a patrol commander at a forward post. Intelligence reports suggest enemy infiltrators are moving toward a nearby village (4 km). Simultaneously, a fellow soldier has been bitten by a snake and needs immediate medical attention (nearest hospital 15 km). Your radio has limited battery. A civilian from the village has come seeking help reporting missing cattle suspected stolen by smugglers. You have 10 soldiers, 2 vehicles, and basic medical kit.',
    problems: [
      'Neutralize/intercept infiltrators',
      'Provide medical aid to the snake-bitten soldier',
      'Handle the civilian complaint',
      'Conserve radio battery for critical communication',
      'Secure the post while deploying soldiers',
    ],
  },
];

// Lecturette Topics
const LECTURETTE_TOPICS_POOL = [
  'Role of Youth in Nation Building',
  'Climate Change and National Security',
  'Social Media: Boon or Bane',
  'Women in Armed Forces',
  'Importance of Physical Fitness for Officers',
  'India\'s Space Programme and Defence',
  'Leadership in Crisis Situations',
  'Artificial Intelligence in Defence',
  'Importance of Self-Discipline',
  'Unity in Diversity',
  'Role of Armed Forces in Disaster Management',
  'Education System Reforms',
  'Cyber Warfare: The New Battlefield',
  'Sustainability and Green Energy',
  'Mental Health in Armed Forces',
];

// GD Topics
const GD_TOPICS = [
  'Should military service be compulsory for all citizens?',
  'Is technology making soldiers less capable or more effective?',
  'Are peace talks more effective than military action?',
  'Should women be deployed in frontline combat roles?',
  'Is social media a threat to national security?',
  'Can an officer be an effective leader without combat experience?',
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GTOTab() {
  const { user, setShowAuthModal } = useAuthStore();
  const [mode, setMode] = useState<GTOMode>('select');

  // GPE state
  const [gpeScenario, setGpeScenario] = useState(GPE_SCENARIOS[0]);
  const [gpePlan, setGpePlan] = useState('');
  const [gpeTimeLeft, setGpeTimeLeft] = useState(600); // 10 minutes
  const [gpeActive, setGpeActive] = useState(false);

  // Lecturette state
  const [lecTopics, setLecTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [lecPhase, setLecPhase] = useState<'pick' | 'prep' | 'deliver' | 'done'>('pick');
  const [lecTimeLeft, setLecTimeLeft] = useState(0);
  const [lecNotes, setLecNotes] = useState('');

  // GD state
  const [gdTopic, setGdTopic] = useState('');
  const [gdPoints, setGdPoints] = useState<string[]>(['']);
  const [gdTimeLeft, setGdTimeLeft] = useState(0);
  const [gdActive, setGdActive] = useState(false);

  // Timers
  useEffect(() => {
    if (mode === 'gpe' && gpeActive && gpeTimeLeft > 0) {
      const t = setInterval(() => setGpeTimeLeft(v => v - 1), 1000);
      return () => clearInterval(t);
    }
  }, [mode, gpeActive, gpeTimeLeft]);

  useEffect(() => {
    if (mode === 'lecturette' && (lecPhase === 'prep' || lecPhase === 'deliver') && lecTimeLeft > 0) {
      const t = setInterval(() => setLecTimeLeft(v => v - 1), 1000);
      return () => clearInterval(t);
    }
    if (mode === 'lecturette' && lecTimeLeft === 0) {
      if (lecPhase === 'prep') { setLecPhase('deliver'); setLecTimeLeft(180); }
      else if (lecPhase === 'deliver') { setLecPhase('done'); }
    }
  }, [mode, lecPhase, lecTimeLeft]);

  useEffect(() => {
    if (mode === 'gd' && gdActive && gdTimeLeft > 0) {
      const t = setInterval(() => setGdTimeLeft(v => v - 1), 1000);
      return () => clearInterval(t);
    }
  }, [mode, gdActive, gdTimeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const startGPE = () => {
    if (!user) { setShowAuthModal(true); return; }
    setGpeScenario(GPE_SCENARIOS[Math.floor(Math.random() * GPE_SCENARIOS.length)]);
    setGpePlan('');
    setGpeTimeLeft(600);
    setGpeActive(true);
  };

  const startLecturette = () => {
    if (!user) { setShowAuthModal(true); return; }
    setLecTopics(shuffleArray(LECTURETTE_TOPICS_POOL).slice(0, 4));
    setSelectedTopic('');
    setLecPhase('pick');
    setLecNotes('');
  };

  const startGD = () => {
    if (!user) { setShowAuthModal(true); return; }
    setGdTopic(GD_TOPICS[Math.floor(Math.random() * GD_TOPICS.length)]);
    setGdPoints(['']);
    setGdTimeLeft(300); // 5 minutes
    setGdActive(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AnimatePresence mode="wait">
        {/* MODE SELECTION */}
        {mode === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-olq-card border border-olq-border rounded-xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-olq-green/5 blur-[100px] pointer-events-none" />
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-12 h-12 bg-olq-green/10 rounded-xl flex items-center justify-center border border-olq-green/20">
                  <Users className="text-olq-green w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">GTO Tasks</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Group Testing Officer Exercises</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                {[
                  { id: 'gpe' as GTOMode, icon: Map, title: 'Group Planning', desc: 'Map-based tactical planning', time: '10 min' },
                  { id: 'lecturette' as GTOMode, icon: Mic, title: 'Lecturette', desc: 'Individual presentation', time: '3+3 min' },
                  { id: 'gd' as GTOMode, icon: MessageSquare, title: 'Group Discussion', desc: 'Structured debate practice', time: '5 min' },
                ].map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setMode(task.id)}
                    className="bg-olq-bg border border-olq-border rounded-xl p-6 text-left hover:border-olq-gold/30 transition-all group"
                  >
                    <task.icon className="w-8 h-8 text-olq-gold/40 mb-4 group-hover:text-olq-gold transition-colors" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display mb-1">{task.title}</h3>
                    <p className="text-[10px] text-gray-500 mb-3">{task.desc}</p>
                    <span className="text-[10px] font-mono text-olq-gold/60">{task.time}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* GPE */}
        {mode === 'gpe' && (
          <motion.div key="gpe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => { setMode('select'); setGpeActive(false); }} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">← Back</button>
              {gpeActive && (
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold", gpeTimeLeft <= 60 ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-olq-bg border-olq-border text-white")}>
                  <Clock className="w-4 h-4" /> {formatTime(gpeTimeLeft)}
                </div>
              )}
            </div>

            {!gpeActive ? (
              <div className="bg-olq-card border border-olq-border rounded-xl p-8 text-center space-y-6">
                <Map className="w-12 h-12 text-olq-gold/40 mx-auto" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">Group Planning Exercise</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">You will be given a tactical scenario with multiple problems. Plan your approach within 10 minutes.</p>
                <button onClick={startGPE} className="px-8 py-3 rounded-lg bg-olq-olive text-white font-bold uppercase tracking-widest text-xs border border-olq-gold/20 hover:border-olq-gold/50 transition-all font-display">
                  <Play className="w-4 h-4 inline mr-2" /> Begin Exercise
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-olq-card border border-olq-border rounded-xl p-6 shadow-2xl">
                  <h3 className="text-sm font-bold text-olq-gold uppercase tracking-widest mb-4">{gpeScenario.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">{gpeScenario.situation}</p>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Problems to Solve:</p>
                    {gpeScenario.problems.map((p, i) => (
                      <div key={i} className="flex items-start gap-3 px-3 py-2 bg-olq-bg/50 border border-olq-border rounded-lg">
                        <span className="text-xs font-mono text-olq-gold/60 mt-0.5">{i + 1}.</span>
                        <span className="text-xs text-gray-300">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-olq-card border border-olq-border rounded-xl p-6">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Your Plan</label>
                  <textarea
                    value={gpePlan}
                    onChange={(e) => setGpePlan(e.target.value)}
                    placeholder="Write your detailed plan: priority of tasks, resource allocation, timeline, delegation..."
                    className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors resize-none min-h-[250px] leading-relaxed placeholder:text-gray-700"
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* LECTURETTE */}
        {mode === 'lecturette' && (
          <motion.div key="lecturette" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <button onClick={() => { setMode('select'); setLecPhase('pick'); }} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">← Back</button>

            {lecPhase === 'pick' && lecTopics.length === 0 && (
              <div className="bg-olq-card border border-olq-border rounded-xl p-8 text-center space-y-6">
                <Mic className="w-12 h-12 text-olq-gold/40 mx-auto" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">Lecturette</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">You'll get 4 random topics. Choose one, prepare for 3 minutes, then deliver a 3-minute talk.</p>
                <button onClick={startLecturette} className="px-8 py-3 rounded-lg bg-olq-olive text-white font-bold uppercase tracking-widest text-xs border border-olq-gold/20 hover:border-olq-gold/50 transition-all font-display">
                  <Play className="w-4 h-4 inline mr-2" /> Get Topics
                </button>
              </div>
            )}

            {lecPhase === 'pick' && lecTopics.length > 0 && (
              <div className="bg-olq-card border border-olq-border rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-olq-gold uppercase tracking-widest">Choose Your Topic</h3>
                {lecTopics.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedTopic(t); setLecPhase('prep'); setLecTimeLeft(180); }}
                    className="w-full px-5 py-4 bg-olq-bg border border-olq-border rounded-lg text-left text-sm text-gray-300 hover:border-olq-gold/30 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>{i + 1}. {t}</span>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                ))}
              </div>
            )}

            {(lecPhase === 'prep' || lecPhase === 'deliver') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-olq-card border border-olq-border rounded-xl p-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-display">
                    {lecPhase === 'prep' ? '🗒️ Preparation Time' : '🎤 Delivery Time'}
                  </span>
                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold", lecTimeLeft <= 30 ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" : "bg-olq-bg border-olq-border text-white")}>
                    <Clock className="w-4 h-4" /> {formatTime(lecTimeLeft)}
                  </div>
                </div>

                <div className="bg-olq-card border border-olq-gold/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{selectedTopic}</h3>
                  {lecPhase === 'prep' && (
                    <textarea
                      value={lecNotes}
                      onChange={(e) => setLecNotes(e.target.value)}
                      placeholder="Jot down key points, structure your talk..."
                      className="w-full bg-olq-bg border border-olq-border rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors resize-none min-h-[200px] leading-relaxed placeholder:text-gray-700 mt-4"
                    />
                  )}
                  {lecPhase === 'deliver' && (
                    <div className="mt-4 space-y-4">
                      <p className="text-sm text-gray-400">Deliver your lecturette aloud now. Use the notes below as reference.</p>
                      <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-4 text-xs text-gray-400 font-mono whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                        {lecNotes || 'No notes taken.'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {lecPhase === 'done' && (
              <div className="bg-olq-card border border-olq-gold/30 rounded-xl p-8 text-center space-y-4">
                <h2 className="text-2xl font-bold text-olq-gold uppercase tracking-wider font-display">Lecturette Complete</h2>
                <p className="text-sm text-gray-400">Topic: <span className="text-white">{selectedTopic}</span></p>
                <button onClick={() => { setLecPhase('pick'); setLecTopics([]); }} className="px-6 py-2 rounded-lg border border-olq-border text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
                  <RefreshCw className="w-3 h-3 inline mr-2" /> Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* GD */}
        {mode === 'gd' && (
          <motion.div key="gd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => { setMode('select'); setGdActive(false); }} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">← Back</button>
              {gdActive && (
                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold", gdTimeLeft <= 60 ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-olq-bg border-olq-border text-white")}>
                  <Clock className="w-4 h-4" /> {formatTime(gdTimeLeft)}
                </div>
              )}
            </div>

            {!gdActive ? (
              <div className="bg-olq-card border border-olq-border rounded-xl p-8 text-center space-y-6">
                <MessageSquare className="w-12 h-12 text-olq-gold/40 mx-auto" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">Group Discussion</h3>
                <p className="text-sm text-gray-400 max-w-md mx-auto">Practice structuring your arguments. You'll get a topic and 5 minutes to draft your key points.</p>
                <button onClick={startGD} className="px-8 py-3 rounded-lg bg-olq-olive text-white font-bold uppercase tracking-widest text-xs border border-olq-gold/20 hover:border-olq-gold/50 transition-all font-display">
                  <Play className="w-4 h-4 inline mr-2" /> Start GD
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-olq-card border border-olq-gold/30 rounded-xl p-6">
                  <h3 className="text-xs font-bold text-olq-gold uppercase tracking-widest mb-2">Discussion Topic</h3>
                  <p className="text-lg text-white font-medium">{gdTopic}</p>
                </div>

                <div className="bg-olq-card border border-olq-border rounded-xl p-6 space-y-4">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] block">Your Key Points</label>
                  {gdPoints.map((point, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-xs font-mono text-olq-gold/60 mt-2.5">{i + 1}.</span>
                      <textarea
                        value={point}
                        onChange={(e) => {
                          const newPoints = [...gdPoints];
                          newPoints[i] = e.target.value;
                          setGdPoints(newPoints);
                        }}
                        placeholder="State your argument..."
                        className="flex-1 bg-olq-bg border border-olq-border rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-olq-gold/40 transition-colors resize-none min-h-[60px] leading-relaxed placeholder:text-gray-700"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setGdPoints([...gdPoints, ''])}
                    className="text-[10px] font-bold text-olq-gold/60 uppercase tracking-widest hover:text-olq-gold transition-colors"
                  >
                    + Add Point
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
