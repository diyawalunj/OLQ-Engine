import React from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp } from 'lucide-react';
import { cn } from '../utils';
import { useGamificationStore } from '../stores/gamificationStore';

// Mock leaderboard data (in production — from Firestore aggregate)
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Vikram S.', entry: 'NDA', xp: 8750, level: 'Commandant', streak: 42, score: 8.9 },
  { rank: 2, name: 'Priya K.', entry: 'CDS', xp: 7200, level: 'Brigadier', streak: 38, score: 8.5 },
  { rank: 3, name: 'Arjun M.', entry: 'NDA', xp: 6100, level: 'Brigadier', streak: 29, score: 8.2 },
  { rank: 4, name: 'Sneha R.', entry: 'AFCAT', xp: 5400, level: 'Colonel', streak: 25, score: 7.9 },
  { rank: 5, name: 'Rahul D.', entry: 'CDS', xp: 4800, level: 'Colonel', streak: 21, score: 7.6 },
  { rank: 6, name: 'Ananya P.', entry: 'TES', xp: 3900, level: 'Major', streak: 18, score: 7.3 },
  { rank: 7, name: 'Karan J.', entry: 'NDA', xp: 3200, level: 'Major', streak: 14, score: 7.0 },
  { rank: 8, name: 'Meera B.', entry: 'AFCAT', xp: 2800, level: 'Captain', streak: 12, score: 6.8 },
  { rank: 9, name: 'Rohan T.', entry: 'CDS', xp: 2100, level: 'Captain', streak: 9, score: 6.5 },
  { rank: 10, name: 'Divya N.', entry: 'NDA', xp: 1500, level: 'Officer', streak: 7, score: 6.2 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-xs font-mono text-gray-500 w-5 text-center">{rank}</span>;
};

export default function LeaderboardTab() {
  const { data } = useGamificationStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="bg-olq-card border border-olq-border rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
            <Trophy className="text-yellow-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider font-display">National Leaderboard</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Top Candidates Across India</p>
          </div>
        </div>
      </div>

      {/* Your Position */}
      <div className="bg-olq-gold/5 border border-olq-gold/20 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-olq-gold/20 flex items-center justify-center border border-olq-gold/40">
            <Star className="w-5 h-5 text-olq-gold" />
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">Your Position</p>
            <p className="text-[10px] text-gray-400">{data.levelTitle} • {data.xp} XP</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold font-mono text-olq-gold">—</span>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Unranked</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-olq-card border border-olq-border rounded-xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-[60px_1fr_80px_80px_80px_80px] gap-0 border-b border-olq-border px-4 py-3 bg-olq-bg/50">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">#</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Candidate</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">XP</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">Level</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">Streak</span>
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">Score</span>
        </div>

        {MOCK_LEADERBOARD.map((entry) => (
          <div
            key={entry.rank}
            className={cn(
              "grid grid-cols-[60px_1fr_80px_80px_80px_80px] gap-0 items-center px-4 py-3 border-b border-olq-border/50 last:border-0 hover:bg-olq-bg/30 transition-colors",
              entry.rank <= 3 && "bg-olq-gold/[0.02]"
            )}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(entry.rank)}
            </div>

            <div>
              <p className="text-xs font-bold text-white">{entry.name}</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">{entry.entry}</p>
            </div>

            <span className="text-xs font-mono text-olq-gold text-center">{entry.xp.toLocaleString()}</span>

            <span className="text-[10px] font-bold text-gray-300 text-center uppercase tracking-wider">{entry.level}</span>

            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-mono text-orange-400">{entry.streak}</span>
            </div>

            <span className="text-xs font-bold font-mono text-white text-center">{entry.score}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] text-gray-600 italic">Rankings update daily based on XP, consistency, and readiness scores.</p>
    </div>
  );
}
