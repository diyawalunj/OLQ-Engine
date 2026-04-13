import React, { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, LogOut, Award, Star, History, Target, ShieldCheck, Mail, Phone, Brain, Loader2 } from 'lucide-react';
import { cn } from '../utils';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';

export default function ProfileTab() {
  const { user, logout } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user) return;
      if (db.app.options.apiKey === 'mock_api_key') {
        setIsLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'assessments'), 
          where('uid', '==', user.uid),
          orderBy('date', 'desc'),
          limit(30)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            date: d.date?.toDate ? d.date.toDate() : new Date(),
            score: d.readinessScore || 0,
            protocol: d.protocol || 'WAT',
            ...d
          };
        });
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssessments();
  }, [user]);

  const stats = useMemo(() => {
    if (history.length === 0) return { avg: 0, total: 0 };
    const total = history.length;
    const sum = history.reduce((acc, curr) => acc + curr.score, 0);
    return { avg: (sum / total).toFixed(1), total };
  }, [history]);

  const mockBadges = [
    { title: "First Blood", desc: "Completed first practice", icon: Target, earned: history.length > 0 },
    { title: "Psychological Insight", desc: "Achieved >8 in AI Assessment", icon: Brain, earned: history.some(h => h.score > 8) },
    { title: "Consistency is Key", desc: "Practiced 7 days in a row", icon: History, earned: false },
    { title: "Officer Material", desc: "Readiness Score >8.5", icon: ShieldCheck, earned: history.some(h => h.score > 8.5) }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1200px] mx-auto w-full">
      <div className="bg-olq-card border border-olq-border rounded-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-olq-gold/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-olq-gold/20 rounded-full blur-xl group-hover:bg-olq-gold/40 transition-all duration-500" />
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-olq-bg rounded-full flex items-center justify-center border-2 border-olq-gold shadow-[0_0_30px_rgba(197,160,89,0.2)] relative z-10 overflow-hidden">
              <User className="text-olq-gold/60 w-12 h-12 sm:w-16 sm:h-16" />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-display uppercase tracking-wider mb-2">
              {user?.isAdmin ? 'Admin Officer' : 'Candidate'}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-6 text-gray-400 mb-6">
              <div className="flex items-center gap-2 text-sm font-mono bg-olq-bg px-3 py-1.5 rounded-lg border border-olq-border">
                <Mail className="w-4 h-4 text-olq-gold/60" />
                {user?.email || 'No email provided'}
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-4 text-center min-w-[120px]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display mb-1">Total Attempts</p>
                <p className="text-2xl font-bold text-white font-mono">{isLoading ? '-' : stats.total}</p>
              </div>
              <div className="bg-olq-bg/50 border border-olq-border rounded-lg p-4 text-center min-w-[120px]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display mb-1">Average Score</p>
                <p className="text-2xl font-bold text-olq-gold font-mono">{isLoading ? '-' : stats.avg}</p>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex gap-4">
            <button 
              onClick={logout}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/30 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all font-display w-full md:w-auto text-xs"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-olq-card border border-olq-border rounded-xl p-6 shadow-sm">
          <h3 className="text-[11px] font-bold text-olq-gold uppercase tracking-[0.2em] font-display mb-6 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Achievement Badges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className={cn(
                  "border rounded-xl p-4 flex gap-4 transition-all",
                  badge.earned 
                    ? "bg-olq-gold/5 border-olq-gold/30 shadow-[0_0_15px_rgba(197,160,89,0.05)]" 
                    : "bg-olq-bg border-olq-border opacity-50 grayscale"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                    badge.earned ? "bg-olq-gold/20 text-olq-gold border-olq-gold/50" : "bg-gray-800 text-gray-500 border-gray-700"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={cn("text-xs font-bold uppercase tracking-wider mb-1", badge.earned ? "text-white" : "text-gray-500")}>
                      {badge.title}
                    </h4>
                    <p className="text-[10px] text-gray-400">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-olq-card border border-olq-border rounded-xl p-6 shadow-sm flex flex-col h-full">
          <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] font-display mb-6 flex items-center gap-2">
            <History className="w-4 h-4 text-gray-400" />
            Recent Activity
          </h3>
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
               <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
               <History className="w-8 h-8 text-gray-700" />
               <p className="text-xs text-gray-500 uppercase tracking-widest font-display">No Activity Yet</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {history.slice(0, 5).map((h, i) => {
                const diffTime = Math.abs(new Date().getTime() - h.date.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const timeString = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
                
                return (
                  <div key={i} className="flex items-center justify-between border-b border-olq-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-olq-bg border border-olq-border flex items-center justify-center">
                        <Star className="w-4 h-4 text-olq-gold/60" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-200">Completed AI Practice: {h.protocol}</p>
                        <p className="text-[10px] text-gray-500">{timeString}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-olq-gold font-mono">{h.score.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
