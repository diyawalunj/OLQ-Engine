import { create } from 'zustand';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface UserProfile {
  entryType: 'NDA' | 'CDS' | 'AFCAT' | 'TES' | '';
  previousAttempts: number;
  conferenceStatus: 'none' | 'screened_out' | 'conference_out' | 'recommended';
  targetDate: string; // ISO string
  motivation: string;
  selfAssessment: Record<string, number>; // OLQ name -> 1-10 rating
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

const DEFAULT_PROFILE: UserProfile = {
  entryType: '',
  previousAttempts: 0,
  conferenceStatus: 'none',
  targetDate: '',
  motivation: '',
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
