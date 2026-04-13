import { create } from 'zustand';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface UserProfile {
  entryTypes: string[];
  ssbStage: string;
  age: string;
  city: string;
  education: string;
  collegeName: string;
  passoutYear: string;
  isNCC: boolean;
  struggleAreas: string[];
  dailyHours: string;
  selfAssessment: Record<string, number>;
  onboardingComplete: boolean;
  createdAt: string;
}

interface OnboardingState {
  profile: UserProfile | null;
  isLoaded: boolean;
  setProfile: (profile: UserProfile) => void;
  loadProfile: (uid: string) => Promise<void>;
  saveProfile: (uid: string, profile: UserProfile) => Promise<void>;
}

export const OLQ_LIST = [
  'Effective Intelligence',
  'Reasoning Ability',
  'Organising Ability',
  'Power of Expression',
  'Social Adaptability',
  'Cooperation',
  'Sense of Responsibility',
  'Initiative',
  'Self Confidence',
  'Ability to Influence the Group',
  'Determination',
] as const;

export const ENTRY_TYPES = ['NDA', 'CDS', 'AFCAT', 'TES', 'NCC', 'Tech', 'Service Entry'] as const;

export const SSB_STAGES = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'appeared', label: 'Appeared Before' },
  { id: 'recommended', label: 'Recommended Before' },
  { id: 'reappearing_screened', label: 'Reappearing (Screened Out)' },
  { id: 'reappearing_conference', label: 'Reappearing (Conference Out)' },
] as const;

export const EDUCATION_LEVELS = ['10th', '12th', 'Graduation', 'Masters'] as const;

export const STRUGGLE_AREAS = [
  'Communication',
  'Time Management',
  'Confidence',
  'Consistency',
  'Psychology',
  'Interview',
  'GTO Tasks',
] as const;

export const DAILY_HOURS_OPTIONS = [
  '0-30 mins',
  '1-2 hours',
  '2-4 hours',
  '4+ hours',
  'Flexible',
] as const;

const DEFAULT_PROFILE: UserProfile = {
  entryTypes: [],
  ssbStage: '',
  age: '',
  city: '',
  education: '',
  collegeName: '',
  passoutYear: '',
  isNCC: false,
  struggleAreas: [],
  dailyHours: '',
  selfAssessment: Object.fromEntries(OLQ_LIST.map(olq => [olq, 5])),
  onboardingComplete: false,
  createdAt: new Date().toISOString(),
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  profile: null,
  isLoaded: false,
  setProfile: (profile) => set({ profile }),

  loadProfile: async (uid: string) => {
    try {
      if (db.app.options.apiKey === 'mock_api_key') {
        set({ profile: null, isLoaded: true });
        return;
      }
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        set({ profile: snap.data() as UserProfile, isLoaded: true });
      } else {
        set({ profile: null, isLoaded: true });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      set({ profile: null, isLoaded: true });
    }
  },

  saveProfile: async (uid: string, profile: UserProfile) => {
    try {
      if (db.app.options.apiKey !== 'mock_api_key') {
        await setDoc(doc(db, 'users', uid), profile, { merge: true });
      }
      set({ profile });
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  },
}));
