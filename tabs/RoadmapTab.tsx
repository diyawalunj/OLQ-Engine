import React, { useState, useEffect } from 'react';
import { Map, Target, Clock, Loader2, RefreshCw, CheckCircle2, Circle, Flame, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils';
import { useAuthStore } from '../stores/authStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { generateRoadmap, Roadmap, RoadmapGoal } from '../geminiRoadmapService';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';

export default function RoadmapTab() {
  const { user } = useAuthStore();
  const { profile } = useOnboardingStore();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const fetchRoadmap = async () => {
    if (!user || !profile) return;
    setIsLoading(true);
    setError(null);

    try {
      let recentScores: number[] = [];
      if (db.app.options.apiKey !== 'mock_api_key') {
        const q = query(collection(db, 'assessments'), where('uid', '==', user.uid), orderBy('date', 'desc'), limit(5));
        const snap = await getDocs(q);
        recentScores = snap.docs.map(d => d.data().readinessScore || 0);
      }

      const data = await generateRoadmap(
        profile.entryTypes.join(', ') || 'General',
        '',
        profile.selfAssessment,
        0,
        recentScores
      );
      setRoadmap(data);
    } catch (err: any) {
      console.error('Roadmap generation failed:', err);
      setError(err.message || 'Failed to generate roadmap');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.onboardingComplete && !roadmap && !isLoading) {
      fetchRoadmap();
    }
  }, [profile]);

  const toggleGoal = (id: string) => {
    const newSet = new Set(completedGoals);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCompletedGoals(newSet);
  };

  const ssbStageLabel = profile?.ssbStage || 'Unknown';

  const getGoals = (): RoadmapGoal[] => {
    if (!roadmap) return [];
    switch (activeFilter) {
      case 'daily': return roadmap.dailyGoals;
      case 'weekly': return roadmap.weeklyGoals;
      case 'monthly': return roadmap.monthlyGoals;
    }
  };

  const goals = getGoals();
  const completedCount = goals.filter(g => completedGoals.has(g.id)).length;

  if (!profile?.onboardingComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <Map className="w-16 h-16 text-olq-gold/20" />
        <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest font-display">Complete PIQ Form First</h2>
        <p className="text-sm text-gray-500 max-w-md">Fill out your Personal Information Questionnaire to unlock your personalized roadmap.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="bg-olq-card border border-olq-border rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-olq-gold/5 blur-[100px] pointer-events-none" />
        <div className="z-10">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display flex items-center gap-3 mb-2">
            <Map className="w-6 h-6 text-olq-gold" /> Preparation Roadmap
          </h2>
          <p className="text-sm text-gray-400">
            AI-generated plan for <span className="text-olq-gold font-bold">{profile.entryTypes.join(' / ') || 'SSB'}</span> preparation
          </p>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display mb-1">Stage</p>
            <span className="text-xs font-bold font-mono text-olq-gold capitalize">{ssbStageLabel.replace(/_/g, ' ')}</span>
          </div>
          <button onClick={fetchRoadmap} disabled={isLoading} className="p-3 rounded-xl bg-olq-bg border border-olq-border hover:border-olq-gold/30 transition-colors disabled:opacity-50">
            {isLoading ? <Loader2 className="w-4 h-4 text-olq-gold animate-spin" /> : <RefreshCw className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 text-olq-gold animate-spin" />
          <p className="text-sm text-gray-400 font-display uppercase tracking-widest">Generating your AI roadmap...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchRoadmap} className="mt-3 text-xs text-red-500 underline">Retry</button>
        </div>
      )}

      {roadmap && !isLoading && (
        <>
          {/* Focus Areas & Encouragement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-olq-card border border-olq-border rounded-xl p-6">
              <h3 className="text-[11px] font-bold text-olq-gold uppercase tracking-[0.2em] font-display mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Focus Areas
              </h3>
              <div className="space-y-2">
                {roadmap.focusAreas.map((area, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-olq-bg/50 border border-olq-border rounded-lg">
                    <Flame className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="text-xs text-gray-300">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-olq-gold/5 border border-olq-gold/20 rounded-xl p-6 flex items-center">
              <div>
                <h3 className="text-[11px] font-bold text-olq-gold uppercase tracking-[0.2em] font-display mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Coach Says
                </h3>
                <p className="text-sm text-gray-300 italic leading-relaxed">"{roadmap.encouragement}"</p>
                <p className="text-[10px] text-olq-gold/60 mt-3 uppercase tracking-widest font-display">Weekly Focus: {roadmap.weeklyFocus}</p>
              </div>
            </div>
          </div>

          {/* Goal Tabs */}
          <div className="flex gap-3">
            {(['daily', 'weekly', 'monthly'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all font-display",
                  activeFilter === f ? "bg-olq-gold/10 border-olq-gold/30 text-olq-gold" : "bg-olq-card border-olq-border text-gray-500 hover:text-white"
                )}
              >
                {f} Goals
              </button>
            ))}
            <div className="ml-auto text-xs text-gray-500 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-olq-green" />
              {completedCount}/{goals.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: goals.length > 0 ? `${(completedCount / goals.length) * 100}%` : '0%' }}
              className="h-full bg-gradient-to-r from-olq-olive to-olq-gold shadow-[0_0_10px_rgba(197,160,89,0.5)]"
            />
          </div>

          {/* Goals List */}
          <div className="space-y-3">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                className={cn(
                  "bg-olq-card border rounded-xl p-5 transition-all cursor-pointer group",
                  completedGoals.has(goal.id) ? "border-olq-green/30 opacity-70" : "border-olq-border hover:border-olq-gold/30"
                )}
                onClick={() => toggleGoal(goal.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 shrink-0">
                    {completedGoals.has(goal.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-olq-green" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600 group-hover:text-olq-gold/60 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className={cn("text-sm font-bold", completedGoals.has(goal.id) ? "text-gray-500 line-through" : "text-white")}>
                        {goal.title}
                      </h4>
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                        goal.priority === 'HIGH' ? "text-red-500 border-red-500/30 bg-red-500/10" :
                        goal.priority === 'MEDIUM' ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10" :
                        "text-blue-400 border-blue-400/30 bg-blue-400/10"
                      )}>
                        {goal.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{goal.description}</p>
                    {goal.targetOLQs.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {goal.targetOLQs.slice(0, 3).map((olq, i) => (
                          <span key={i} className="text-[8px] font-bold text-olq-gold/50 uppercase tracking-widest bg-olq-gold/5 px-2 py-0.5 rounded">{olq}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
