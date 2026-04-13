import { create } from 'zustand';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, increment, serverTimestamp } from 'firebase/firestore';

export interface GamificationData {
  xp: number;
  level: number;
  levelTitle: string;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalSessions: number;
  totalPracticeMinutes: number;
  badges: string[];
}

interface GamificationState {
  data: GamificationData;
  isLoaded: boolean;
  load: (uid: string) => Promise<void>;
  addXP: (uid: string, amount: number, reason: string) => Promise<void>;
  recordActivity: (uid: string) => Promise<void>;
  checkAndAwardBadge: (uid: string, badgeId: string) => Promise<boolean>;
}

const LEVEL_THRESHOLDS = [
  { xp: 0, title: 'Recruit' },
  { xp: 100, title: 'Cadet' },
  { xp: 300, title: 'Gentleman Cadet' },
  { xp: 600, title: 'Officer' },
  { xp: 1000, title: 'Captain' },
  { xp: 1500, title: 'Major' },
  { xp: 2500, title: 'Colonel' },
  { xp: 4000, title: 'Brigadier' },
  { xp: 6000, title: 'Commandant' },
  { xp: 10000, title: 'Elite' },
];

export const BADGE_DEFINITIONS = [
  { id: 'first_blood', title: 'First Blood', desc: 'Completed your first practice session', icon: 'Target', olq: 'Initiative' },
  { id: 'flash_thinker', title: 'Flash Thinker', desc: 'Completed 50 WAT words', icon: 'Zap', olq: 'Effective Intelligence' },
  { id: 'story_weaver', title: 'Story Weaver', desc: 'Completed 10 TAT stories', icon: 'BookOpen', olq: 'Power of Expression' },
  { id: 'cool_head', title: 'Cool Head', desc: 'Scored 8+ on Emotional Stability', icon: 'Shield', olq: 'Self Confidence' },
  { id: 'decision_maker', title: 'Decision Maker', desc: 'Completed 30 SRT situations', icon: 'Brain', olq: 'Reasoning Ability' },
  { id: 'streak_3', title: 'Consistent', desc: '3-day practice streak', icon: 'Flame', olq: 'Determination' },
  { id: 'streak_7', title: 'Disciplined', desc: '7-day practice streak', icon: 'Flame', olq: 'Determination' },
  { id: 'streak_30', title: 'Iron Will', desc: '30-day practice streak', icon: 'Trophy', olq: 'Determination' },
  { id: 'officer_material', title: 'Officer Material', desc: 'Readiness Score > 8.5', icon: 'Award', olq: 'All OLQs' },
  { id: 'ai_analyst', title: 'AI Analyst', desc: 'Completed 10 AI assessments', icon: 'Brain', olq: 'Effective Intelligence' },
  { id: 'oir_ace', title: 'OIR Ace', desc: 'Scored 80%+ on OIR', icon: 'Lightbulb', olq: 'Reasoning Ability' },
  { id: 'team_player', title: 'Team Player', desc: 'Completed all GTO exercises', icon: 'Users', olq: 'Cooperation' },
];

function getLevelInfo(xp: number): { level: number; title: string } {
  let lvl = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      lvl = i;
      break;
    }
  }
  return { level: lvl, title: LEVEL_THRESHOLDS[lvl].title };
}

export function getNextLevelXP(currentXP: number): number {
  for (const t of LEVEL_THRESHOLDS) {
    if (currentXP < t.xp) return t.xp;
  }
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].xp;
}

export function getCurrentLevelXP(currentXP: number): number {
  let current = 0;
  for (const t of LEVEL_THRESHOLDS) {
    if (currentXP >= t.xp) current = t.xp;
  }
  return current;
}

const DEFAULT_DATA: GamificationData = {
  xp: 0,
  level: 0,
  levelTitle: 'Recruit',
  streak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalSessions: 0,
  totalPracticeMinutes: 0,
  badges: [],
};

export const useGamificationStore = create<GamificationState>((set, get) => ({
  data: DEFAULT_DATA,
  isLoaded: false,

  load: async (uid: string) => {
    try {
      if (db.app.options.apiKey === 'mock_api_key') {
        set({ data: { ...DEFAULT_DATA, xp: 250, level: 1, levelTitle: 'Cadet', streak: 3, totalSessions: 12, badges: ['first_blood', 'streak_3'] }, isLoaded: true });
        return;
      }
      const ref = doc(db, 'gamification', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data() as GamificationData;
        const info = getLevelInfo(d.xp);
        set({ data: { ...d, level: info.level, levelTitle: info.title }, isLoaded: true });
      } else {
        await setDoc(ref, DEFAULT_DATA);
        set({ data: DEFAULT_DATA, isLoaded: true });
      }
    } catch (err) {
      console.error('Failed to load gamification:', err);
      set({ data: DEFAULT_DATA, isLoaded: true });
    }
  },

  addXP: async (uid: string, amount: number, _reason: string) => {
    const current = get().data;
    const newXP = current.xp + amount;
    const info = getLevelInfo(newXP);
    const updated = { ...current, xp: newXP, level: info.level, levelTitle: info.title };
    set({ data: updated });

    try {
      if (db.app.options.apiKey !== 'mock_api_key') {
        await setDoc(doc(db, 'gamification', uid), updated, { merge: true });
      }
    } catch (err) {
      console.error('Failed to save XP:', err);
    }
  },

  recordActivity: async (uid: string) => {
    const current = get().data;
    const today = new Date().toISOString().split('T')[0];
    const wasYesterday = (() => {
      if (!current.lastActiveDate) return false;
      const last = new Date(current.lastActiveDate);
      const diff = new Date(today).getTime() - last.getTime();
      return diff === 86400000;
    })();
    const isSameDay = current.lastActiveDate === today;

    let newStreak = current.streak;
    if (!isSameDay) {
      newStreak = wasYesterday ? current.streak + 1 : 1;
    }

    const updated: GamificationData = {
      ...current,
      streak: newStreak,
      longestStreak: Math.max(current.longestStreak, newStreak),
      lastActiveDate: today,
      totalSessions: current.totalSessions + (isSameDay ? 0 : 1),
    };
    set({ data: updated });

    try {
      if (db.app.options.apiKey !== 'mock_api_key') {
        await setDoc(doc(db, 'gamification', uid), updated, { merge: true });
      }
    } catch (err) {
      console.error('Failed to record activity:', err);
    }
  },

  checkAndAwardBadge: async (uid: string, badgeId: string) => {
    const current = get().data;
    if (current.badges.includes(badgeId)) return false;
    const updated = { ...current, badges: [...current.badges, badgeId] };
    set({ data: updated });

    try {
      if (db.app.options.apiKey !== 'mock_api_key') {
        await setDoc(doc(db, 'gamification', uid), updated, { merge: true });
      }
    } catch (err) {
      console.error('Failed to award badge:', err);
    }
    return true;
  },
}));
