import React, { useMemo } from 'react';
import { useGamificationStore, getNextLevelXP, getCurrentLevelXP } from '../stores/gamificationStore';
import { motion } from 'motion/react';
import { Flame, Star } from 'lucide-react';
import { cn } from '../utils';

export default function XPBar() {
  const { data } = useGamificationStore();

  const nextXP = getNextLevelXP(data.xp);
  const currentLevelXP = getCurrentLevelXP(data.xp);
  const progressInLevel = nextXP > currentLevelXP ? ((data.xp - currentLevelXP) / (nextXP - currentLevelXP)) * 100 : 100;

  return (
    <div className="flex items-center gap-3">
      {/* Streak */}
      {data.streak > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <Flame className="w-3 h-3 text-orange-500" />
          <span className="text-[10px] font-bold font-mono text-orange-400">{data.streak}</span>
        </div>
      )}

      {/* XP / Level */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Star className="w-3 h-3 text-olq-gold" />
          <span className="text-[10px] font-bold text-olq-gold uppercase tracking-widest font-display">{data.levelTitle}</span>
        </div>
        <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressInLevel}%` }}
            className="h-full bg-gradient-to-r from-olq-olive to-olq-gold rounded-full"
          />
        </div>
        <span className="text-[9px] font-mono text-gray-500">{data.xp} XP</span>
      </div>
    </div>
  );
}
